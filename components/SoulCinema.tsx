"use client";

import React from 'react';
import { motion } from 'framer-motion';

const SoulCinema = () => {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background with Clip Path */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          clipPath: 'polygon(0% 0%, 72% 28%, 100% 0%, 100% 85%, 22% 100%, 0% 85%)'
        }}
      >
        <div className="absolute inset-0 grayscale opacity-60 mix-blend-luminosity">
          <img 
            src="/assets/hero-bg2.jpg" 
            alt="Soul Cinema Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-24">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
           className="flex flex-col items-center"
        >
          <h2 className="text-white font-cinzel text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.2em] mb-6 uppercase">
            SOUL <span className="text-white/40">+</span> CINEMA
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/70 text-sm md:text-base font-manrope leading-relaxed max-w-2xl mx-auto tracking-wide"
          >
            Every wedding story is unique. We capture the raw, real, unscripted magic, 
            turning moments into a timeless cinematic experience. Because we don't 
            just record events, we preserve the soul of your celebrations.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default SoulCinema;
