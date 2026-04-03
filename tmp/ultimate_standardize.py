import os
import shutil

def ultimate_standardize():
    root = r'C:\Users\shreyas\ss-photo-films'
    public_path = os.path.join(root, 'public')
    up_path = os.path.join(public_path, 'Assets')
    lo_path = os.path.join(public_path, 'assets')
    
    if not os.path.exists(lo_path):
        os.makedirs(lo_path)
    
    if os.path.exists(up_path):
        # Move everything from Assets to assets
        for entry in os.listdir(up_path):
            src = os.path.join(up_path, entry)
            dst = os.path.join(lo_path, entry.lower().replace(' ', '-'))
            if os.path.isdir(src):
                # Copy tree
                if os.path.exists(dst): shutil.rmtree(dst)
                shutil.move(src, dst)
            else:
                shutil.move(src, dst)
        
        # Now remove Assets
        shutil.rmtree(up_path)
        print("Merged Assets into assets and removed redundant folder.")

    # Lowercase everything in assets
    for root_dir, dirs, files in os.walk(lo_path):
        for name in files + dirs:
            old = os.path.join(root_dir, name)
            new = os.path.join(root_dir, name.lower().replace(' ', '-'))
            if old != new:
                if os.path.exists(new): 
                    if os.path.isdir(old): shutil.rmtree(old)
                    else: os.remove(old)
                else: os.rename(old, new)
    
    print("Lowercased and hyphenated all files in public/assets.")

if __name__ == "__main__":
    ultimate_standardize()
