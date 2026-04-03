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
MATCH_THRESHOLD = 0.53


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


def get_face_embedding_from_user_image(image_path: str) -> Optional[np.ndarray]:
    print(f"Processing user image: {os.path.basename(image_path)}")
    face_data = generate_face_embeddings(image_path)
    if len(face_data) == 0:
        print("WARNING: No face found in the user's uploaded image.")
        return None
    elif len(face_data) > 1:
        print("WARNING: More than one face found. Using the first detected face.")
    return np.array(face_data[0]['embedding'])


def shortlist_images_for_user(user_image_path: str, known_data: Optional[tuple[List[np.ndarray], List[str]]]) -> List[str]:
    if face_recognition is None:
        print("ERROR: face_recognition is not installed. Install project requirements first.")
        return []
    if known_data is None:
        print("ERROR: Database data is not loaded.")
        return []
    known_embeddings, known_image_paths = known_data
    user_embedding = get_face_embedding_from_user_image(user_image_path)
    if user_embedding is None:
        return []
    print("--- Starting Face Comparison ---")
    matches = face_recognition.compare_faces(
        known_face_encodings=known_embeddings, 
        face_encoding_to_check=user_embedding, 
        tolerance=MATCH_THRESHOLD
    )
    distances = face_recognition.face_distance(known_embeddings, user_embedding)
    try:
        min_dist = float(distances.min())
        mean_dist = float(distances.mean())
    except Exception:
        min_dist = None
        mean_dist = None
    print(f"Distance stats — min: {min_dist}, mean: {mean_dist}, threshold: {MATCH_THRESHOLD}")
    indexed = list(enumerate(distances))
    indexed.sort(key=lambda x: x[1])
    print("Top 10 closest images (distance, path):")
    for idx, dist in indexed[:10]:
        print(f"  {dist:.4f}  -> {known_image_paths[idx]}")
    shortlisted_image_paths = set()
    for is_match, image_path in zip(matches, known_image_paths):
        if is_match:
            shortlisted_image_paths.add(image_path) 
    final_list = list(shortlisted_image_paths)
    print(f"Comparison complete. Found {len(final_list)} unique matching images.")
    return final_list
