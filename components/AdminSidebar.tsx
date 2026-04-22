"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Upload, 
  QrCode, 
  Users, 
  MessageSquare,
  LogOut,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const adminLinks = [
  { label: 'DASHBOARD',  href: '/admin',           icon: LayoutDashboard },
  { label: 'BOOKINGS',   href: '/admin/bookings',  icon: Calendar },
  { label: 'SESSIONS',   href: '/admin/events',    icon: ImageIcon },
  { label: 'QUERIES',    href: '/admin/queries',   icon: MessageSquare },
  { label: 'TEAM',       href: '/admin/team',      icon: Users },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const initial = user?.name?.charAt(0).toUpperCase() || 'S';

  return (
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen?.(false)}
            className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[280px] bg-[#1A1A1A] flex flex-col font-manrope overflow-hidden
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Brand Header */}
        <div className="px-8 pt-10 pb-8 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="group inline-block">
            <h1 className="font-cinzel text-2xl font-bold text-gold tracking-widest leading-none group-hover:opacity-80 transition-opacity">
              SS PHOTO
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mt-1">Admin Panel</p>
          </Link>
          
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpen?.(false)}
            className="md:hidden text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-8 py-8 border-b border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center shrink-0">
            <span className="text-dark font-bold text-lg font-cinzel">{initial}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm truncate uppercase tracking-widest font-cinzel">
              {user?.name || 'Shreyas Sawardekar'}
            </p>
            <p className="text-gold text-xs uppercase tracking-[0.2em] mt-0.5">Lead Creative</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-6 py-8 space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-white/30 mb-6 px-2">Main Menu</p>
          {adminLinks.map((link) => {
            const isActive = link.href !== '#' && pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen?.(false)}
                className={`flex items-center space-x-4 px-4 py-3.5 rounded-md transition-all group ${
                  isActive 
                    ? 'bg-gold text-dark' 
                    : 'text-white/50 hover:text-gold hover:bg-white/5'
                }`}
              >
                <link.icon size={18} strokeWidth={1.5} className={isActive ? 'text-dark' : 'text-gold/60 group-hover:text-gold'} />
                <span className="text-sm font-bold tracking-[0.2em] uppercase">{link.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-dark rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-6 pb-8">
          <button
            onClick={logout}
            className="flex items-center space-x-4 px-4 py-3.5 w-full text-white/30 hover:text-red-400 transition-colors group"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="text-sm font-bold tracking-[0.2em] uppercase">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
