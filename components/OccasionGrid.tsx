"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Custom Diagonal Arrow Icon matched to user design
const ArrowIcon = ({ className }: { className?: string }) => (
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
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const occasions = [
  { 
    title: 'Baby & Kids', 
    description: 'One smile from them can bring happiness worth millions to us.', 
    image: '/assets/occasion-baby.jpg',
    href: '/gallery?category=kids'
  },
  { 
    title: 'Wedding', 
    description: 'A magical bond between two souls worth a million stories.', 
    image: '/assets/occasion-wedding.jpg',
    href: '/gallery?category=wedding'
  },
  { 
    title: 'Maternity', 
    description: 'A tiny heartbeat, a life in our memories and hearts.', 
    image: '/assets/occasion-maternity.jpg',
    href: '/gallery?category=maternity'
  },
  { 
    title: 'Engagement', 
    description: 'Capturing the first promise of a lifelong journey together.', 
    image: '/assets/Engagement/1DSC08499%20copy.jpg',
    href: '/gallery?category=engagement'
  },
  { 
    title: 'Pre-wedding', 
    description: 'Documenting your unique connection before the big day.', 
    image: '/assets/hero-bg2.jpg',
    href: '/gallery?category=pre-wedding'
  },
  { 
    title: 'Haldi', 
    description: 'Vibrant colors and soulful traditions of your celebration.', 
    image: '/assets/haldi/1SSP02809%20copy.jpg',
    href: '/gallery?category=haldi'
  }
];

const OccasionGrid = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll logic (disabled for mobile to allow manual dragging)
  useEffect(() => {
    if (isMobile) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev >= occasions.length - 3 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [startIndex, isMobile]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -20) {
      // Dragged left -> Next
      setStartIndex((prev) => (prev >= occasions.length - 1 ? 0 : prev + 1));
    } else if (info.offset.x > 20) {
      // Dragged right -> Prev
      setStartIndex((prev) => (prev <= 0 ? occasions.length - 1 : prev - 1));
    }
  };

  return (
    <section className="bg-background pt-24 pb-16 px-6 md:px-12 w-full">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-dark tracking-wide uppercase">
            OCCASION TO CAPTURE
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}>
            <AnimatePresence mode="popLayout" initial={false}>
              {occasions.slice(startIndex, isMobile ? startIndex + 1 : startIndex + 3).map((item, idx) => (
                <motion.div
                  key={`${item.title}-${startIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  className="group relative flex flex-col h-full bg-white rounded-[32px] overflow-hidden shadow-sm touch-pan-y"
                >
                  <Link href={item.href} className="flex-1 flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      
                      <div className="absolute top-5 right-5 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
                        <div className="relative h-6 w-6 overflow-hidden text-dark">
                           <div className="absolute top-0 left-0 w-full h-full transition-all duration-500 group-hover:-translate-y-10 group-hover:translate-x-10">
                             <ArrowIcon className="w-full h-full" />
                           </div>
                           <div className="absolute top-0 left-0 w-full h-full transition-all duration-500 translate-y-10 -translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0">
                             <ArrowIcon className="w-full h-full" />
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f0f0f0]/60 p-6 text-center">
                       <h3 className="text-2xl font-cinzel font-bold text-dark/80 mb-2 tracking-tight">
                         {item.title}
                       </h3>
                       <p className="text-dark/60 text-[13px] font-manrope font-medium leading-tight max-w-[240px] mx-auto">
                         {item.description}
                       </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center space-x-1 mt-8 pb-4">
            {occasions.slice(0, isMobile ? occasions.length : occasions.length - 2).map((_, dot) => (
              <button
                key={dot}
                onClick={() => setStartIndex(dot)}
                className={`group relative p-1 transition-all duration-300 focus:outline-none`}
                aria-label={`Go to slide ${dot + 1}`}
              >
                <div className={`rounded-full transition-all duration-300 ${
                  startIndex === dot 
                    ? "bg-dark w-10 h-2" 
                    : "bg-dark/20 w-2 h-2 group-hover:bg-dark/40"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OccasionGrid;
