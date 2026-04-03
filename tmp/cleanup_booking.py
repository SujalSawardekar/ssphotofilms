import os
import re

def cleanup_booking():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to find the duplicate button at the top
    # 206:                        <button 
    # 207:                           type="button"
    # 208:                           onClick={() => setShowWhySs(true)}
    # ...
    # 212:                         </button>
    
    pattern = r'<button\s+type="button"\s+onClick={() => setShowWhySs\(true\)}\s+className="text-\[10px\].*?Why SS\? 😊.*?</button>'
    
    # We want to remove the one in the package features section specifically.
    # The one in the notes section has className="text-gold border-b..."
    
    match = re.search(pattern, content, re.DOTALL)
    if match:
        # Check if it's the one with text-[10px] vs the one in notes (which we want to keep)
        if 'text-[10px]' in match.group(0):
            content = content.replace(match.group(0), '')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Successfully removed duplicate Why SS button.")
        else:
            print("Found a button but it's not the one we're looking for.")
    else:
        print("Button not found with regex.")

if __name__ == "__main__":
    cleanup_booking()
