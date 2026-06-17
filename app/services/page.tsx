"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { pricingCategories as DEFAULT_PRICING_CATEGORIES, Booking, PricingPackage } from '@/lib/mockData';
import { addBooking } from '@/lib/db';
import { useAuth } from '@/lib/authContext';
import { useCms } from '@/lib/CmsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';

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
  const { 
    editMode, 
    isPreview, 
    services: cmsServices, 
    gallery: cmsGallery,
    updatePackage, 
    addPackage, 
    deletePackage, 
    reorderPackages, 
    updateCategoryInfo 
  } = useCms();

  const pricingCategories = cmsServices.length > 0 ? cmsServices : DEFAULT_PRICING_CATEGORIES;
  const galleryStories = cmsGallery.length > 0 ? cmsGallery : [];
  
  const [activeCategoryId, setActiveCategoryId] = useState(pricingCategories[0]?.id || 'wedding');
  const [expandedPackageIdx, setExpandedPackageIdx] = useState<number | null>(0);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [bothSideSelections, setBothSideSelections] = useState<Record<number, boolean>>({});
  const [reelSelections, setReelSelections] = useState<Record<number, boolean>>({});

  // Reset active category id if cms data updates
  useEffect(() => {
    if (pricingCategories.length > 0 && !pricingCategories.some(c => c.id === activeCategoryId)) {
      setActiveCategoryId(pricingCategories[0].id);
    }
  }, [pricingCategories, activeCategoryId]);

  // Map service category to gallery category
  const categoryMap: Record<string, string> = {
    'wedding': 'WEDDINGS',
    'pre-wedding': 'PRE-WEDDING',
    'baby-shoot': 'BABY & KIDS',
    'maternity': 'MATERNITY',
    'engagement': 'ENGAGEMENT',
    'portrait': 'PORTRAIT'
  };

  const activeGalleryCategory = categoryMap[activeCategoryId];
  const relevantStories = galleryStories.filter(s => s.category === activeGalleryCategory);
  
  // Flatten all images from relevant stories for the gallery cycle (Single Source of Truth!)
  const pooledPhotos = relevantStories.length > 0 
    ? relevantStories.flatMap(story => 
        (story.images || []).map((img: string) => ({
          src: img,
          title: story.title,
          names: story.names,
          date: story.date,
          slug: story.slug
        }))
      )
    : (pricingCategories.find(c => c.id === activeCategoryId)?.packages || []).map((pkg: any) => ({
        src: pkg.imageSrc,
        title: pkg.captionTitle || pkg.title,
        names: pkg.captionSubtitle || "",
        date: "JUNE 23, 2025",
        slug: ""
      })) || [];

  const activeCategory = pricingCategories.find(c => c.id === activeCategoryId) || pricingCategories[0];
  
  const parsePrice = (p: string | number) => {
    if (typeof p === 'number') return p;
    return parseInt(p.replace(/,/g, '')) || 0;
  };

  // Helper to determine coverage label
  const getCoverageLabel = (features: string[]) => {
    const hasVideo = features.some(f => 
      /video|film|reel|cine|videographer|cinematographer|cinematic/i.test(f)
    );
    return hasVideo ? "Photography & Videography" : "Photography Only";
  };

  const calculateTotalPrice = (pkg: PricingPackage, idx: number, isOriginal: boolean = false) => {
    const basePrice = isOriginal ? parsePrice(pkg.originalPrice) : parsePrice(pkg.discountPrice);
    const upgradePrice = bothSideSelections[idx] && pkg.bothSidePrice ? (parsePrice(pkg.bothSidePrice) - parsePrice(pkg.discountPrice)) : 0;
    const addOnPrice = reelSelections[idx] && pkg.reelPrice ? parsePrice(pkg.reelPrice) : 0;
    
    return Number(basePrice) + Number(upgradePrice) + Number(addOnPrice);
  };
  
  const activePackage = expandedPackageIdx !== null && activeCategory ? (activeCategory.packages[expandedPackageIdx] || activeCategory.packages[0]) : null;

  const handleCategoryChange = (catId: string) => {
    setActiveCategoryId(catId);
    setExpandedPackageIdx(0); 
    setGalleryIdx(0); 
    setBothSideSelections({}); 
    setReelSelections({}); 
  };

  const nextGallery = () => {
    if (pooledPhotos.length <= 1) return;
    setGalleryIdx((prev) => (prev + 1) % pooledPhotos.length);
  };

  const prevGallery = () => {
    if (pooledPhotos.length <= 1) return;
    setGalleryIdx((prev) => (prev - 1 + pooledPhotos.length) % pooledPhotos.length);
  };

  // Auto-play effect for the gallery preview
  useEffect(() => {
    if (pooledPhotos.length <= 1) return;
    const timer = setInterval(() => {
      nextGallery();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeCategoryId, pooledPhotos.length]);

  if (!activeCategory) {
    return (
      <main className="relative min-h-screen bg-white text-dark flex items-center justify-center font-cinzel">
        Loading Services...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-white text-dark font-manrope">
      <Navbar transparentDarkText={true} />

      {/* Header Section */}
      <section className="bg-[#F5F2ED] pt-[160px] pb-12 px-6 md:px-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-[#4A4A4A] tracking-wider mb-6 uppercase">
          <EditableText cmsKey="services.header.title" defaultVal="SERVICES" />
        </h1>
        <p className="text-[#646464] text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
          <EditableText cmsKey="services.header.subtitle" defaultVal="WE DON'T JUST OFFER SERVICES WE PRESERVE MEMORIES" />
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-16">
        
        {/* Tabs */}
        <div className="flex flex-nowrap overflow-x-auto scrollbar-hide justify-start md:justify-between items-center border-b border-dark/10 mb-16 px-4 gap-8 pb-2">
          {pricingCategories.map((category: any) => (
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl lg:text-4xl font-cinzel font-bold text-dark">
                Pricing Plans<span className="text-gold">.</span>
              </h2>

              {/* Add Package Button in Edit Mode */}
              {editMode && !isPreview && (
                <button
                  onClick={() => addPackage(activeCategoryId, {
                    title: "New Package",
                    originalPrice: "50,000",
                    discountPrice: "40,000",
                    features: ["Feature 1", "Feature 2"],
                    imageSrc: "/assets/occasion-wedding.jpg",
                    captionTitle: "Package Capture",
                    captionSubtitle: "Details"
                  })}
                  className="bg-gold hover:bg-dark hover:text-white text-dark font-manrope font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-300 shadow"
                >
                  + Add Package
                </button>
              )}
            </div>
            
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
              {(activeCategory.packages || []).map((pkg: any, idx: number) => {
                const isExpanded = expandedPackageIdx === idx;
                const isFirst = idx === 0;
                const isLast = idx === (activeCategory.packages || []).length - 1;

                return (
                  <div key={idx} className="flex flex-col relative group/pkg">
                    
                    {/* Admin reordering/deletion overlays in Edit Mode */}
                    {editMode && !isPreview && (
                      <div className="absolute -top-3.5 right-4 z-40 bg-dark/90 text-white rounded-lg px-2 py-1 flex items-center space-x-2 border border-white/10 shadow-lg text-[10px]">
                        <button
                          disabled={isFirst}
                          onClick={() => reorderPackages(activeCategoryId, idx, idx - 1)}
                          className={`hover:text-gold ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          disabled={isLast}
                          onClick={() => reorderPackages(activeCategoryId, idx, idx + 1)}
                          className={`hover:text-gold ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <ArrowDown size={12} />
                        </button>
                        <div className="w-[1px] h-3 bg-white/20" />
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete package "${pkg.title}"?`)) {
                              deletePackage(activeCategoryId, idx);
                              setExpandedPackageIdx(0);
                            }
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}

                    <button 
                      onClick={() => setExpandedPackageIdx(prev => prev === idx ? null : idx)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between w-full py-4 px-6 transition-colors gap-2 border border-dark/5 rounded-xl ${
                        isExpanded ? 'bg-transparent' : 'bg-[#F2EFEB] hover:bg-[#EAE5DF]'
                      }`}
                    >
                      <span className="text-lg md:text-xl font-cinzel font-bold tracking-wide text-dark uppercase block text-left">
                        {editMode && !isPreview ? (
                          <input
                            type="text"
                            value={pkg.title}
                            onClick={(e) => e.stopPropagation()} // stop accordion toggle
                            onChange={(e) => updatePackage(activeCategoryId, idx, { title: e.target.value })}
                            className="bg-white border border-dark/10 rounded px-2 py-1 text-sm font-manrope font-bold text-dark w-full sm:w-64 outline-none focus:border-gold"
                          />
                        ) : (
                          pkg.title
                        )}
                      </span>
                      
                      <div className="flex items-center space-x-3 shrink-0">
                        {/* Original Price */}
                        <span className="text-secondary/50 line-through text-xs md:text-sm font-medium">
                          {editMode && !isPreview ? (
                            <input
                              type="text"
                              value={pkg.originalPrice}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updatePackage(activeCategoryId, idx, { originalPrice: e.target.value })}
                              className="bg-white border border-dark/10 rounded px-1.5 py-0.5 text-xs text-dark w-20 outline-none text-center"
                            />
                          ) : (
                            `₹${calculateTotalPrice(pkg, idx, true).toLocaleString('en-IN')}/-`
                          )}
                        </span>
                        {/* Discount Price */}
                        <span className="text-dark font-bold text-base md:text-lg">
                          {editMode && !isPreview ? (
                            <input
                              type="text"
                              value={pkg.discountPrice}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updatePackage(activeCategoryId, idx, { discountPrice: e.target.value })}
                              className="bg-white border border-dark/10 rounded px-1.5 py-0.5 text-xs text-dark w-20 outline-none text-center font-bold"
                            />
                          ) : (
                            `₹${calculateTotalPrice(pkg, idx, false).toLocaleString('en-IN')} /-`
                          )}
                        </span>
                      </div>
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

                            <div className="text-[10px] font-black uppercase tracking-widest text-[#FF2D55] italic mb-6 decoration-gold underline underline-offset-8">
                               {bothSideSelections[idx] ? "Full Both Side Coverage" : getCoverageLabel(pkg.features)}
                            </div>

                            {/* Features Editor in Edit Mode */}
                            {editMode && !isPreview ? (
                              <div className="mb-6 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary block">
                                  Package Features (One per line)
                                </label>
                                <textarea
                                  value={(pkg.features || []).join('\n')}
                                  onChange={(e) => updatePackage(activeCategoryId, idx, { features: e.target.value.split('\n').filter(Boolean) })}
                                  className="w-full bg-white border border-dark/10 p-3 text-xs font-manrope rounded focus:border-gold outline-none h-32 text-dark leading-relaxed"
                                />
                              </div>
                            ) : (
                              <ul className="space-y-3 mb-6">
                                {(pkg.features || []).map((feature: string, fIdx: number) => {
                                  const isBothSideFeature = feature.toLowerCase().includes("both side");
                                  const isReelFeature = feature.toLowerCase().includes("add-on: cinematic reel");
                                  
                                  return (
                                    <li 
                                      key={fIdx} 
                                      onClick={() => {
                                        if (isBothSideFeature && pkg.bothSidePrice) {
                                          setBothSideSelections(prev => ({ ...prev, [idx]: !prev[idx] }));
                                        } else if (isReelFeature && pkg.reelPrice) {
                                          setReelSelections(prev => ({ ...prev, [idx]: !prev[idx] }));
                                        }
                                      }}
                                      className={`flex items-start transition-all duration-300 ${
                                        (isBothSideFeature && pkg.bothSidePrice) || (isReelFeature && pkg.reelPrice)
                                          ? `cursor-pointer p-2 rounded-lg border-2 ${
                                              (isBothSideFeature && bothSideSelections[idx]) || (isReelFeature && reelSelections[idx])
                                                ? 'bg-gold/10 border-gold shadow-md' 
                                                : 'bg-transparent border-dark/5 hover:border-gold/30'
                                            }` 
                                          : 'text-dark'
                                      }`}
                                    >
                                      <div className={`mt-2 shrink-0 mr-3 ${
                                        (isBothSideFeature && bothSideSelections[idx]) || (isReelFeature && reelSelections[idx])
                                          ? 'text-gold' 
                                          : 'text-dark/40'
                                      }`}>
                                         {(isBothSideFeature && bothSideSelections[idx]) || (isReelFeature && reelSelections[idx]) 
                                           ? <CheckCircle2 size={14} /> 
                                           : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                      </div>
                                      <div className="flex flex-col">
                                         <span className={`text-sm md:text-base font-medium leading-relaxed tracking-tight ${(isBothSideFeature || isReelFeature) ? 'font-bold' : ''}`}>
                                            {feature}
                                         </span>
                                         {(isBothSideFeature || isReelFeature) && (
                                           <span className="text-[9px] font-black uppercase tracking-widest text-gold mt-1">
                                              {(isBothSideFeature && bothSideSelections[idx]) || (isReelFeature && reelSelections[idx]) 
                                                ? "Selected ✓" 
                                                : "Click to select add-on"}
                                           </span>
                                         )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}

                            {/* Additional prices config for Admin */}
                            {editMode && !isPreview && (
                              <div className="grid grid-cols-2 gap-4 mb-6 border-t border-dark/5 pt-4">
                                <div>
                                  <label className="text-[9px] font-black text-secondary uppercase block mb-1">Both Side Cover price Upgrade</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 39,999"
                                    value={pkg.bothSidePrice || ''}
                                    onChange={(e) => updatePackage(activeCategoryId, idx, { bothSidePrice: e.target.value || null })}
                                    className="bg-white border border-dark/10 rounded px-2 py-1 text-xs text-dark w-full outline-none focus:border-gold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-secondary uppercase block mb-1">Cinematic Reel add-on price</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 1,500"
                                    value={pkg.reelPrice || ''}
                                    onChange={(e) => updatePackage(activeCategoryId, idx, { reelPrice: e.target.value || null })}
                                    className="bg-white border border-dark/10 rounded px-2 py-1 text-xs text-dark w-full outline-none focus:border-gold"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div className="text-[#E74C3C] text-[10px] font-black uppercase tracking-widest mb-2">OFFER PRICE</div>
                            <div className="flex items-center space-x-3">
                               <span className="text-secondary/50 line-through text-lg font-medium">
                                 ₹{calculateTotalPrice(pkg, idx, true).toLocaleString('en-IN')}/-
                               </span>
                               <span className="text-dark font-bold text-3xl font-cinzel tracking-tighter">
                                  ₹{calculateTotalPrice(pkg, idx, false).toLocaleString('en-IN')}/-
                                </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <Link 
                href={`/booking?package=${encodeURIComponent(activePackage?.title || '')}&event=${encodeURIComponent(activeCategory.label)}${expandedPackageIdx !== null && bothSideSelections[expandedPackageIdx] ? '&bothSide=true' : ''}${expandedPackageIdx !== null && reelSelections[expandedPackageIdx] ? '&reel=true' : ''}`}
                className="bg-[#424340] inline-block text-white px-12 py-5 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden group shadow-2xl hover:scale-105 text-center w-full sm:w-auto"
              >
                <span className="relative z-10">BOOK NOW</span>
                <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
              </Link>

              {activeCategory.pdfUrl && (
                <a 
                  href={activeCategory.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-dark/10 inline-block text-dark px-12 py-5 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden group hover:bg-dark hover:text-white hover:border-dark text-center w-full sm:w-auto"
                >
                  <span className="relative z-10">CHECKOUT FOR MORE INFO</span>
                  <div className="absolute top-0 -left-full w-full h-full bg-white/5 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                </a>
              )}
            </div>

            {/* Category Description - Signature Experience */}
            {activeCategory.description !== undefined && (
              <div className="mt-6 relative group max-w-lg">
                <div className="bg-white/40 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none">
                     <span className="text-6xl font-black text-dark tracking-tighter">SS</span>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                       <div className="h-[1px] w-6 bg-gold/50" />
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold font-manrope">The Signature Experience</span>
                    </div>
                    
                    <div className="text-dark/80 font-manrope font-medium text-sm md:text-base leading-relaxed tracking-wide w-full">
                      {editMode && !isPreview ? (
                        <textarea
                          value={activeCategory.description}
                          onChange={(e) => updateCategoryInfo(activeCategoryId, { description: e.target.value })}
                          className="w-full bg-white border border-dark/10 p-2 text-xs font-manrope rounded focus:border-gold outline-none h-20 text-dark"
                        />
                      ) : (
                        activeCategory.description
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                       <div className="w-1 h-1 rounded-full bg-gold/40" />
                       <div className="w-1 h-1 rounded-full bg-gold/60" />
                       <div className="w-1 h-1 rounded-full bg-gold/80" />
                    </div>
                  </div>
                  
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold/40" />
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Dynamic Gallery (Single Source of Truth) */}
          <div className="w-full lg:w-1/2 flex items-start justify-center p-4 lg:sticky lg:top-40 h-fit">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeCategoryId}-${galleryIdx}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative w-full aspect-[4/5] bg-dark rounded-[15px] overflow-hidden shadow-2xl group cursor-pointer"
              >
                {pooledPhotos.length > 0 ? (
                  <>
                    <Image 
                      src={pooledPhotos[galleryIdx].src} 
                      alt={pooledPhotos[galleryIdx].title} 
                      fill
                      className="w-full h-full object-cover transition-all duration-1000"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    
                    {/* Story-style Overlay Info */}
                    <div className="absolute bottom-12 left-12 z-10 text-white pointer-events-none pr-12">
                       <p className="text-[10px] md:text-xs font-manrope font-bold uppercase tracking-[0.5em] mb-4 opacity-80">
                         {pooledPhotos[galleryIdx].date}
                       </p>
                       <h3 className="text-2xl md:text-4xl lg:text-5xl font-cinzel font-bold leading-tight tracking-wide mb-2 uppercase truncate max-w-sm">
                         {pooledPhotos[galleryIdx].names}
                       </h3>
                       <p className="text-lg md:text-2xl font-cinzel italic opacity-90 truncate max-w-sm">
                         - {pooledPhotos[galleryIdx].title}
                       </p>
                    </div>

                    {/* View Full Gallery Button Overlay */}
                    <Link 
                      href={`/gallery?category=${activeCategoryId}`}
                      className="absolute top-8 right-8 z-30 bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-dark transition-all duration-500 flex items-center gap-2"
                    >
                      View Full Gallery <ArrowRight size={14} />
                    </Link>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/45 font-cinzel italic tracking-widest uppercase">
                    Upload photos in gallery to preview
                  </div>
                )}
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />

                {/* Navigation Arrows */}
                {pooledPhotos.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-8 z-20 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.preventDefault(); prevGallery(); }}
                      className="pointer-events-auto p-4 bg-white/10 hover:bg-white text-white hover:text-dark rounded-full transition-all duration-500 scale-90 md:scale-100"
                    >
                      <GalleryArrow className="w-6 h-6 rotate-180" />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); nextGallery(); }}
                      className="pointer-events-auto p-4 bg-white/10 hover:bg-white text-white hover:text-dark rounded-full transition-all duration-500 scale-90 md:scale-100"
                    >
                      <GalleryArrow className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
