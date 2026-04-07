"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pricingCategories, Booking } from '@/lib/mockData';
import { addBooking } from '@/lib/db';
import { useAuth } from '@/lib/authContext';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Diagonal Arrow Icon matched to the gallery stories design
const GalleryArrow = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function ServicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [activeCategoryId, setActiveCategoryId] = useState(pricingCategories[0].id);
  const [expandedPackageIdx, setExpandedPackageIdx] = useState(0);

  const activeCategory = pricingCategories.find(c => c.id === activeCategoryId) || pricingCategories[0];
  const activePackage = activeCategory.packages[expandedPackageIdx] || activeCategory.packages[0];

  const handleCategoryChange = (catId: string) => {
    setActiveCategoryId(catId);
    setExpandedPackageIdx(0); // Reset accordion to first item when switching tabs
  };

  const nextPackage = () => {
    setExpandedPackageIdx((prev) => (prev + 1) % activeCategory.packages.length);
  };

  const prevPackage = () => {
    setExpandedPackageIdx((prev) => (prev - 1 + activeCategory.packages.length) % activeCategory.packages.length);
  };

  return (
    <main className="relative min-h-screen bg-white text-dark font-manrope">
      <Navbar transparentDarkText={true} />

      {/* Header Section */}
      <section className="bg-[#F5F2ED] pt-[160px] pb-24 px-6 md:px-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-[#4A4A4A] tracking-wider mb-6 uppercase">
          SERVICES
        </h1>
        <p className="text-[#646464] text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
          WE DON'T JUST OFFER SERVICES <span className="text-dark">WE PRESERVE MEMORIES</span>
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        
        {/* Tabs */}
        <div className="flex flex-nowrap overflow-x-auto scrollbar-hide justify-start md:justify-between items-center border-b border-dark/10 mb-16 px-4 gap-8 pb-2">
          {pricingCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`text-lg md:text-xl font-medium pb-4 px-2 whitespace-nowrap shrink-0 transition-all duration-300 relative ${
                activeCategoryId === category.id 
                  ? 'text-dark' 
                  : 'text-secondary/60 hover:text-dark'
              }`}
            >
              {category.label}
              {activeCategoryId === category.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-dark"
                />
              )}
            </button>
          ))}
        </div>

        {/* Pricing Layout */}
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Accordion */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h2 className="text-3xl lg:text-4xl font-cinzel font-bold text-dark mb-4">Pricing Plans.</h2>
            <p className="text-sm font-semibold mb-10 pb-8 border-b border-dark/10 text-dark">
              Affordable plans, confident choice. Changed your mind? Get 100% refund if canceled within 48 hours.
            </p>

            {/* Enquire Now Row */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-dark">Get Custom Pricing</span>
              <a href="/contact" className="bg-[#424340] text-white px-8 py-3.5 text-[10px] items-center justify-center inline-flex rounded-xl uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group shadow-xl">
                <span className="relative z-10">ENQUIRE NOW</span>
                <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
              </a>
            </div>

            {/* Accordion List */}
            <div className="flex flex-col space-y-4 mb-8">
              {activeCategory.packages.map((pkg, idx) => {
                const isExpanded = expandedPackageIdx === idx;

                return (
                  <div key={idx} className="flex flex-col">
                    <button 
                      onClick={() => setExpandedPackageIdx(idx)}
                      className={`flex items-center justify-between w-full py-4 px-6 transition-colors ${
                        isExpanded ? 'bg-transparent' : 'bg-[#F2EFEB] hover:bg-[#EAE5DF]'
                      }`}
                    >
                      <span className="text-xl font-cinzel font-bold tracking-wide text-dark uppercase block">
                        {pkg.title}
                      </span>
                      
                      {/* Only show trailing price if NOT expanded, to match UI */}
                      {!isExpanded && (
                        <div className="flex items-center space-x-3">
                          <span className="text-secondary/50 line-through text-sm font-medium">{pkg.originalPrice}/-</span>
                          <span className="text-dark font-bold text-lg">{pkg.discountPrice} /-</span>
                        </div>
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 flex flex-col">
                            {/* Inner Pricing Display specifically for expanded state */}
                            <div className="flex items-center space-x-3 justify-end w-full mb-6">
                               <span className="text-secondary/50 line-through text-lg font-medium">{pkg.originalPrice}/-</span>
                               <span className="text-dark font-bold text-2xl">{pkg.discountPrice} /-</span>
                            </div>

                            <ul className="space-y-2 mb-6 text-sm md:text-xs">
                              {pkg.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-start text-dark">
                                  <span className="mr-2">•</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            
                            <div className="text-[#E74C3C] text-xs font-bold uppercase tracking-widest mb-2">OFFER PRICE</div>
                            <div className="flex items-center space-x-3">
                               <span className="text-secondary/50 line-through text-lg font-medium">{pkg.originalPrice}/-</span>
                               <span className="text-dark font-bold text-2xl">{pkg.discountPrice} /-</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Book Now Button */}
            <Link 
              href={`/booking?package=${encodeURIComponent(activePackage.title)}&event=${encodeURIComponent(activeCategory.label)}`}
              className="bg-[#424340] inline-block text-white px-12 py-5 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden group shadow-2xl hover:scale-105"
            >
              <span className="relative z-10">BOOK NOW</span>
              {/* Shimmer Effect */}
              <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
            </Link>

          </div>

          {/* Right Column: Featured Image (Styled like Gallery Stories) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeCategoryId}-${expandedPackageIdx}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full aspect-[4/5] bg-dark rounded-[15px] overflow-hidden shadow-2xl group cursor-pointer"
              >
                <img 
                  src={activePackage.imageSrc} 
                  alt={activePackage.captionTitle} 
                  className="w-full h-full object-cover transition-all duration-1000"
                />
                
                {/* Story-style Overlay Info */}
                <div className="absolute bottom-12 left-12 z-10 text-white pointer-events-none pr-12">
                   <p className="text-[10px] md:text-xs font-manrope font-bold uppercase tracking-[0.5em] mb-4 opacity-80">
                     JUNE 23, 2025
                   </p>
                   <h3 className="text-2xl md:text-4xl lg:text-5xl font-cinzel font-bold leading-tight tracking-wide mb-2 uppercase">
                     {activePackage.captionTitle}
                   </h3>
                   <p className="text-lg md:text-2xl font-cinzel italic opacity-90">
                     - {activePackage.captionSubtitle}
                   </p>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />

                {/* Navigation Arrows (Interactive) */}
                <div className="absolute inset-0 flex items-center justify-between px-8 z-20 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.preventDefault(); prevPackage(); }}
                    className="pointer-events-auto p-4 bg-white/10 hover:bg-white text-white hover:text-dark rounded-full transition-all duration-500 scale-90 md:scale-100"
                  >
                    <GalleryArrow className="w-6 h-6 rotate-180" />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); nextPackage(); }}
                    className="pointer-events-auto p-4 bg-white/10 hover:bg-white text-white hover:text-dark rounded-full transition-all duration-500 scale-90 md:scale-100"
                  >
                    <GalleryArrow className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
