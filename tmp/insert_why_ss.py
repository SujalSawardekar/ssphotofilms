import os

def insert_why_ss():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    target = '</ul>\n                     </div>'
    replacement = '</ul>\n                        <button \n                          type="button"\n                          onClick={() => setShowWhySs(true)}\n                          className="text-[10px] font-black text-gold uppercase tracking-[0.2em] border-b border-gold/30 hover:border-gold transition-colors pt-2"\n                        >\n                          Why SS? 😊\n                        </button>\n                     </div>'
    
    if target in content:
        content = content.replace(target, replacement)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully inserted Why SS button.")
    else:
        print("Target not found.")

if __name__ == "__main__":
    insert_why_ss()
