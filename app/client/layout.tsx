"use client";

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';

export default function ClientLayout({
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

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-secondary uppercase tracking-[0.4em] text-xs">Redirecting to login...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
