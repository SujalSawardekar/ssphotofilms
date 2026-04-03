import os

def revert_ui_changes():
    # 1. Navbar.tsx: Restore hamburger and mobile menu
    navbar_path = r'c:\Users\shreyas\ss-photo-films\components\Navbar.tsx'
    if os.path.exists(navbar_path):
        content = r\"\"\""use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Menu, X, Mail, Phone, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = ({ isLightPage = false, transparentDarkText = false }: { isLightPage?: boolean, transparentDarkText?: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'GALLERIES', href: '/gallery' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'SERVICES', href: '/services' },
    { name: 'GET IN TOUCH', href: '/contact' },
  ];

  const dashboardLink = user?.role === 'admin' ? '/admin' : user?.role === 'client' ? '/client' : '/attendee/scan-qr';
  
  const solidBg = isScrolled || (isLightPage && !transparentDarkText);
  const darkColors = isScrolled || isLightPage || transparentDarkText;

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-[100] transition-all duration-500 font-manrope",
      solidBg ? "bg-background shadow-sm border-b border-dark/5" : "bg-transparent border-none",
      isScrolled ? "py-2" : "py-4"
    )}>
      {/* Top Utility Bar */}
      <div className={cn(
        "transition-all duration-500 border-b",
        isScrolled ? "pb-2" : "pb-4",
        darkColors ? "border-dark/10" : "border-white/10"
      )}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
          <div className="flex-1 flex items-center">
            <div className={cn(
              "flex items-center space-x-2 transition-colors duration-500",
              darkColors ? "text-dark/70" : "text-white/80"
            )}>
              <Mail size={14} className="opacity-60" />
              <a href="mailto:ssphotographyofficial08@gmail.com" className="text-xs tracking-widest font-medium hover:text-gold transition-colors">
                ssphotographyofficial08@gmail.com
              </a>
            </div>
          </div>

          <Link href="/" className="flex items-center justify-center">
             <div className="h-10 md:h-14 lg:h-16 relative">
                <img 
                  src="/assets/logo.png" 
                  alt="SS PHOTO & FILMS" 
                  className={cn(
                    "h-full w-auto object-contain transition-all duration-500",
                    !darkColors && "brightness-0 invert" 
                  )} 
                />
             </div>
          </Link>

          <div className="flex-1 flex items-center justify-end space-x-6 lg:space-x-12">
            <div className={cn(
              "hidden sm:flex items-center space-x-2 transition-colors duration-500",
              darkColors ? "text-dark/70" : "text-white/80"
            )}>
              <Phone size={14} className="opacity-60" />
              <a href="tel:+917741083155" className="text-xs tracking-widest font-medium">
                +91 7741083155
              </a>
            </div>

            {user ? (
               <div className="flex items-center space-x-4">
                  <Link 
                     href={dashboardLink} 
                     className={cn(
                        "px-5 py-2 text-xs uppercase font-bold tracking-widest transition-all duration-300 rounded-[4px]",
                        darkColors ? "bg-dark text-white hover:bg-gold hover:text-dark" : "bg-white text-dark hover:bg-gold"
                     )}
                  >
                     {user.name.split(' ')[0]}
                  </Link>
                  <button onClick={logout} className={cn(
                    "transition-colors",
                    darkColors ? "text-dark/50 hover:text-red-500" : "text-white/50 hover:text-white"
                  )}>
                    <LogOut size={14}/>
                  </button>
               </div>
            ) : (
               <Link 
                 href="/login"
                 className={cn(
                    "px-8 py-2 text-xs uppercase font-bold tracking-widest transition-all duration-300 rounded-[5px]",
                    darkColors ? "bg-dark text-white hover:bg-gold hover:text-dark" : "bg-white text-dark hover:bg-gold"
                 )}
               >
                 LOGIN
               </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="py-4 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-center text-center">
          <div className="flex items-center space-x-12 lg:space-x-16">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-xs lg:text-sm uppercase tracking-[0.3em] font-bold transition-all relative py-1",
                  darkColors 
                    ? (pathname === link.href ? "text-dark" : "text-dark/40 hover:text-dark") 
                    : (pathname === link.href ? "text-white" : "text-white/60 hover:text-white")
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div 
                    layoutId="navTab"
                    className={cn(
                      "absolute -bottom-1 left-0 right-0 h-[1px] mx-auto w-1/2",
                      darkColors ? "bg-dark" : "bg-white"
                    )} 
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Nav Header */}
      <div className="md:hidden py-4 px-6 flex items-center justify-between">
          <Link href="/" className="h-8">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className={cn("h-full w-auto", !darkColors && "brightness-0 invert")} 
            />
          </Link>
          <button
            className={cn("p-2 transition-colors", darkColors ? "text-dark" : "text-white")}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-background border-t border-dark/5 md:hidden overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col items-center py-12 space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[12px] uppercase tracking-[0.4em] font-bold text-dark/70 hover:text-dark transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-8 flex flex-col items-center space-y-6 w-full px-12"
              >
                 {user ? (
                   <Link 
                     href={dashboardLink} 
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="w-full text-center py-4 border border-dark text-dark text-xs uppercase tracking-[0.3em] font-bold"
                   >
                     MY ACCOUNT
                   </Link>
                 ) : (
                   <Link
                     href="/login"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="w-full text-center py-4 bg-background text-dark border border-dark text-xs uppercase tracking-[0.3em] font-bold"
                   >
                     LOGIN
                   </Link>
                 )}
                  <div className="flex items-center space-x-8 pt-4">
                    <a href="tel:+917741083155" className="text-dark/50 hover:text-gold transition-all"><Phone size={20}/></a>
                    <a href="mailto:ssphotographyofficial08@gmail.com" className="text-dark/50 hover:text-gold transition-all"><Mail size={20}/></a>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;\"\"\"
        with open(navbar_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Restored Navbar.")

    # 2. Services Page
    services_path = r'c:\Users\shreyas\ss-photo-films\app\services\page.tsx'
    if os.path.exists(services_path):
        with open(services_path, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('flex-nowrap overflow-x-auto scrollbar-hide justify-start', 'flex-wrap justify-center md:justify-between')
        content = content.replace('whitespace-nowrap shrink-0', '')
        with open(services_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Restored Services Page.")

    # 3. Client Dashboard
    sidebar_path = r'c:\Users\shreyas\ss-photo-films\components\ClientSidebar.tsx'
    if os.path.exists(sidebar_path):
        with open(sidebar_path, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('aside className="hidden md:flex w-[280px]', 'aside className="w-[280px]')
        with open(sidebar_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Restored Client Sidebar.")

    client_page_path = r'c:\Users\shreyas\ss-photo-films\app\client\page.tsx'
    if os.path.exists(client_page_path):
        with open(client_page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '{/* Mobile Top Tabs */}' in content:
            start = content.find('{/* Mobile Top Tabs */}')
            end = content.find('{/* === BOOKINGS TAB === */}')
            if start != -1 and end != -1:
                content = content[:start] + content[end:]
        
        # Restore padding
        content = content.replace('pb-20 md:pb-0', '')
        # Restore Chat Toggle logic
        if '{/* Back button for mobile */}' in content:
             # Just revert the cn call and hidden md:flex
             content = content.replace('selectedQueryId ? "hidden md:flex" : "flex"', '"flex"')
             content = content.replace('!selectedQueryId ? "hidden md:flex" : "flex"', '"flex"')
             # Remove back button block
             start = content.find('{/* Back button for mobile */}')
             end = content.find('<AnimatePresence mode="wait">')
             if start != -1 and end != -1:
                 content = content[:start] + content[end:]

        with open(client_page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Restored Client Page.")

if __name__ == "__main__":
    revert_ui_changes()
