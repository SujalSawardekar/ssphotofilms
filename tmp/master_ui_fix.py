import os

def update_booking():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix name label alignment
    content = content.replace('text-center">First Name</p>', 'text-left">First Name</p>')
    content = content.replace('text-center">Last Name</p>', 'text-left">Last Name</p>')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated Booking page labels.")

def update_join_team():
    path = r'c:\Users\shreyas\ss-photo-films\app\join-team\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Change background
    content = content.replace('bg-dark p-12 md:p-20', 'bg-[#FAF9F6] p-12 md:p-20')
    
    # Change text colors
    content = content.replace('text-white font-cinzel text-4xl', 'text-dark font-cinzel text-4xl')
    content = content.replace('text-secondary text-sm md:text-base', 'text-secondary/80 text-sm md:text-base')
    content = content.replace('text-white font-cinzel text-4xl', 'text-dark font-cinzel text-4xl') # already handled?
    
    # Update benefits section
    content = content.replace('text-sm font-bold text-white uppercase', 'text-sm font-bold text-dark uppercase')
    content = content.replace('text-sm text-white/40 uppercase', 'text-sm text-secondary/60 uppercase')
    
    # Add shimmer/rounded-xl to other buttons if needed
    # Return to career link
    old_link = 'className="flex items-center space-x-4 text-xs font-bold text-gold uppercase border-b border-gold/30'
    new_link = 'className="inline-flex items-center space-x-4 text-xs font-bold text-dark bg-gold/10 px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group'
    if old_link in content:
        content = content.replace(old_link, new_link)
        # Add shimmer div inside the link if we find the closing tag
        # This is more complex, I'll do a simpler match
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated Join Team page styles.")

def update_contact():
    path = r'c:\Users\shreyas\ss-photo-films\app\contact\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add shimmer/rounded-xl to submit button
    old_btn = 'className="bg-[#3A3A3A] hover:bg-dark text-white font-bold uppercase tracking-widest text-xs px-10 py-4 rounded transition-colors"'
    new_btn = 'className="bg-[#3A3A3A] text-white px-12 py-5 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden group shadow-2xl hover:bg-dark hover:scale-105"'
    
    if old_btn in content:
        # Replacement for the button open tag
        content = content.replace(old_btn, new_btn)
        # Insertion of span and shimmer inside the button
        content = content.replace('SUBMIT\n                </button>', '<span class="relative z-10">SUBMIT</span>\n                    <div class="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />\n                </button>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(f.read() if False else content)
    print("Updated Contact page button.")

if __name__ == "__main__":
    update_booking()
    update_join_team()
    update_contact()
