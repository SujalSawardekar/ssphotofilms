"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AboutTeaser = () => {
  return (
    <section id="about" className="bg-dark text-white py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Left Side: Text Content */}
        <div className="flex-1 space-y-10 order-2 md:order-1">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-cinzel font-bold leading-tight uppercase tracking-tight"
          >
            FOR THE LOVE OF ART <br /> AND TIMELESS MEMORIES
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 text-secondary font-manrope text-sm leading-relaxed max-w-lg"
          >
            <p>
              SS Photo & Films is a passion project born out of Shreyas Sawardekar's obsession with freezing time. What started as a hobby in 2017 has evolved into a full-scale premium studio that has documented hundreds of unique stories across India.
            </p>
            <p>
              We believe every frame should tell a story, every click should evoke a memory, and every client should feel the raw emotion of their special moments even decades later.
            </p>
            <p className="font-cinzel text-gold text-lg italic pt-4">
              "We don't just capture scenes; we capture souls."
            </p>
          </motion.div>

          <div className="flex items-center space-x-6 pt-6">
             <div className="w-16 h-[2px] bg-gold" />
             <button className="text-sm uppercase tracking-[0.4em] font-bold text-gold hover:text-white transition-colors">
                Our Story
             </button>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="flex-1 relative order-1 md:order-2 self-stretch min-h-[400px] md:min-h-0">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.2 }}
             viewport={{ once: true }}
             className="relative z-10 w-full h-full aspect-[4/5] md:aspect-auto"
          >
             <div className="absolute inset-0 border-2 border-gold m-6 translate-x-8 translate-y-8 z-[-1]" />
             <div className="absolute inset-0 overflow-hidden shadow-2xl">
                <img 
                   src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" 
                   alt="Shreyas Sawardekar" 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
             </div>
             <div className="absolute bottom-10 left-10 p-6 bg-dark/80 backdrop-blur-md border-l-4 border-gold z-20">
                <h4 className="font-cinzel text-white text-xl uppercase font-bold tracking-widest">Shreyas Sawardekar</h4>
                <p className="text-gold text-xs uppercase tracking-widest mt-1">Lead Creative Director</p>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
