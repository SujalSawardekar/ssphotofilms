import sys
import zipfile
from pathlib import Path
from ml_core import build_face_database
import gdown
import os
import requests
import patoolib

BASE_DIR = Path(__file__).resolve().parent

def automate_album_processing(drive_link: str, album_id: str, zip_path: str = None, webhook_url: str = None, stop_event=None, job_metadata=None):
    if stop_event and stop_event.is_set(): return False, "Cancelled"
    print(f"\n--- STARTING AUTOMATED PIPELINE for Album ID: {album_id} ---")

    if job_metadata is not None:
        job_metadata["last_stage"] = "Initializing Folder..."

    ALBUM_FOLDER = BASE_DIR / 'album_images' / album_id
    DATABASE_CSV = BASE_DIR / 'databases' / f"{album_id}.csv"

    ALBUM_FOLDER.mkdir(parents=True, exist_ok=True)
    DATABASE_CSV.parent.mkdir(parents=True, exist_ok=True)

    def report_stage(stage, current=0, total=100):
        if job_metadata is not None:
            job_metadata["last_stage"] = stage
        if webhook_url and album_id:
            try:
                requests.post(webhook_url, json={
                    "album_id": album_id,
                    "current": current,
                    "total": total,
                    "stage": stage
                }, timeout=5)
            except:
                pass

    # OPTION 1: A ZIP was directly uploaded via API
    if zip_path:
        report_stage("Extracting archive (ZIP/RAR/WAR)...")
        print(f"Extracting archive file: {zip_path}")
        try:
            patoolib.extract_archive(zip_path, outdir=str(ALBUM_FOLDER))
        except Exception as e:
            print(f"ERROR extracting archive: {e}")
            return False, f"Extraction error: {e}"

    # OPTION 2: A Google Drive link was provided (Folder or ZIP)
    elif drive_link and drive_link.startswith('http'):
        report_stage("Syncing with Google Drive...")
        print(f"Downloading from Google Drive: {drive_link}")
        try:
            if '/folders/' in drive_link:
                try:
                    gdown.download_folder(url=drive_link, output=str(ALBUM_FOLDER), quiet=False, use_cookies=False, remaining_ok=True)
                except Exception as folder_e:
                    gdown.download(url=drive_link, output=str(ALBUM_FOLDER), quiet=False, fuzzy=True, speed=None)
            else:
                tmp_archive = ALBUM_FOLDER / '_downloaded_archive'
                gdown.download(url=drive_link, output=str(tmp_archive), quiet=False, fuzzy=True)
                
                if tmp_archive.exists():
                    try:
                        patoolib.extract_archive(str(tmp_archive), outdir=str(ALBUM_FOLDER))
                        tmp_archive.unlink() 
                    except: pass
        except Exception as e:
            print(f"Drive sync error: {e}")

    # --- IMAGE DISCOVERY ---
    report_stage("Discovering Images...")
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG', '*.WEBP']
    image_paths = set()
    for ext in extensions:
        image_paths.update(list(ALBUM_FOLDER.rglob(ext)))
    
    image_count = len(image_paths)
    if job_metadata is not None:
        job_metadata["total"] = image_count
    
    # --- DATABASE BUILDING ---
    report_stage("Starting Face Analysis...", 0, max(1, image_count))
    try:
        build_face_database(str(ALBUM_FOLDER), str(DATABASE_CSV), album_id, webhook_url, stop_event, job_metadata)
        return True, "Success"
    except Exception as e:
        print(f"Face Analysis Error: {e}")
        return False, str(e)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("Face Recognition Database Builder (CLI)")
    print("="*60)
    test_id = sys.argv[1] if len(sys.argv) > 1 else 'WEDDING_2025'
    test_link = sys.argv[2] if len(sys.argv) > 2 else None
    test_zip = sys.argv[3] if len(sys.argv) > 3 else None
    success = automate_album_processing(test_link, test_id, test_zip)
    if success:
        print("\nSUCCESS! Database ready.")
    else:
        print("\nFAILED! Check the errors above.")
    print("="*60 + "\n")
