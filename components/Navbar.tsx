"use client";

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
  
  // Computed state for UI colors
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
          {/* Left Section - Flex 1 to balance logo */}
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

          {/* Center Section - Logo */}
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

          {/* Right Section - Flex 1 to balance logo */}
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
          {/* Desktop Nav Links */}
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

      {/* Mobile Nav Header (only visible on mobile) */}
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

export default Navbar;
