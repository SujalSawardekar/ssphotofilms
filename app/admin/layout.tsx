"use client";

import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

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
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen flex flex-col"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
