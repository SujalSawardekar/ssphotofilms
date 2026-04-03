"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const GetInTouch = () => {
  return (
    <section className="bg-background py-24 px-6 md:px-12 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-stretch gap-0">
          
          {/* Left Side: Portrait Image (Bride) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto h-[500px] lg:h-[700px] overflow-hidden"
          >
            <img 
              src="/assets/gallery-4.jpg" 
              alt="Bride Portrait" 
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>

          {/* Right Side: Content with Broken Border Frame */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 md:p-16 lg:p-24 relative">
             
             {/* The "Broken Border" Frame */}
             <div className="absolute inset-8 md:inset-12 border-dark/10 pointer-events-none">
                {/* Top Left Corner */}
                <div className="absolute top-0 left-0 w-24 h-[1px] bg-dark/20" />
                <div className="absolute top-0 left-0 w-[1px] h-24 bg-dark/20" />
                
                {/* Top Right Corner */}
                <div className="absolute top-0 right-0 w-24 h-[1px] bg-dark/20" />
                <div className="absolute top-0 right-0 w-[1px] h-24 bg-dark/20" />
                
                {/* Bottom Left Corner */}
                <div className="absolute bottom-0 left-0 w-24 h-[1px] bg-dark/20" />
                <div className="absolute bottom-0 left-0 w-[1px] h-24 bg-dark/20" />
                
                {/* Bottom Right Corner */}
                <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-dark/20" />
                <div className="absolute bottom-0 right-0 w-[1px] h-24 bg-dark/20" />
             </div>

             {/* Content Area */}
             <div className="text-center space-y-10 relative z-10 max-w-md">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-cinzel font-bold text-dark tracking-wide uppercase leading-tight"
                >
                  LET'S WORK <br/> TOGETHER
                </motion.h2>

                <div className="w-12 h-[1px] bg-dark/20 mx-auto" />

                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-dark/60 font-manrope text-sm md:text-xs uppercase tracking-[0.2em] leading-relaxed font-bold"
                >
                  Whether you’re getting married or looking for a photoshoot, 
                  we would love to hear from you. Tell us about your journey 
                  and what you’re looking for.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="pt-6"
                >
                  <Link 
                    href="/contact" 
                    className="inline-block bg-dark text-white px-12 py-5 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden group shadow-2xl hover:scale-105"
                  >
                    <span className="relative z-10">CONTACT US</span>
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                  </Link>
                </motion.div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
