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
  Image as ImageIcon
} from 'lucide-react';

const adminLinks = [
  { label: 'DASHBOARD',  href: '/admin',           icon: LayoutDashboard },
  { label: 'BOOKINGS',   href: '/admin/bookings',  icon: Calendar },
  { label: 'SESSIONS',   href: '/admin/events',    icon: ImageIcon },
  { label: 'QUERIES',    href: '/admin/queries',   icon: MessageSquare },
  { label: 'TEAM',       href: '/admin/team',      icon: Users },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const initial = user?.name?.charAt(0).toUpperCase() || 'S';

  return (
    <aside className="w-[280px] shrink-0 h-screen sticky top-0 bg-[#1A1A1A] flex flex-col font-manrope overflow-hidden">
      
      {/* Brand Header */}
      <div className="px-8 pt-10 pb-8 border-b border-white/10">
        <Link href="/" className="group inline-block">
          <h1 className="font-cinzel text-2xl font-bold text-gold tracking-widest leading-none group-hover:opacity-80 transition-opacity">
            SS PHOTO
          </h1>
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mt-1">Admin Panel</p>
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
  );
}
