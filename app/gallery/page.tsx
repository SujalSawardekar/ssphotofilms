"use client";

import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GalleryColumnLayout from '@/components/GalleryColumnLayout';

const GalleryPage = () => {
  return (
    <main className="min-h-screen bg-background pt-[160px]">
      <Navbar transparentDarkText={true} />
      
      {/* The main interactive gallery system */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-cinzel text-dark/20 uppercase tracking-widest">Loading Gallery...</div>}>
        <GalleryColumnLayout />
      </Suspense>

      <Footer />
    </main>
  );
};

export default GalleryPage;
