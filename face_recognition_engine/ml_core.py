# ml_core.py

import pandas as pd
import os
import glob
from pathlib import Path
from typing import List, Dict, Any, Optional
from concurrent.futures import ProcessPoolExecutor, as_completed
import multiprocessing
import requests

try:
    import face_recognition
except Exception:
    face_recognition = None


def generate_face_embeddings(image_path: str) -> List[Dict[str, Any]]:
    if face_recognition is None:
        print("Error: face_recognition is not installed. Install project requirements first.")
        return []
        
    try:
        from PIL import Image, ImageOps
        import numpy as np
        
        pil_img = Image.open(image_path).convert("RGB")
        try:
            pil_img = ImageOps.exif_transpose(pil_img)
        except Exception as exif_e:
            pass # fallback to original pil_img if exif_transpose fails
            
        # Speed Optimization: AI-Only Resize (Fast Resolution)
        # We only resize this temp copy for the face detection. 
        # Original high-res file is never touched.
        MAX_SIZE = (1024, 1024)
        pil_img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
        
        image = np.array(pil_img)
    except Exception as e:
        print(f"Error loading image {image_path}: {e}")
        return []
        
    face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=1)
    
    # Fallback for 0 faces: try upsample=2 (finds smaller faces)
    if not face_locations:
        print(f"\n  [info] 0 faces initially detected in {os.path.basename(image_path)}, retrying with upsample=2...", end="")
        face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=2)
        
    face_encodings = face_recognition.face_encodings(image, face_locations)
    results = []
    
    for location, encoding in zip(face_locations, face_encodings):
        top, right, bottom, left = location
        width = right - left
        height = bottom - top
        
        # Filter very small phantom boxes
        if width < 15 or height < 15:
            print(f"\n  [warn] Ignored tiny face boundary ({width}x{height}) in {os.path.basename(image_path)}", end="")
            continue
            
        results.append({
            "image_path": image_path,
            "face_location": str(location), 
            "embedding": encoding.tolist() 
        })
    return results


def build_face_database(image_directory: str, output_csv: str, album_id: Optional[str] = None, webhook_url: Optional[str] = None) -> pd.DataFrame:
    from pathlib import Path
    image_dir = Path(image_directory)
    
    # Recursively find all supported images
    image_paths = set(
        list(image_dir.rglob('*.jpg')) + \
        list(image_dir.rglob('*.jpeg')) + \
        list(image_dir.rglob('*.png')) + \
        list(image_dir.rglob('*.JPG')) + \
        list(image_dir.rglob('*.JPEG')) + \
        list(image_dir.rglob('*.PNG'))
    )
                  
    image_files = [str(p) for p in image_paths]
    
    if not image_files:
        print("No images found! Database will be empty.")
        return pd.DataFrame()
    
    # Send initial progress with total count for accurate UI
    if webhook_url and album_id:
        try:
            requests.post(webhook_url, json={
                "album_id": album_id,
                "current": 0,
                "total": len(image_files),
                "stage": "Initializing scan..."
            }, timeout=2)
        except:
            pass

def build_face_database(image_directory, output_csv, album_id, webhook_url=None, stop_event=None, job_metadata=None):
    # Search for common image formats recursively
    image_paths = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG', '*.WEBP']:
        image_paths.extend(Path(image_directory).rglob(ext))
    
    image_files = [str(p) for p in image_paths]
    total_images = len(image_files)
    print(f"\n📸 Found {total_images} images. Starting RESILIENT analysis...\n")
    
    if job_metadata is not None:
        job_metadata["total"] = total_images
        job_metadata["processed"] = 0
        job_metadata["failed"] = 0

    all_face_data = []
    
    # Use 75% of available cores
    num_workers = max(1, multiprocessing.cpu_count() - 1)

    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        # Submit all tasks
        future_to_image = {executor.submit(generate_face_embeddings, img): img for img in image_files}
        
        # Process results as they complete with a 45-second watchdog
        for idx, future in enumerate(as_completed(future_to_image), 1):
            # 1. CHECK CANCELLATION
            if stop_event and stop_event.is_set():
                print(f"\n🛑 STOP SIGNAL RECEIVED. Aborting analysis for {album_id}...")
                executor.shutdown(wait=False, cancel_futures=True)
                if job_metadata: job_metadata["status"] = "cancelled"
                return pd.DataFrame() 

            image_file = future_to_image[future]
            try:
                # 2. WATCHDOG: Individual image timeout (45s)
                face_data = future.result(timeout=45)
                all_face_data.extend(face_data)
                
                if job_metadata: job_metadata["processed"] += 1
                print(f"[{idx}/{total_images}] ✓ {os.path.basename(image_file)} ({len(face_data)} faces)", flush=True)
                
            except Exception as exc:
                # 3. ERROR HANDLING (Skip and track)
                if job_metadata: job_metadata["failed"] += 1
                if type(exc).__name__ == 'TimeoutError':
                    print(f"\n[{idx}/{total_images}] ⏩ SKIPPED: Scanning >45s for {os.path.basename(image_file)}", flush=True)
                else:
                    print(f"\n[{idx}/{total_images}] ❌ Skipping {os.path.basename(image_file)}: {exc}", flush=True)

            # 4. PROGRESS UPDATES (Every 5 images)
            is_last = (idx == total_images)
            if webhook_url and album_id and (idx % 5 == 0 or is_last):
                try:
                    requests.post(webhook_url, json={
                        "album_id": album_id,
                        "current": idx,
                        "total": total_images,
                        "last_photo": os.path.basename(image_file),
                        "stage": f"Analyzing Faces ({idx}/{total_images})..."
                    }, timeout=2) 
                except: pass
    
    df = pd.DataFrame(all_face_data)
    if not df.empty:
        # Convert absolute paths to relative paths
        df['image_path'] = df['image_path'].apply(lambda x: os.path.relpath(x, image_directory))
        
        os.makedirs(os.path.dirname(output_csv), exist_ok=True)
        df.to_csv(output_csv, index=False)
        print(f"\n✅ Analysis Complete. Faces: {len(df)}")
    else:
        print(f"\n⚠️ No faces detected across {total_images} images.")
        pd.DataFrame(columns=['image_path', 'face_id', 'embedding']).to_csv(output_csv, index=False)
        
    return df
