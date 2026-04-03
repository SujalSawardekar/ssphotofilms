import os
import re

def final_fix_why_ss():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Precise regex to find the </ul> followed by </div> in the package summary section
    # Based on the view_file output:
    # 205:                        </ul>
    # 206:                     </div>
    
    pattern = r'(</ul>\s+)(</div>\s+<div className="pt-6 border-t)'
    button_html = r'''\1   <button 
                          type="button"
                          onClick={() => setShowWhySs(true)}
                          className="text-[10px] font-black text-gold uppercase tracking-[0.2em] border-b border-gold/30 hover:border-gold transition-colors pt-4 block"
                        >
                          Why SS? 😊
                        </button>\n                     \2'''
    
    new_content = re.sub(pattern, button_html, content)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully applied regex fix for Why SS button.")
    else:
        # Try an even simpler pattern if the first one fails
        pattern2 = r'(</ul>\s+)(</div>)'
        new_content2 = re.sub(pattern2, button_html, content)
        if new_content2 != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content2)
            print("Applied simpler regex fix for Why SS button.")
        else:
            print("Regex pattern not found.")

if __name__ == "__main__":
    final_fix_why_ss()
