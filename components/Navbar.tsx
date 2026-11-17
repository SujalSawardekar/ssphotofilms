"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCms } from '@/lib/CmsContext';
import { Menu, X, Mail, Phone, LogOut } from 'lucide-react';
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
  const { editMode, isPreview } = useCms();
  const showEditorOffset = editMode && !isPreview;

  useEffect(() => {
    const handleScroll = () => {
      // Look for a full-viewport hero section on the current page
      const heroElement = document.querySelector('section.h-screen') || 
                          document.querySelector('section[class*="h-screen"]') ||
                          document.querySelector('section[class*="min-h-screen"]');

      // Transition only after scrolling past ~70% of the Hero section
      const threshold = heroElement 
        ? Math.max(heroElement.clientHeight * 0.7, 400) 
        : 60;

      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check once on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'GALLERIES', href: '/gallery' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'SERVICES', href: '/services' },
    { name: 'GET IN TOUCH', href: '/contact' },
  ];

  const dashboardLink = user?.role === 'admin' ? '/admin' : user?.role === 'client' ? '/client' : '/attendee/scan-qr';
  
  // Computed state for UI colors
  const darkColors = (!isScrolled && (isLightPage || transparentDarkText));

  return (
    <header className={cn(
      "fixed left-0 w-full z-[100] transition-all duration-500 ease-in-out font-manrope",
      showEditorOffset ? "top-16" : "top-0",
      isScrolled ? "py-3 px-4 md:px-8" : "py-4 px-0 bg-transparent"
    )}>
      
      <AnimatePresence mode="wait">
        {/* =========================================================================
            VARIANT 1: SHORTER COMPACT LUXURY BAR (Active AFTER Hero Section)
            Smoothly glides down as you exit the hero section, stays pinned on scroll.
           ========================================================================= */}
        {isScrolled ? (
          <motion.div
            key="scrolled-compact-pill"
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1080px] mx-auto px-5 py-2.5 rounded-full bg-dark/90 backdrop-blur-xl border border-gold/30 shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex items-center justify-between"
          >
            {/* Left: Shorter Compact Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-7 w-28 md:w-32 relative">
                <Image 
                  src="/assets/logo.png" 
                  alt="SS PHOTO & FILMS" 
                  fill
                  priority
                  className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" 
                />
              </div>
            </Link>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-[11px] lg:text-xs uppercase tracking-[0.22em] font-bold transition-all relative py-1",
                      isActive ? "text-gold" : "text-white/75 hover:text-white"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="compactNavTab"
                        className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-gold rounded-full" 
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Quick Action / Account / Mobile Toggle */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link 
                    href={dashboardLink} 
                    className="px-3.5 py-1 text-[10px] md:text-xs uppercase font-bold tracking-widest bg-gold/20 text-gold border border-gold/40 hover:bg-gold hover:text-dark rounded-full transition-all"
                  >
                    {user.name.split(' ')[0]}
                  </Link>
                  <button onClick={logout} className="text-white/60 hover:text-red-400 p-1 transition-colors">
                    <LogOut size={13}/>
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="hidden sm:inline-flex items-center px-4 py-1.5 text-[10px] md:text-xs uppercase font-bold tracking-widest bg-white/10 hover:bg-gold hover:text-dark text-white border border-white/20 hover:border-gold rounded-full transition-all"
                >
                  <span>LOGIN</span>
                </Link>
              )}

              {/* Mobile Menu Button on Shorter Bar */}
              <button
                className="md:hidden p-1 text-white/90 hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
              VARIANT 2: GRAND EDITORIAL HEADER (Active inside Hero Section)
              Spacious transparent header with top utility row + centered grand logo.
             ========================================================================= */
          <motion.div
            key="grand-hero-navbar"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Top Utility Bar */}
            <div className={cn(
              "hidden md:block transition-all duration-300 border-b pb-4",
              darkColors ? "border-dark/10" : "border-white/10"
            )}>
              <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
                {/* Left Section - Email */}
                <div className="flex-1 flex items-center">
                  <div className={cn(
                    "flex items-center space-x-2 transition-colors duration-300",
                    darkColors ? "text-dark/70" : "text-white/80"
                  )}>
                    <Mail size={14} className="opacity-60" />
                    <a href="mailto:ssphotographyofficial13@gmail.com" className="hidden md:inline-block text-xs tracking-widest font-medium hover:text-gold transition-colors">
                      ssphotographyofficial13@gmail.com
                    </a>
                  </div>
                </div>

                {/* Center Section - Grand Logo */}
                <Link href="/" className="flex items-center justify-center">
                  <div className="h-10 md:h-14 lg:h-16 w-[140px] md:w-[220px] lg:w-[320px] relative">
                    <Image 
                      src="/assets/logo.png" 
                      alt="SS PHOTO & FILMS" 
                      fill
                      priority
                      className={cn(
                        "object-contain transition-all duration-300",
                        !darkColors && "brightness-0 invert" 
                      )} 
                    />
                  </div>
                </Link>

                {/* Right Section - Phone & Login */}
                <div className="flex-1 flex items-center justify-end space-x-6 lg:space-x-12">
                  <div className={cn(
                    "hidden sm:flex items-center space-x-2 transition-colors duration-300",
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
                <nav className="flex items-center space-x-12 lg:space-x-16">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "text-xs lg:text-sm uppercase tracking-[0.3em] font-bold transition-all relative py-1",
                        darkColors 
                          ? (pathname === link.href ? "text-dark" : "text-dark/60 hover:text-dark") 
                          : (pathname === link.href ? "text-white" : "text-white/70 hover:text-white")
                      )}
                    >
                      {link.name}
                      {pathname === link.href && (
                        <motion.div 
                          layoutId="fullNavTab"
                          className={cn(
                            "absolute -bottom-1 left-0 right-0 h-[1.5px] mx-auto w-1/2",
                            darkColors ? "bg-dark" : "bg-white"
                          )} 
                        />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Mobile Top Header (when inside Hero section) */}
            <div className="md:hidden py-4 px-6 flex items-center justify-between">
              <Link href="/" className="h-8 w-40 relative">
                <Image 
                  src="/assets/logo.png" 
                  alt="Logo" 
                  fill
                  className={cn("object-contain", !darkColors && "brightness-0 invert")} 
                />
              </Link>
              <button
                className={cn("p-2 transition-colors", darkColors ? "text-dark" : "text-white")}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MOBILE MENU DRAWER OVERLAY
         ========================================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-16 bg-dark/95 backdrop-blur-2xl border border-gold/30 rounded-2xl md:hidden overflow-hidden shadow-2xl z-[110]"
          >
            <div className="flex flex-col items-center py-8 space-y-6">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-xs uppercase tracking-[0.35em] font-bold transition-colors",
                      pathname === link.href ? "text-gold" : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4 flex flex-col items-center space-y-4 w-full px-8"
              >
                {user ? (
                  <Link 
                    href={dashboardLink} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-gold text-dark text-xs uppercase tracking-[0.3em] font-bold rounded-full"
                  >
                    MY ACCOUNT
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-white/10 border border-gold/40 text-gold text-xs uppercase tracking-[0.3em] font-bold rounded-full hover:bg-gold hover:text-dark transition-all"
                  >
                    LOGIN
                  </Link>
                )}
                
                <div className="flex items-center space-x-8 pt-1">
                  <a href="tel:+917741083155" className="text-white/60 hover:text-gold transition-colors"><Phone size={18}/></a>
                  <a href="mailto:ssphotographyofficial13@gmail.com" className="text-white/60 hover:text-gold transition-colors"><Mail size={18}/></a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
