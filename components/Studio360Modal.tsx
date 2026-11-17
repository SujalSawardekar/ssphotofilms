"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass } from 'lucide-react';

interface Studio360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl?: string;
}

export default function Studio360Modal({
  isOpen,
  onClose,
  embedUrl = "https://momento360.com/e/u/94ffea6f34634ad9b020700e6b3fe386?utm_campaign=embed&utm_source=other&utm_medium=embed&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true"
}: Studio360ModalProps) {

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 select-none">
        {/* Header Bar */}
        <div className="w-full max-w-7xl flex items-center justify-between pb-3 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-white font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase">
                SS Studio &bull; 360&deg; Virtual Tour
              </h2>
              <p className="text-white/60 font-manrope text-[10px] md:text-xs tracking-wider">
                Explore the space in 360&deg; &bull; Drag or move to look around
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 md:p-2.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white border border-red-400/40 transition-all shadow-lg cursor-pointer"
            title="Close 360 View (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* 360 Viewport Container */}
        <div className="relative w-full max-w-7xl h-[80vh] md:h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          <iframe
            src={embedUrl}
            title="SS Studio 360 Tour"
            className="w-full h-full border-0"
            allowFullScreen={true}
            allow="accelerometer; magnetometer; gyroscope; fullscreen"
          />
        </div>
      </div>
    </AnimatePresence>
  );
}
