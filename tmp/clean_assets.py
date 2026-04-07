import os
import shutil

def clean_assets():
    root = r'C:\Users\shreyas\ss-photo-films'
    src_dir = os.path.join(root, 'public', 'Assets')
    dst_dir = os.path.join(root, 'public', 'assets')

    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)

    if os.path.exists(src_dir):
        for root_dir, dirs, files in os.walk(src_dir):
            rel_path = os.path.relpath(root_dir, src_dir)
            target_root = os.path.join(dst_dir, rel_path.lower().replace(' ', '-'))
            if not os.path.exists(target_root):
                os.makedirs(target_root)
            
            for file in files:
                src_file = os.path.join(root_dir, file)
                dst_file = os.path.join(target_root, file.lower().replace(' ', '-'))
                shutil.copy2(src_file, dst_file)
        
        # shutil.rmtree(src_dir) # Removing it later to be safe
        print("Copied and standardized all assets to public/assets.")

    # Update codebase
    extensions = ('.ts', '.tsx', '.js', '.jsx', '.css', '.json')
    for subdir, dirs, files in os.walk(root):
        if any(x in subdir for x in ['node_modules', '.next', '.git']): continue
        for file in files:
            if file.endswith(extensions):
                p = os.path.join(subdir, file)
                with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                new_content = content.replace('/Assets/', '/assets/')
                # Common space/caps fixes
                fixes = {
                    'occasion-wedding.jpg': 'occasion-wedding.jpg',
                    'occasion-maternity.jpg': 'occasion-maternity.jpg',
                    'occasion-baby.jpg': 'occasion-baby.jpg',
                    'hero-bg.jpg': 'hero-bg.jpg',
                    'hero-bg2.jpg': 'hero-bg2.jpg',
                    'hero-bg3.jpg': 'hero-bg3.jpg',
                    'Prewedding/SSP02832.JPG': 'prewedding/ssp02832.jpg',
                    'Wedding/1SSP01096 copy.jpg': 'wedding/1ssp01096-copy.jpg',
                    'logo (1).png': 'logo-(1).png',
                    'logo (2).png': 'logo-(2).png'
                }
                for old, new in fixes.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(p, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {file}")

if __name__ == "__main__":
    clean_assets()
