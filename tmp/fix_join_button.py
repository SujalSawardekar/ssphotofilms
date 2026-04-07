import os

def final_fix_join():
    path = r'c:\Users\shreyas\ss-photo-films\app\join-team\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_btn = 'className="inline-flex items-center space-x-4 text-xs font-bold text-dark bg-gold/10 px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group pb-1 hover:border-gold transition-colors mx-auto tracking-[0.2em]"'
    new_btn = 'className="inline-flex items-center space-x-4 text-xs font-bold text-dark bg-gold/10 px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group mx-auto tracking-[0.2em]"'
    
    if old_btn in content:
        content = content.replace(old_btn, new_btn)
        # Handle the inner span/svg wrapping
        old_inner = '<span>Return to Careers</span>\n                       <ArrowRight size={14} />'
        new_inner = '<span className="relative z-10 flex items-center justify-center space-x-4"><span>Return to Careers</span><ArrowRight size={14} /></span><div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />'
        if old_inner in content:
            content = content.replace(old_inner, new_inner)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Finalized Join Team return button.")

if __name__ == "__main__":
    final_fix_join()
