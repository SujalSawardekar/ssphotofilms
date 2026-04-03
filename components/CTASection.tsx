"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="bg-dark py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full opacity-10 blur-3xl z-0 pointer-events-none">
        <div className="bg-gold/40 w-full h-full rounded-full animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-white font-cinzel text-5xl md:text-7xl font-bold leading-tight uppercase tracking-tight"
        >
          READY TO CREATE <br /> MEMORIES?
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-gold/80 font-sans text-sm md:text-base uppercase tracking-[0.4em] font-light max-w-2xl mx-auto leading-relaxed"
        >
          Limited slots available for the 2025 season. Book your consultation today and let's tell your story together.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/booking" 
            className="inline-block px-14 py-5 bg-gold text-dark text-sm uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-dark transition-all duration-500 shadow-2xl hover:shadow-gold/20"
          >
            Book Your Session Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
