import os
import shutil

def final_merge():
    root = r'C:\Users\shreyas\ss-photo-films'
    old_p = os.path.join(root, 'public', 'Assets')
    new_p = os.path.join(root, 'public', 'assets')
    tmp_p = os.path.join(root, 'public', 'tmp_assets')

    if os.path.exists(old_p):
        if os.path.exists(tmp_p): shutil.rmtree(tmp_p)
        os.rename(old_p, tmp_p)
        print("Renamed Assets to tmp_assets")

    if not os.path.exists(new_p):
        os.makedirs(new_p)

    if os.path.exists(tmp_p):
        for r_dir, dirs, files in os.walk(tmp_p):
            rel = os.path.relpath(r_dir, tmp_p)
            target = os.path.join(new_p, rel.lower().replace(' ', '-'))
            if not os.path.exists(target): os.makedirs(target)
            for f in files:
                s = os.path.join(r_dir, f)
                d = os.path.join(target, f.lower().replace(' ', '-'))
                shutil.copy2(s, d)
        shutil.rmtree(tmp_p)
        print("Successfully merged and standardized assets.")

    # Code update
    exts = ('.ts', '.tsx', '.js', '.jsx', '.css', '.json')
    for subdir, dirs, files in os.walk(root):
        if any(x in subdir for x in ['node_modules', '.next', '.git']): continue
        for file in files:
            if file.endswith(exts):
                p = os.path.join(subdir, file)
                with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                new_c = content.replace('/Assets/', '/assets/')
                # specific common files that had spaces or caps
                new_c = new_c.replace('occasion-wedding.jpg', 'occasion-wedding.jpg')
                new_c = new_c.replace('logo (1).png', 'logo-(1).png')
                new_c = new_c.replace('logo (2).png', 'logo-(2).png')
                new_c = new_c.replace('Prewedding/SSP02832.JPG', 'prewedding/ssp02832.jpg')
                new_c = new_c.replace('Wedding/1SSP01096 copy.jpg', 'wedding/1ssp01096-copy.jpg')
                if new_c != content:
                    with open(p, 'w', encoding='utf-8') as f:
                        f.write(new_c)
                    print(f"Updated: {file}")

if __name__ == "__main__":
    final_merge()
