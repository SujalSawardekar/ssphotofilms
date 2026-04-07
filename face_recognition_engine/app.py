# app.py

import os
import uuid
import zipfile
from flask import Flask, render_template, request, send_from_directory, session, redirect, url_for, after_this_request
from flask_cors import CORS
from werkzeug.utils import secure_filename
# Core ML Logic
from shortlisting_pipeline import shortlist_images_for_user, load_and_prepare_database 
# NEW: Automation Logic for the Owner's workflow
from album_processor import automate_album_processing 
import requests

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'user_uploads')
ALBUM_FOLDER = os.path.join(BASE_DIR, 'album_images')
DATABASES_DIR = os.path.join(BASE_DIR, 'databases')

app = Flask(__name__)
CORS(app) 

# ENFORCE LARGE LIMITS (10GB)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024 * 1024 
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALBUM_FOLDER'] = ALBUM_FOLDER
app.secret_key = os.environ.get('SECRET_KEY', 'a_very_strong_secret_key')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ALBUM_FOLDER, exist_ok=True)
os.makedirs(DATABASES_DIR, exist_ok=True)

# AI Engine Startup
ALBUMS = {}

def get_album_data(album_id):
    if album_id not in ALBUMS:
        csv_path = os.path.join(DATABASES_DIR, f"{album_id}.csv")
        if os.path.exists(csv_path):
            ALBUMS[album_id] = load_and_prepare_database(csv_path)
            print(f"Loaded {album_id} into memory.")
        else:
            # Removed error print for non-existent databases during initialization
            return None
    return ALBUMS[album_id]

# Pre-load only if explicit databases are found - WEDDING_2025 pre-load removed
# get_album_data('WEDDING_2025')
    
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}
ALLOWED_UPLOAD_EXTENSIONS = {'png', 'jpg', 'jpeg', 'zip', 'rar', 'war'}

def allowed_file(filename, include_zip=False):
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    allowed = ALLOWED_UPLOAD_EXTENSIONS if include_zip else ALLOWED_IMAGE_EXTENSIONS
    return ext in allowed

import threading

# --- THREAD & JOB MANAGEMENT ---
ACTIVE_TASKS = {} # { album_id: {'thread': Thread, 'stop_event': Event} }
JOB_STATUS = {} # { album_id: {status: str, total: int, processed: int, failed: int, start_time: float} }

def run_async_album_processing(drive_link, album_id, zip_path, webhook_url, stop_event):
    """Background thread function for processing."""
    try:
        print(f"\n[ASYNC-TASK] Starting background task for {album_id}...")
        
        # Initialize job tracking
        import time
        JOB_STATUS[album_id] = {
            "status": "processing",
            "total": 0,
            "processed": 0,
            "failed": 0,
            "start_time": time.time(),
            "last_stage": "Starting Analysis..."
        }

        # We pass JOB_STATUS to the processor so it can update live counters
        is_success, error_msg = automate_album_processing(
            drive_link, album_id, zip_path, webhook_url, stop_event, JOB_STATUS[album_id]
        )
        
        # Cleanup temp zip if it exists
        if zip_path and os.path.exists(zip_path):
            try: os.remove(zip_path)
            except: pass

        if is_success:
            JOB_STATUS[album_id]["status"] = "completed"
            
            # Clear cache for the new database
            if album_id in ALBUMS:
                del ALBUMS[album_id]
            get_album_data(album_id)
            
            # Send Completion Signal to Next.js
            NEXTJS_BASE_URL = os.environ.get('NEXTJS_URL', 'http://127.0.0.1:3000')
            COMPLETION_WEBHOOK = f"{NEXTJS_BASE_URL}/api/admin/complete-session"
            try:
                requests.post(COMPLETION_WEBHOOK, json={
                    "album_id": album_id,
                    "status": "Ready"
                }, timeout=10)
            except: pass
            print(f"[ASYNC-TASK] Completed {album_id} successfully.")
        else:
            JOB_STATUS[album_id]["status"] = "failed"
            JOB_STATUS[album_id]["error"] = error_msg
            print(f"[ASYNC-TASK] Failed {album_id}: {error_msg}")
            
    except Exception as e:
        JOB_STATUS[album_id]["status"] = "failed"
        JOB_STATUS[album_id]["error"] = str(e)
        print(f"[ASYNC-CRASH] Unhandled error in background thread: {e}")
    finally:
        # Remove from active tasks ONLY if this is still the current thread
        if album_id in ACTIVE_TASKS and ACTIVE_TASKS[album_id]['stop_event'] == stop_event:
            del ACTIVE_TASKS[album_id]

