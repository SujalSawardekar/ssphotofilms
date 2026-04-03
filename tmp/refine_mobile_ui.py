import os

def refine_mobile_ui():
    # 1. Navbar: Hide top utility strip on mobile
    navbar_path = r'c:\Users\shreyas\ss-photo-films\components\Navbar.tsx'
    if os.path.exists(navbar_path):
        with open(navbar_path, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('"transition-all duration-500 border-b",', '"transition-all duration-500 border-b hidden md:block",')
        with open(navbar_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated Navbar utility strip.")

    # 2. Services Page: Horizontal Scrolling Tabs
    services_path = r'c:\Users\shreyas\ss-photo-films\app\services\page.tsx'
    if os.path.exists(services_path):
        with open(services_path, 'r', encoding='utf-8') as f:
            content = f.read()
        old_classes = 'flex flex-wrap justify-center md:justify-between items-center border-b border-dark/10 mb-16 px-4'
        new_classes = 'flex flex-nowrap overflow-x-auto scrollbar-hide justify-start items-center border-b border-dark/10 mb-16 px-4 gap-8 pb-2'
        content = content.replace(old_classes, new_classes)
        content = content.replace('className={`text-lg md:text-xl font-medium pb-4 px-2', 'className={`text-lg md:text-xl font-medium pb-4 px-2 whitespace-nowrap shrink-0')
        with open(services_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated Services categories.")

    # 3. Client Dashboard: Responsive Layout
    sidebar_path = r'c:\Users\shreyas\ss-photo-films\components\ClientSidebar.tsx'
    if os.path.exists(sidebar_path):
        with open(sidebar_path, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('aside className="w-[280px]', 'aside className="hidden md:flex w-[280px]')
        
        bottom_nav = r"""
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#1A1A1A] border-t border-white/10 flex items-center justify-around py-3 px-6 z-[100]">
        {clientLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.tab;
          return (
            <button
              key={link.tab}
              onClick={() => onTabChange(link.tab as any)}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-gold' : 'text-white/40'}`}
            >
              <Icon size={18} />
              <span className="text-[8px] font-bold tracking-widest uppercase">{link.label.split(' ')[1] || link.label}</span>
            </button>
          );
        })}
        <button onClick={logout} className="flex flex-col items-center gap-1 text-white/40">
           <LogOut size={18} />
           <span className="text-[8px] font-bold tracking-widest uppercase">EXIT</span>
        </button>
      </div>
    </aside>"""
        
        if '</aside>' in content:
            content = content.replace('</aside>', bottom_nav)
            
        with open(sidebar_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated Client Sidebar.")

if __name__ == "__main__":
    refine_mobile_ui()
