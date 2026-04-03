import os

def fix_booking():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old = '''                       <button 
                         type="submit"
                         disabled={loading}
                         className="w-full max-w-sm py-6 bg-[#4A4D4A] text-white text-[12px] font-black tracking-[0.4em] uppercase rounded-xl hover:bg-gold hover:text-dark transition-all shadow-xl shadow-dark/10 disabled:opacity-50"
                       >
                          {loading ? "PROCESSING..." : "PROCEED TO PAY"}
                       </button>'''
    
    new = '''                       <button 
                         type="submit"
                         disabled={loading}
                         className="w-full max-w-sm py-6 bg-[#4A4D4A] text-white text-[12px] font-black tracking-[0.4em] uppercase rounded-xl hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group shadow-xl shadow-dark/10 disabled:opacity-50"
                       >
                          <span className="relative z-10 flex items-center justify-center">
                             {loading ? "PROCESSING..." : "PROCEED TO PAY"}
                          </span>
                          {/* Shimmer Effect */}
                          <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                       </button>'''
    
    if old in content:
        content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed Booking Page")
    else:
        print("Booking Page old content not found")

def fix_join_team():
    path = r'c:\Users\shreyas\ss-photo-films\app\join-team\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old = 'className="w-full bg-dark text-gold font-bold uppercase tracking-[0.4em] text-sm py-6 shadow-2xl hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group"'
    new = 'className="w-full bg-dark text-gold font-bold uppercase tracking-[0.4em] text-sm py-6 rounded-xl shadow-2xl hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group"'
    
    if old in content:
        content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed Join Team Page")
    else:
        print("Join Team Page old content not found")

if __name__ == "__main__":
    fix_booking()
    fix_join_team()
