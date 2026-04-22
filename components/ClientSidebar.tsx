"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import {
  LayoutDashboard,
  CalendarDays,
  Image as ImageIcon,
  UserCircle,
  LogOut,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const clientLinks = [
  { label: 'MY BOOKINGS', href: '/client', icon: CalendarDays, tab: 'bookings' },
  { label: 'MY QUERIES', href: '/client?tab=queries', icon: ImageIcon, tab: 'queries' },
  { label: 'ACCOUNT', href: '/client?tab=account', icon: UserCircle, tab: 'account' },
];

interface ClientSidebarProps {
  activeTab: 'bookings' | 'queries' | 'account';
  onTabChange: (tab: 'bookings' | 'queries' | 'account') => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function ClientSidebar({ activeTab, onTabChange, isOpen, setIsOpen }: ClientSidebarProps) {
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  const handleTabClick = (tab: 'bookings' | 'queries' | 'account') => {
    onTabChange(tab);
    setIsOpen?.(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
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

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[280px] bg-[#1A1A1A] flex flex-col font-manrope overflow-hidden
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Brand Header */}
        <div className="px-8 pt-10 pb-8 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="group inline-block">
            <h1 className="font-cinzel text-xl font-bold text-gold tracking-widest leading-none group-hover:opacity-80 transition-opacity">
              SS PHOTO
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mt-1">My Account</p>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen?.(false)}
            className="md:hidden text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gold/80 flex items-center justify-center shrink-0">
            <span className="text-dark font-bold font-cinzel">{initial}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-xs truncate uppercase tracking-wider font-cinzel">
              {user?.name || 'User'}
            </p>
            <p className="text-gold/70 text-xs mt-0.5">Client</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-8 space-y-1">
          <p className="text-xs uppercase tracking-[0.4em] text-white/30 mb-6 px-3">Navigations</p>

          {/* My Bookings */}
          <button
            onClick={() => handleTabClick('bookings')}
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-md transition-all w-full text-left group ${activeTab === 'bookings'
                ? 'bg-gold text-dark'
                : 'text-white/50 hover:text-gold hover:bg-white/5'
              }`}
          >
            <CalendarDays size={17} strokeWidth={1.5} className={activeTab === 'bookings' ? 'text-dark' : 'text-gold/60 group-hover:text-gold'} />
            <span className="text-sm font-bold tracking-[0.2em] uppercase">My Bookings</span>
            {activeTab === 'bookings' && <span className="ml-auto w-1.5 h-1.5 bg-dark rounded-full" />}
          </button>

          {/* My Queries */}
          <button
            onClick={() => handleTabClick('queries')}
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-md transition-all w-full text-left group ${activeTab === 'queries'
                ? 'bg-gold text-dark'
                : 'text-white/50 hover:text-gold hover:bg-white/5'
              }`}
          >
            <ImageIcon size={17} strokeWidth={1.5} className={activeTab === 'queries' ? 'text-dark' : 'text-gold/60 group-hover:text-gold'} />
            <span className="text-sm font-bold tracking-[0.2em] uppercase">My Queries</span>
            {activeTab === 'queries' && <span className="ml-auto w-1.5 h-1.5 bg-dark rounded-full" />}
          </button>

          {/* Account */}
          <button
            onClick={() => handleTabClick('account')}
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-md transition-all w-full text-left group ${activeTab === 'account'
                ? 'bg-gold text-dark'
                : 'text-white/50 hover:text-gold hover:bg-white/5'
              }`}
          >
            <UserCircle size={17} strokeWidth={1.5} className={activeTab === 'account' ? 'text-dark' : 'text-gold/60 group-hover:text-gold'} />
            <span className="text-sm font-bold tracking-[0.2em] uppercase">Account</span>
            {activeTab === 'account' && <span className="ml-auto w-1.5 h-1.5 bg-dark rounded-full" />}
          </button>
        </nav>

        {/* Logout */}
        <div className="px-5 pb-8">
          <button
            onClick={logout}
            className="flex items-center space-x-4 px-4 py-3.5 w-full text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut size={17} strokeWidth={1.5} />
            <span className="text-sm font-bold tracking-[0.2em] uppercase">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
