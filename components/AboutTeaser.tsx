"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useCms } from '@/lib/CmsContext';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const AboutTeaser = () => {
  const { editMode, isPreview } = useCms();

  return (
    <section id="about" className="bg-dark text-white py-24 px-6 md:px-12 overflow-hidden font-manrope">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-16">
        {/* Left Side: Text Content */}
        <div className="flex-1 space-y-10 order-2 md:order-1 flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-cinzel font-bold leading-tight uppercase tracking-tight"
          >
            <EditableText 
              cmsKey="home.about.title" 
              defaultVal="FOR THE LOVE OF ART &#10;AND TIMELESS MEMORIES" 
            />
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 text-white/80 font-manrope text-sm md:text-base leading-relaxed max-w-lg"
          >
            <EditableText 
              cmsKey="home.about.description" 
              defaultVal="SS Photo & Films is a passion project born out of Shreyas Sawardekar's obsession with freezing time. What started as a hobby in 2017 has evolved into a full-scale premium studio that has documented hundreds of unique stories across India.&#10;&#10;We believe every frame should tell a story, every click should evoke a memory, and every client should feel the raw emotion of their special moments even decades later." 
            />
            
            <p className="font-cinzel text-gold text-xl pt-4">
              <EditableText 
                cmsKey="home.about.quote" 
                defaultVal='"We Capture Your Memories Forever"' 
              />
            </p>
          </motion.div>

          <div className="flex items-center space-x-6 pt-6">
            <div className="w-16 h-[2px] bg-gold" />
            <button className="text-sm uppercase tracking-[0.4em] font-bold text-gold hover:text-white transition-colors cursor-default">
              SS Studio
            </button>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="flex-1 relative order-1 md:order-2 min-h-[450px] md:min-h-[500px] lg:min-h-[550px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="relative z-10 w-full h-full min-h-[450px] md:min-h-[500px] lg:min-h-[550px]"
          >
            <div className="absolute inset-0 border-2 border-gold m-6 translate-x-8 translate-y-8 z-[-1]" />
            <div className="absolute inset-0 overflow-hidden shadow-2xl rounded-lg">
              <EditableImage
                cmsKey="home.about.image"
                defaultVal="/assets/about-photo.jpg"
                alt="Shreyas Sawardekar"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute bottom-10 left-10 p-6 bg-dark/85 backdrop-blur-md border-l-4 border-gold z-20 rounded shadow-lg pointer-events-auto">
              <h4 className="font-cinzel text-white text-xl uppercase font-bold tracking-widest">
                <EditableText cmsKey="home.about.signature" defaultVal="Shreyas Sawardekar" />
              </h4>
              <p className="text-gold text-xs uppercase tracking-widest mt-1">
                <EditableText cmsKey="home.about.role" defaultVal="Lead Creative Director" />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