@app.route('/api/job-status/<album_id>', methods=['GET'])
def get_job_status(album_id):
    """API for the frontend to poll for live results."""
    status = JOB_STATUS.get(album_id)
    if not status:
        return {"status": "unknown", "message": "No job found for this ID"}, 404
    return status

@app.route('/api/owner/process_album', methods=['POST'])
def process_album_trigger():
    print(f"\n[AI-TRACE] New Request Received!")
    
    NEXTJS_BASE_URL = os.environ.get('NEXTJS_URL', 'http://127.0.0.1:3000')
    PROGRESS_WEBHOOK = f"{NEXTJS_BASE_URL}/api/admin/ai-progress"
    
    album_id = request.form.get('album_id', '').strip()
    drive_link = request.form.get('drive_link', '').strip() or None
    album_zip_file = request.files.get('album_zip')
    
    if not album_id:
        return {"status": "error", "message": "Missing album_id"}, 400

    # 1. KILL EXISTING TASK IF RUNNING
    if album_id in ACTIVE_TASKS:
        print(f"[THREADING] Signalling stop for existing task: {album_id}")
        ACTIVE_TASKS[album_id]['stop_event'].set()
        import time
        time.sleep(0.5)

    # 2. SOURCE VALIDATION
    album_path = os.path.join(app.config['ALBUM_FOLDER'], album_id)
    zip_path = None
    if album_zip_file and album_zip_file.filename != '' and allowed_file(album_zip_file.filename, include_zip=True):
        zip_filename = f"{uuid.uuid4()}_{secure_filename(album_zip_file.filename)}"
        zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)
        album_zip_file.save(zip_path)
    elif not drive_link and not os.path.exists(album_path):
        return {"status": "error", "message": "No source found (Drive, Zip, or Folder)"}, 400
    
    # 3. START BACKGROUND TASK
    stop_event = threading.Event()
    thread = threading.Thread(
        target=run_async_album_processing, 
        args=(drive_link, album_id, zip_path, PROGRESS_WEBHOOK, stop_event)
    )
    ACTIVE_TASKS[album_id] = {'thread': thread, 'stop_event': stop_event}
    thread.start()

    return {
        "status": "accepted", 
        "album_id": album_id,
        "message": "AI Task Queued successfully."
    }, 202

@app.route('/')
def upload_form():
    session.clear()
    return render_template('index.html')

@app.route('/shortlist', methods=['POST'])
def upload_image():
    if 'face_image' not in request.files: return "No file part", 400
    file = request.files['face_image']
    if file.filename == '' or not allowed_file(file.filename): return "Invalid file type.", 400
    ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = str(uuid.uuid4()) + '.' + ext
    user_image_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(user_image_path)
    # Selfie selection for legacy UI
    album_id = 'WEDDING_2025' 
    known_data = get_album_data(album_id)
    if not known_data: return "Album database not found", 400
    
    shortlisted_paths = shortlist_images_for_user(
        user_image_path=user_image_path,
        known_data=known_data 
    )
    # Preserve the search image as requested by the user
    # os.remove(user_image_path)
    
    # Store the result - note that shortlisted_paths are relative paths from CSV
    session['shortlisted_images'] = shortlisted_paths
    return redirect(url_for('refine_selection'))

@app.route('/refine_selection')
def refine_selection():
    shortlisted_images = session.get('shortlisted_images', [])
    return render_template('refinement.html', shortlisted_images=shortlisted_images)

@app.route('/remove_image/<filename>', methods=['POST'])
def remove_image(filename):
    shortlisted_images = session.get('shortlisted_images', [])
    if filename in shortlisted_images:
        shortlisted_images.remove(filename)
        session['shortlisted_images'] = shortlisted_images
        session.modified = True
    return redirect(url_for('refine_selection'))

