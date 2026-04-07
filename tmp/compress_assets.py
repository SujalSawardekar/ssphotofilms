import os
from PIL import Image

def compress_images():
    assets_dir = r"c:\Users\shreyas\ss-photo-films\public\assets"
    # Target large backgrounds first
    targets = ["hero-bg.jpg", "hero-bg2.jpg", "hero-bg3.jpg", "about-photo.jpg", "studio.jpg"]
    
    for filename in os.listdir(assets_dir):
        if filename.endswith(".jpg") or filename.endswith(".jpeg"):
            path = os.path.join(assets_dir, filename)
            size_mb = os.path.getsize(path) / (1024 * 1024)
            
            # If it's over 1MB, we definitely need to compress
            if size_mb > 1.0 or filename in targets:
                print(f"Compressing {filename} ({size_mb:.2f} MB)...")
                try:
                    img = Image.open(path)
                    # Convert to RGB if needed
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # For huge images, resize them to reasonable 2K width
                    if img.width > 2560:
                        ratio = 2560 / img.width
                        new_size = (2560, int(img.height * ratio))
                        img = img.resize(new_size, Image.Resampling.LANCZOS)
                        
                    img.save(path, "JPEG", quality=75, optimize=True)
                    new_size_mb = os.path.getsize(path) / (1024 * 1024)
                    print(f"  -> Done: {new_size_mb:.2f} MB")
                except Exception as e:
                    print(f"  -> Error: {e}")

if __name__ == "__main__":
    compress_images()
