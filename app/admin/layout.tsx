"use client";

import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
     return <div className="min-h-screen bg-background flex items-center justify-center text-secondary uppercase tracking-[0.4em] text-xs">Unauthorized Access. Accessing Dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F2EFEB] font-manrope">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-6 md:hidden sticky top-0 z-40">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded bg-gold flex items-center justify-center">
                <span className="text-dark font-bold text-xs font-cinzel">SS</span>
             </div>
             <span className="text-white font-bold text-xs tracking-widest font-cinzel">ADMIN PANEL</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gold/80 hover:text-gold transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