@app.route('/api/v1/shortlist', methods=['POST'])
def shortlist_api():
    if 'face_image' not in request.files:
        return {"error": "No face_image provided in the form data"}, 400
        
    file = request.files['face_image']
    if file.filename == '' or not allowed_file(file.filename):
        return {"error": "Invalid file type. Allowed: png, jpg, jpeg"}, 400
        
    ext = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = str(uuid.uuid4()) + '.' + ext
    user_image_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(user_image_path)
    
    album_id = request.form.get('album_id', 'WEDDING_2025')
    known_data = get_album_data(album_id)
    if not known_data:
        # Preserve the selfie even if album data is not found
        return {"error": f"Album database '{album_id}' not found. Please process album first."}, 404
    
    # Run the pipeline against the cached CSV data
    shortlisted_paths = shortlist_images_for_user(
        user_image_path=user_image_path,
        known_data=known_data 
    )
    # Preserve the search image as requested by the user
    # os.remove(user_image_path)
    
    return {
        "status": "success",
        "matches_found": len(shortlisted_paths),
        "matched_filenames": shortlisted_paths, # These are relative paths from the CSV
        "message": "Shortlisting complete"
    }, 200

@app.route('/download_all')
def download_all():
    shortlisted_images = session.get('shortlisted_images', [])
    if not shortlisted_images:
        return "No images to download", 400
    
    album_id = session.get('current_album_id', 'WEDDING_2025')
    
    zip_filename = f"event_photos_{uuid.uuid4()}.zip"
    zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)
    
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for filename in shortlisted_images:
            image_path = os.path.join(app.config['ALBUM_FOLDER'], album_id, filename)
            if os.path.exists(image_path):
                zipf.write(image_path, arcname=filename)
    
    @after_this_request
    def cleanup(response):
        try:
            os.remove(zip_path)
        except:
            pass
        return response
    
    return send_from_directory(app.config['UPLOAD_FOLDER'], zip_filename, as_attachment=True)

@app.route('/serve_image/<album_id>/<path:filename>')
def serve_image(album_id, filename):
    from flask import send_file
    import urllib.parse
    
    # Decoded double-encoded paths just in case
    decoded_filename = urllib.parse.unquote(filename)
    
    # Normalize slashes for Windows compatibility
    safe_filename = decoded_filename.replace('/', os.path.sep).replace('\\', os.path.sep)
    
    # If the database has absolute paths (old scans), just take the filename
    if os.path.isabs(safe_filename):
        safe_filename = os.path.basename(safe_filename)
        
    directory = os.path.join(app.config['ALBUM_FOLDER'], album_id)
    full_path = os.path.normpath(os.path.join(directory, safe_filename))
    
    print(f"\n[AI-TRACE] Serving Request: Event={album_id}, File={filename}")
    print(f"[AI-TRACE] Resolved Path: {full_path}")
    
    # Strategy 1: Check the full relative path
    if os.path.exists(full_path) and os.path.isfile(full_path):
        return send_file(full_path)
            
    # Strategy 2: Check only the basename (backwards compatibility)
    fallback_filename = os.path.basename(safe_filename)
    fallback_path = os.path.normpath(os.path.join(directory, fallback_filename))
    if os.path.exists(fallback_path) and os.path.isfile(fallback_path):
        print(f"[AI-DEBUG] Found via fallback (basename): {fallback_path}")
        return send_file(fallback_path)
            
    # Strategy 3: Deep search (if name is unique enough)
    # This ensures that even if subfolder structure changed, we find it
    print(f"[AI-ALERT] File NOT FOUND. Attempting deep search for: {fallback_filename}")
    from pathlib import Path
    album_path = Path(directory)
    if album_path.exists():
        matches = list(album_path.rglob(fallback_filename))
        if matches:
            print(f"[AI-DEBUG] Found via deep search: {matches[0]}")
            return send_file(str(matches[0]))

    return "Image not found", 404

@app.route('/api/health')
def health_check():
    return {"status": "alive", "port": 5001, "message": "AI Engine is active"}

if __name__ == '__main__':
    host = os.environ.get('HOST', '127.0.0.1')
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Flask app on {host}:{port}")
    app.run(host=host, port=port)
