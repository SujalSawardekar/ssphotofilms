"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const images = [
  "/assets/hero-bg.jpg",
  "/assets/hero-bg2.jpg",
  "/assets/hero-bg3.jpg",
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]); // Restart timer on manual click

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
            <Image
              src={images[currentIndex]}
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

        <div className="w-full max-w-[1400px] px-6 md:px-12 flex items-center justify-between mt-auto mb-20 lg:mb-32">
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

          {/* Typography */}
          <div className="flex flex-col items-center flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white font-cinzel text-xl md:text-4xl lg:text-5xl font-bold text-center leading-tight tracking-[0.2em] whitespace-nowrap"
            >
              CAPTURING LOVE STORIES
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-white font-manrope text-[10px] md:text-xs uppercase tracking-[0.5em] font-medium mt-6 opacity-100 text-center"
            >
              UNSCRIPTED. RAW. AUTHENTIC
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
              className="flex items-center justify-center w-32 pointer-events-auto cursor-pointer group border-none bg-transparent outline-none"
            >
              <div className="relative flex items-center w-full justify-center">
                <div className="w-full h-[1px] bg-white group-hover:w-[120%] transition-all duration-300" />
                <div className="absolute right-0 w-2 h-2 border-r border-b border-white rotate-[-45deg] bg-transparent" />
              </div>
            </motion.button>

            {/* Total Slide Counter (Bottom) */}
            <span className="text-white/40 text-sm font-bold tracking-widest leading-none">
              03
            </span>
          </div>
        </div>

        {/* Circular Badge Accent (Bottom Right) */}
        <div className="absolute bottom-10 right-6 md:bottom-16 md:right-16 z-30 pointer-events-auto">
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
      </div>
    </section>
  );
};

export default HeroSection;
