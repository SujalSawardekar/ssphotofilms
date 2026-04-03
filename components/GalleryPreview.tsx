"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mockPhotos } from '@/lib/mockData';

const GalleryPreview = () => {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-dark tracking-tight">
              OUR WORK
            </h2>
            <div className="w-24 h-[1px] bg-gold" />
          </div>
          <p className="text-secondary font-sans text-xs uppercase tracking-[0.2em] max-w-xs md:text-right">
            A small glimpse into the thousands of stories we've had the honor of preserving.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {mockPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden break-inside-avoid shadow-lg"
            >
              <img 
                src={photo.src} 
                alt={`Gallery ${photo.id}`} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold bg-dark/20 backdrop-blur-sm transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <span className="text-xs uppercase font-bold tracking-widest">View</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            href="/gallery" 
            className="inline-block px-12 py-4 border border-dark text-dark text-sm uppercase tracking-[0.2em] font-bold hover:bg-dark hover:text-white transition-all duration-300"
          >
            Explore Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
