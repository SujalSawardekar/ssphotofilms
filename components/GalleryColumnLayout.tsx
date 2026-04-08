"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { galleryCategories, galleryStories, Story } from '@/lib/galleryData';
import { cn } from '@/lib/utils'; // Generic utility for class merging

// Custom Diagonal Arrow Icon matched to the design
const GalleryArrow = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const GalleryColumnLayout = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  const activeCategory = galleryCategories[categoryIndex];
  const filteredStories = galleryStories.filter(s => s.category === activeCategory);

  // Auto-slideshow for the left featured section
  useEffect(() => {
    if (filteredStories.length <= 1) return;
    const timer = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % filteredStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [filteredStories, storyIndex]);

  // Handle category switching (cycles categories)
  const nextCategory = () => {
    setCategoryIndex((prev) => (prev + 1) % galleryCategories.length);
    setStoryIndex(0);
  };

  const prevCategory = () => {
    setCategoryIndex((prev) => (prev - 1 + galleryCategories.length) % galleryCategories.length);
    setStoryIndex(0);
  };

  const nextStory = () => {
    setStoryIndex((prev) => (prev + 1) % filteredStories.length);
  };

  const prevStory = () => {
    setStoryIndex((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  const currentStory = filteredStories[storyIndex] || filteredStories[0] || galleryStories[0];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pb-40 bg-background text-dark relative">
      
      {/* 1ST COLUMN: Featured Story Slideshow (Left side - Now STICKY) */}
      <div className="w-full lg:w-1/2 px-6 md:px-12 lg:sticky lg:top-[150px] lg:h-[calc(100vh-200px)] flex flex-col justify-center mb-20 lg:mb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative group cursor-pointer overflow-hidden h-full rounded-[15px] shadow-2xl"
          >
            <Link href={`/gallery/${currentStory.slug}`} className="block h-full">
              <Image 
                src={currentStory.mainImage} 
                alt={currentStory.title} 
                fill
                priority
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              <div className="absolute bottom-12 left-12 z-10 text-white pointer-events-none max-w-[80%]">
                 <p className="text-[10px] md:text-xs font-manrope font-bold uppercase tracking-[0.5em] mb-3 opacity-80 whitespace-nowrap overflow-hidden">
                   {currentStory.date}
                 </p>
                 <h3 className="text-xl md:text-2xl lg:text-3xl font-cinzel font-bold leading-tight tracking-wide mb-1 uppercase truncate whitespace-nowrap">
                   {currentStory.title}
                 </h3>
                 <p className="text-md md:text-lg font-cinzel italic opacity-90 truncate whitespace-nowrap">
                   - {currentStory.names}
                 </p>
              </div>

              {/* Black/Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-700" />
            </Link>

            {/* In-Image Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-8 z-20 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.preventDefault(); prevStory(); }}
                className="pointer-events-auto p-4 bg-white/10 hover:bg-white text-white hover:text-dark rounded-full transition-all duration-500 scale-90 md:scale-100"
              >
                <GalleryArrow className="w-6 h-6 rotate-180" />
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); nextStory(); }}
                className="pointer-events-auto p-4 bg-white/10 hover:bg-white text-white hover:text-dark rounded-full transition-all duration-500 scale-90 md:scale-100"
              >
                <GalleryArrow className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2ND COLUMN: Category & Related Stories (Right side - Now Zig-Zag) */}
      <div className="w-full lg:w-1/2 px-6 md:px-12 flex flex-col pt-12 md:pt-0">
        
        {/* Category Header with Cyclical Arrows */}
        <div className="flex items-center justify-center lg:justify-start space-x-12 mb-12">
          <button 
            onClick={prevCategory}
            className="p-4 bg-dark/5 hover:bg-dark text-dark/40 hover:text-white rounded-full transition-all duration-500"
          >
            <GalleryArrow className="w-6 h-6 rotate-180" />
          </button>

          <AnimatePresence mode="wait">
            <motion.h2 
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-3xl md:text-6xl font-cinzel font-bold text-dark tracking-widest uppercase text-center lg:text-left md:min-w-[300px]"
            >
              {activeCategory}
            </motion.h2>
          </AnimatePresence>

          <button 
            onClick={nextCategory}
            className="p-4 bg-dark/5 hover:bg-dark text-dark/40 hover:text-white rounded-full transition-all duration-500"
          >
            <GalleryArrow className="w-6 h-6" />
          </button>
        </div>

        {/* Stories in this category Grid - STAGGERED (ZIG-ZAG) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-20 flex-1 items-start content-start pb-40">
          {filteredStories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: (idx % 2) * 0.2 }}
              viewport={{ once: true }}
              className={cn(
                "group flex flex-col space-y-6",
                idx % 2 !== 0 ? "md:mt-16" : "md:-mt-0" // Reduced Zig-Zag offset
              )}
            >
              <Link href={`/gallery/${story.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-[15px] shadow-lg">
                <Image 
                  src={story.mainImage} 
                  alt={story.title} 
                  fill
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 15vw"
                />
                <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              
              <div className="space-y-2">
                 <p className="text-xs md:text-sm font-manrope font-bold text-dark/40 uppercase tracking-[0.4rem]">
                   {story.date} / {story.category}
                 </p>
                 <h4 className="text-md md:text-lg font-cinzel font-bold text-dark/80 group-hover:text-gold transition-colors duration-300 truncate whitespace-nowrap">
                   {story.title}
                 </h4>
                 <p className="text-dark/50 font-cinzel italic text-xs md:text-sm truncate whitespace-nowrap">
                   - {story.names}
                 </p>
              </div>
            </motion.div>
          ))}

          {filteredStories.length === 0 && (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-dark/5 rounded-[15px]">
                <p className="text-dark/20 font-cinzel italic text-2xl uppercase tracking-widest">More stories coming soon</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default GalleryColumnLayout;
