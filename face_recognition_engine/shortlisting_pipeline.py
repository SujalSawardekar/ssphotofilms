# shortlisting_pipeline.py

import numpy as np
import pandas as pd
import os
import ast
from typing import List, Optional
from ml_core import generate_face_embeddings 

try:
    import face_recognition
except Exception:
    face_recognition = None

DATABASE_CSV = "face_embeddings_database.csv"
MATCH_THRESHOLD = 0.40


def load_and_prepare_database(csv_path: str) -> Optional[tuple[List[np.ndarray], List[str]]]:
    if not os.path.exists(csv_path):
        print(f"ERROR: Database file not found at {csv_path}.")
        return None
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"ERROR: Could not read database CSV at {csv_path}: {e}")
        return None
    if df.empty:
        print("ERROR: Database is empty. No faces were detected in the album.")
        return None
    if 'embedding' not in df.columns or 'image_path' not in df.columns:
        print("ERROR: Database CSV is missing required columns: embedding, image_path")
        return None
    print(f"Database loaded: {len(df)} face records found.")
    known_embeddings = []
    known_image_paths = []
    for _, row in df.iterrows():
        try:
            embedding = np.array(ast.literal_eval(row['embedding']))
            image_path = str(row['image_path'])
        except Exception:
            continue
        known_embeddings.append(embedding)
        known_image_paths.append(image_path)
    if not known_embeddings:
        print("ERROR: No valid embeddings found in database.")
        return None
    return known_embeddings, known_image_paths


def get_face_embedding_from_user_image(image_path: str, try_flip: bool = False) -> List[np.ndarray]:
    """Extracts embeddings from user image. If try_flip=True, also tries horizontally flipped version."""
    from PIL import Image, ImageOps
    
    print(f"Processing user image: {os.path.basename(image_path)} (flip={try_flip})")
    
    all_embeddings = []
    
    # Process original
    face_data = generate_face_embeddings(image_path)
    if face_data:
        all_embeddings.append(np.array(face_data[0]['embedding']))
        
    # Process flipped (as a backup for mirrored selfies)
    if try_flip:
        try:
            pil_img = Image.open(image_path).convert("RGB")
            flipped_img = ImageOps.mirror(pil_img)
            temp_flip_path = image_path + ".flipped.jpg"
            flipped_img.save(temp_flip_path)
            
            flip_face_data = generate_face_embeddings(temp_flip_path)
            if flip_face_data:
                all_embeddings.append(np.array(flip_face_data[0]['embedding']))
                
            os.remove(temp_flip_path) # Cleanup
        except Exception as e:
            print(f"DEBUG: Mirror check failed: {e}")
            
    return all_embeddings


def shortlist_images_for_user(user_image_path: str, known_data: Optional[tuple[List[np.ndarray], List[str]]]) -> List[str]:
    if face_recognition is None:
        print("ERROR: face_recognition is not installed.")
        return []
    if known_data is None:
        return []
    
    known_embeddings, known_image_paths = known_data
    
    # 1. GET BOTH ORIGINAL AND FLIPPED EMBEDDINGS (Solves Selfie Mirror Problem)
    user_embeddings = get_face_embedding_from_user_image(user_image_path, try_flip=True)
    if not user_embeddings:
        print("WARNING: No faces detected in user search image.")
        return []
        
    print(f"--- Starting Face Comparison ({len(user_embeddings)} search vectors) ---")
    
    # 2. RUN SEARCH AGAINST ALL VARIATIONS
    matched_distance_map = {} # { image_path: best_distance }
    
    for u_embed in user_embeddings:
        distances = face_recognition.face_distance(known_embeddings, u_embed)
        for idx, dist in enumerate(distances):
            if dist <= MATCH_THRESHOLD:
                path = known_image_paths[idx]
                # Keep the best (lowest) distance for each image
                if path not in matched_distance_map or dist < matched_distance_map[path]:
                    matched_distance_map[path] = dist
    
    # 3. SORT RESULTS BY BEST DISTANCE (Quality First)
    shortlisted_image_paths = sorted(matched_distance_map.keys(), key=lambda x: matched_distance_map[x])
    
    print(f"Comparison complete. Found {len(shortlisted_image_paths)} matching images.")
    return shortlisted_image_paths
