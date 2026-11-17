"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCms } from '@/lib/CmsContext';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import Studio360Modal from './Studio360Modal';

const DEFAULT_IMAGES = [
  "/assets/type/hero-slide1.png",
  "/assets/type/01.jpg.jpeg",
  "/assets/prewedding/1ssp08645-copy.jpg",
  "/assets/type/1DSC03229 copy.jpg.jpeg",
];

const HeroSection = () => {
  const { contents, updateContentKey, editMode, isPreview } = useCms();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [is360Open, setIs360Open] = useState(false);

  const images: string[] = contents["home.hero.images"] 
    ? JSON.parse(contents["home.hero.images"]) 
    : DEFAULT_IMAGES;

  const nextSlide = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length);
  };

  const handleImageChange = (newUrl: string, idx: number) => {
    const updatedImages = [...images];
    updatedImages[idx] = newUrl;
    updateContentKey("home.hero.images", JSON.stringify(updatedImages));
  };

  useEffect(() => {
    if (editMode && !isPreview) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, images.length, editMode, isPreview]); // Restart timer on manual click

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-dark">
      {/* Slideshow Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <EditableImage
              src={images[currentIndex]}
              onChange={(newUrl) => handleImageChange(newUrl, currentIndex)}
              alt="Hero Background"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center items-center pointer-events-none">

        <div className="w-full max-w-[1400px] px-6 md:px-12 flex items-center justify-between mt-auto mb-64 md:mb-20 lg:mb-32">
          {/* Left Arrow */}
          <motion.button
            onClick={prevSlide}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:flex items-center space-x-1 w-1/4 pointer-events-auto cursor-pointer border-none bg-transparent outline-none group"
          >
            <div className="relative flex items-center w-32">
              <div className="w-full h-[1px] bg-white group-hover:w-[120%] transition-all duration-300" />
              <div className="absolute left-0 w-2 h-2 border-l border-t border-white rotate-[-45deg] bg-transparent" />
            </div>
          </motion.button>

          <div className="flex flex-col items-start md:items-center flex-1 px-4 pointer-events-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white font-cinzel text-xl md:text-4xl lg:text-5xl font-bold text-left md:text-center leading-tight tracking-[0.1em] md:tracking-[0.2em] break-words md:whitespace-nowrap max-w-[260px] md:max-w-none"
            >
              <EditableText cmsKey="home.hero.title" defaultVal="CAPTURING LOVE STORIES" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-white font-manrope text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] font-medium mt-6 opacity-100 text-left md:text-center"
            >
              <EditableText cmsKey="home.hero.subtitle" defaultVal="UNSCRIPTED. RAW. AUTHENTIC" />
            </motion.p>
          </div>

          {/* Right Side Navigation elements */}
          <div className="hidden lg:flex flex-col items-center w-1/4 space-y-8">
            {/* Current Slide Number (Top) */}
            <span className="text-white text-sm font-bold tracking-widest leading-none">
              0{currentIndex + 1}
            </span>

            {/* Right Arrow (Middle) */}
            <motion.button
              onClick={nextSlide}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden lg:flex items-center justify-center w-32 pointer-events-auto cursor-pointer group border-none bg-transparent outline-none"
            >
              <div className="relative flex items-center w-full justify-center">
                <div className="w-full h-[1px] bg-white group-hover:w-[120%] transition-all duration-300" />
                <div className="absolute right-0 w-2 h-2 border-r border-b border-white rotate-[-45deg] bg-transparent" />
              </div>
            </motion.button>

            {/* Total Slide Counter (Bottom) */}
            <span className="text-white/40 text-sm font-bold tracking-widest leading-none">
              {String(images.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* =========================================================================
            ORIGINAL "FIND YOUR PHOTOS" CODE (Preserved for future use)
            =========================================================================
        <div className="absolute bottom-32 right-6 md:bottom-16 md:right-16 z-30 pointer-events-auto">
          <a href="/find-photos" className="block cursor-pointer">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 hover:scale-110 transition-transform"
            >
              <img src="/assets/icon-downloadnow.svg" alt="Badge" className="w-full h-full object-contain" />
            </motion.div>
          </a>
        </div>
        ========================================================================= */}

        {/* View Studio 360° Constant Badge (Luxury Glassmorphism & Warm Gold) */}
        <div className="absolute bottom-32 right-6 md:bottom-16 md:right-16 z-30 pointer-events-auto">
          <button 
            onClick={() => setIs360Open(true)}
            className="group relative flex items-center justify-center cursor-pointer border-none bg-transparent outline-none focus:outline-none"
            title="View Studio 360° Virtual Tour"
          >
            {/* Subtle ambient gold aura on hover */}
            <div className="absolute inset-0 rounded-full bg-gold/10 group-hover:bg-gold/25 blur-lg transition-all duration-500 scale-110" />

            {/* Main Constant Glass Container (No rotation) */}
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-xl border border-gold/40 group-hover:border-gold transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center p-2 text-center relative overflow-hidden group-hover:scale-105">
              
              {/* Subtle inner delicate border */}
              <div className="absolute inset-1.5 md:inset-2 rounded-full border border-white/10 group-hover:border-gold/30 transition-colors pointer-events-none" />

              {/* Top Studio Label */}
              <span className="font-cinzel text-[7px] md:text-[9px] lg:text-[10px] font-semibold text-white/70 uppercase tracking-[0.25em] leading-tight">
                Studio
              </span>

              {/* Center 360° Highlight */}
              <div className="my-0.5 md:my-1 flex items-center justify-center">
                <span className="font-cinzel text-base md:text-2xl lg:text-3xl font-extrabold text-gold tracking-tight drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                  360&deg;
                </span>
              </div>

              {/* Bottom Tour Indicator */}
              <div className="flex items-center space-x-1.5">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="font-manrope text-[6.5px] md:text-[8px] lg:text-[9px] font-bold text-white/90 uppercase tracking-[0.2em] leading-tight">
                  Tour
                </span>
              </div>

            </div>
          </button>
        </div>
      </div>

      {/* 360 Virtual Tour Interactive Modal */}
      <Studio360Modal 
        isOpen={is360Open} 
        onClose={() => setIs360Open(false)} 
        embedUrl="https://momento360.com/e/u/94ffea6f34634ad9b020700e6b3fe386?utm_campaign=embed&utm_source=other&utm_medium=embed&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true"
      />
    </section>
  );
};

export default HeroSection;
