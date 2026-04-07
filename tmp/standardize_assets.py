import os
import re

def standardize_assets():
    root_dir = r'c:\Users\shreyas\ss-photo-films'
    public_assets_path = os.path.join(root_dir, 'public', 'Assets')
    new_public_assets_path = os.path.join(root_dir, 'public', 'assets')

    # 1. Rename folder if it exists
    if os.path.exists(public_assets_path):
        if os.path.exists(new_public_assets_path):
            # Merge if both exist (unlikely)
            print("Both Assets and assets exist. Merging...")
        else:
            os.rename(public_assets_path, new_public_assets_path)
            print(f"Renamed {public_assets_path} to {new_public_assets_path}")

    # 2. Walk through public/assets and standardize file names (lowercase, no spaces)
    mapping = {}
    
    def process_dir(dir_path):
        for entry in os.listdir(dir_path):
            full_path = os.path.join(dir_path, entry)
            # Create a clean name: lowercase and spaces to hyphens
            clean_name = entry.lower().replace(' ', '-')
            new_full_path = os.path.join(dir_path, clean_name)
            
            if full_path != new_full_path:
                os.rename(full_path, new_full_path)
                print(f"Renamed file: {entry} -> {clean_name}")
            
            # Record the mapping from the original public-relative path to the new one
            # Note: We need to be careful with the mapping to handle all nesting
            rel_original = os.path.relpath(full_path, os.path.join(root_dir, 'public')).replace('\\', '/')
            rel_new = os.path.relpath(new_full_path, os.path.join(root_dir, 'public')).replace('\\', '/')
            mapping[rel_original] = rel_new
            
            if os.path.isdir(new_full_path):
                process_dir(new_full_path)

    if os.path.exists(new_public_assets_path):
        process_dir(new_public_assets_path)

    # 3. Search and Replace in Codebase
    # We'll do a simple string replace for '/Assets/' to '/assets/' 
    # and then handle the specific file mappings
    
    extensions = ('.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md')
    
    for subdir, dirs, files in os.walk(root_dir):
        if 'node_modules' in subdir or '.next' in subdir or '.git' in subdir:
            continue
            
        for file in files:
            if file.endswith(extensions):
                file_path = os.path.join(subdir, file)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                original_content = content
                
                # Replace the base folder
                content = content.replace('/Assets/', '/assets/')
                
                # Replace specific file paths handled in mapping
                # Sort mapping by length descending to avoid partial matches
                for old_rel, new_rel in sorted(mapping.items(), key=lambda x: len(x[0]), reverse=True):
                    # Only replace if it looks like a path (starts with /)
                    old_path = '/' + old_rel
                    new_path = '/' + new_rel
                    content = content.replace(old_path, new_path)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated paths in: {file}")

if __name__ == "__main__":
    standardize_assets()
