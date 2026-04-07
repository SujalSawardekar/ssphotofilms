"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GalleryColumnLayout from '@/components/GalleryColumnLayout';

const GalleryPage = () => {
  return (
    <main className="min-h-screen bg-background pt-[160px]">
      <Navbar transparentDarkText={true} />
      
      {/* The main interactive gallery system */}
      <GalleryColumnLayout />

      <Footer />
    </main>
  );
};

export default GalleryPage;
