import os

def hard_delete_why_ss():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # We want to remove lines 206 to 212 (1-indexed, so 205 to 211 in 0-indexed)
    # But files change, so I'll find them by content.
    
    start_index = -1
    for i, line in enumerate(lines):
        if 'className="text-[10px]' in line and 'Why SS? 😊' not in line:
            # Check if this is likely the top one
            # Usually the top one has text-[10px] class
            if i > 0 and 'onClick={() => setShowWhySs(true)}' in lines[i-1]:
                 # Found it
                 start_index = i - 2 # <button
                 break
    
    if start_index == -1:
        # Try finding by the EXACT button content
        for i, line in enumerate(lines):
            if '<button' in line and i + 5 < len(lines):
                if 'setShowWhySs(true)' in lines[i+2] and 'Why SS? 😊' in lines[i+5]:
                    start_index = i
                    break

    if start_index != -1:
        # Delete 7 lines
        del lines[start_index : start_index + 7]
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"Successfully deleted button starting at index {start_index}.")
    else:
        print("Could not find button by line matching.")

if __name__ == "__main__":
    hard_delete_why_ss()
