# 📸 Face Recognition Shortlisting — FINAL TEAM INTEGRATION GUIDE

> **MANDATORY:** READ THIS ENTIRE DOCUMENT TO AVOID COMMON INTEGRATION ERRORS.

---

## 🔄 How the System Works (Quick Overview)

Our engine is a standalone **Face Detection and Comparison Microservice**. It runs on port `5001`.

```
Admin uploads ZIP of event photos
        ↓
POST /api/owner/process_album  ← Call this ONCE per event
        ↓
Our engine builds a local CSV database of every face detected.
        ↓
Guest visits your website, uploads their selfie
        ↓
POST /api/v1/shortlist  ← Call this per guest
        ↓
Returns JSON list of photo filenames that contain that face.
```

---

## 🚀 Setup (Run by the Backend Team)

### 1. Requirements
- Python 3.10+
- `pip install -r requirements.txt`

### 2. Start the engine
```bash
python app.py
```
Default: **http://127.0.0.1:5001**

---

## 📡 API Endpoints (The most important part)

### Endpoint 1 — Process Album (Event Setup)
`POST /api/owner/process_album`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `album_id` | text | ✅ Yes | Unique name (e.g., `GALA_2025`) |
| `album_zip` | file | RECOMMENDED | **Direct file upload (100% reliable)** |
| `drive_link` | text | OPTIONAL | Link to a **ZIP file** or **Folder** on Drive |

> ⚠️ **IMPORTANT DRIVE NOTE:** Direct folder links are often blocked by Google's anti-bot protection. **WE HIGHLY RECOMMEND UPLOADING THE ALBUM AS A .ZIP FILE** (either directly or via a Drive link to the zip) for 100% reliability.

**Example (Node.js / cURL):**
```bash
# RECOMMENDED: Direct ZIP Upload
curl -X POST http://127.0.0.1:5001/api/owner/process_album \
     -F "album_id=TEST_ALBUM" \
     -F "album_zip=@test_album.zip"
```

---

### Endpoint 2 — Shortlist (Guest Action)
`POST /api/v1/shortlist`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `face_image` | file | ✅ Yes | Guest's selfie |
| `album_id` | text | ✅ Yes | ID used during processing |

**Example (cURL):**
```bash
curl -X POST http://127.0.0.1:5001/api/v1/shortlist \
     -F "album_id=TEST_ALBUM" \
     -F "face_image=@guest_selfie.jpg"
```

---

## 📁 Final Deliverable Contents

| File | Purpose |
|------|---------|
| `app.py` | The main server. |
| `album_processor.py` | Handles downloads and extraction. |
| `ml_core.py` | The actual face detection logic. |
| `shortlisting_pipeline.py` | The face comparison logic. |
| `test_album.zip` | **USE THIS TO TEST YOUR SETUP IMMEDIATELY.** |
| `requirements.txt` | Dependencies. |

---

## ✅ Pre-Flight Checklist
1. [ ] Install requirements.
2. [ ] Run `python app.py`.
3. [ ] Run the `curl` command with `test_album.zip` to confirm it processes correctly.
4. [ ] Run the `shortlist` command with a selfie from the album to see matches.

---

## ❓ FAQ

**Q: Why does the Drive link fail?**  
A: Google detects automated access and blocks "Folder" downloads. Solutions: 1) Upload a ZIP file instead, or 2) Share the folder with "Anyone with link" and pray Google is in a good mood. **Always prefer the direct ZIP upload.**

**Q: How long does processing take?**  
A: Approx. 5-10 seconds per image depending on CPU performance.

**Q: Where are the database files?**  
A: They are stored in the `/databases` folder as `.csv` files. Each album gets its own file.
