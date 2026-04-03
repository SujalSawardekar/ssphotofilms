import os

def final_fix():
    path = r'c:\Users\shreyas\ss-photo-films\app\booking\page.tsx'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_dashboard = 'className="w-full md:w-auto px-12 py-5 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-dark transition-all shadow-xl">My Dashboard</button>'
    new_dashboard = 'className="w-full md:w-auto px-12 py-5 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group shadow-xl"><span className="relative z-10">My Dashboard</span><div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" /></button>'
    
    old_home = 'className="w-full md:w-auto px-12 py-5 border-2 border-dark text-dark rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-dark hover:text-white transition-all">Home</button>'
    new_home = 'className="w-full md:w-auto px-12 py-5 border-2 border-dark text-dark rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-dark hover:text-white transition-all duration-500 relative overflow-hidden group"><span className="relative z-10">Home</span><div className="absolute top-0 -left-full w-full h-full bg-dark/5 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" /></button>'
    
    if old_dashboard in content:
        content = content.replace(old_dashboard, new_dashboard)
    if old_home in content:
        content = content.replace(old_home, new_home)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Finalized Booking success buttons")

if __name__ == "__main__":
    final_fix()
