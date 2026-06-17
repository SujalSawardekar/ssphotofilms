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

import { useCms } from '@/lib/CmsContext';
import EditableImage from './EditableImage';

const DEFAULT_OCCASIONS = [
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
  const { 
    editMode, 
    isPreview, 
    occasions: cmsOccasions, 
    updateOccasion, 
    addOccasion, 
    deleteOccasion, 
    reorderOccasions 
  } = useCms();

  const occasions = cmsOccasions.length > 0 ? cmsOccasions : DEFAULT_OCCASIONS;

  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll logic (disabled for mobile to allow manual dragging, and disabled in edit mode)
  useEffect(() => {
    if (isMobile || (editMode && !isPreview)) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev >= occasions.length - 3 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [startIndex, isMobile, editMode, isPreview, occasions.length]);

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
        <div className="text-center mb-10 flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-dark tracking-wide uppercase">
            OCCASION TO CAPTURE
          </h2>
          {editMode && !isPreview && (
            <button 
              onClick={() => addOccasion({ 
                title: 'New Occasion', 
                description: 'A brief description of this occasion.', 
                image: '/assets/occasion-wedding.jpg', 
                href: '/gallery?category=wedding' 
              })}
              className="bg-gold hover:bg-dark hover:text-white text-dark font-manrope font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
            >
              + Add New Occasion
            </button>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}>
            <AnimatePresence mode="popLayout" initial={false}>
              {occasions.slice(startIndex, isMobile ? startIndex + 1 : startIndex + 3).map((item, idx) => {
                const globalIdx = occasions.indexOf(item);
                const isFirst = globalIdx === 0;
                const isLast = globalIdx === occasions.length - 1;
                
                return (
                  <motion.div
                    key={`${item.title}-${startIndex}-${globalIdx}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    drag={isMobile && (!editMode || isPreview) ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="group relative flex flex-col h-full bg-white rounded-[32px] overflow-hidden shadow-sm touch-pan-y"
                  >
                    {/* Reordering/Deletion Actions in Edit Mode */}
                    {editMode && !isPreview && (
                      <div className="absolute top-4 left-4 z-40 bg-dark/80 backdrop-blur-md rounded-xl p-1.5 flex items-center space-x-2 border border-white/10 shadow-lg">
                        <button
                          disabled={isFirst}
                          onClick={() => reorderOccasions(globalIdx, globalIdx - 1)}
                          className={`text-white p-1 hover:text-gold transition-colors ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
                          title="Move Left"
                        >
                          ←
                        </button>
                        <button
                          disabled={isLast}
                          onClick={() => reorderOccasions(globalIdx, globalIdx + 1)}
                          className={`text-white p-1 hover:text-gold transition-colors ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
                          title="Move Right"
                        >
                          →
                        </button>
                        <div className="w-[1px] h-4 bg-white/20" />
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${item.title}" occasion?`)) {
                              deleteOccasion(globalIdx);
                              if (startIndex > 0 && startIndex >= occasions.length - 1) {
                                setStartIndex(Math.max(0, startIndex - 1));
                              }
                            }
                          }}
                          className="text-red-400 p-1 hover:text-red-500 transition-colors"
                          title="Delete Occasion"
                        >
                          🗑
                        </button>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <EditableImage 
                          src={item.image} 
                          onChange={(newUrl) => updateOccasion(globalIdx, { image: newUrl })}
                          alt={item.title} 
                          fill
                          quality={75}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        
                        {(!editMode || isPreview) && (
                          <Link href={item.href || '#'} className="absolute top-5 right-5 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
                            <div className="relative h-6 w-6 overflow-hidden text-dark">
                               <div className="absolute top-0 left-0 w-full h-full transition-all duration-500 group-hover:-translate-y-10 group-hover:translate-x-10">
                                 <ArrowIcon className="w-full h-full" />
                               </div>
                               <div className="absolute top-0 left-0 w-full h-full transition-all duration-500 translate-y-10 -translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0">
                                 <ArrowIcon className="w-full h-full" />
                               </div>
                            </div>
                          </Link>
                        )}
                      </div>

                      <div className="bg-[#f0f0f0]/60 p-6 text-center flex-1 flex flex-col justify-center">
                         <h3 className="text-2xl font-cinzel font-bold text-dark/80 mb-2 tracking-tight">
                           {editMode && !isPreview ? (
                             <input
                               type="text"
                               value={item.title}
                               onChange={(e) => updateOccasion(globalIdx, { title: e.target.value })}
                               className="bg-white border border-dark/10 text-center w-full px-2 py-1 focus:border-gold outline-none rounded text-sm font-manrope font-bold text-dark"
                             />
                           ) : (
                             item.title
                           )}
                         </h3>
                         <p className="text-dark/60 text-[13px] font-manrope font-medium leading-tight max-w-[240px] mx-auto w-full">
                           {editMode && !isPreview ? (
                             <textarea
                               value={item.description}
                               onChange={(e) => updateOccasion(globalIdx, { description: e.target.value })}
                               className="bg-white border border-dark/10 text-center w-full px-2 py-1 focus:border-gold outline-none rounded text-xs font-manrope resize-none h-16 text-dark"
                             />
                           ) : (
                             item.description
                           )}
                         </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center space-x-1 mt-8 pb-4">
            {occasions.slice(0, isMobile ? occasions.length : Math.max(1, occasions.length - 2)).map((_, dot) => (
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
