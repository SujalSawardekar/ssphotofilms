"use client";

import React, { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockPhotos } from '@/lib/mockData';
import { 
  Camera, 
  Scan, 
  CircleCheck, 
  Download, 
  Share2, 
  X,
  CreditCard,
  Maximize2,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyPhotosPage = () => {
  const [phase, setPhase] = useState(1); // 1: Verification, 2: Result
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Simulation scan logic
  const startScan = () => {
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase(2), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const togglePhoto = (id: number) => {
    setSelectedPhotos(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleDownload = () => {
    if (selectedPhotos.length === 0) return;
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col font-manrope">
      <Navbar />

      <section className="flex-1 py-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Phase 1: Face Verification */}
          {phase === 1 && (
            <motion.div 
              key="verification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-dark uppercase tracking-tight">
                  Face Verification
                </h1>
                <p className="text-secondary text-xs uppercase tracking-[0.4em] font-medium leading-relaxed">
                   We'll scan your face to find your photos from the event
                </p>
              </div>

              {/* Scanning Box */}
              <div className="relative aspect-video w-full max-w-2xl mx-auto bg-dark overflow-hidden ring-4 ring-gold/20 shadow-2xl relative">
                  {/* Camera Icon Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                     <div className="relative">
                        <Camera size={80} className="text-gold/20" />
                        {scanProgress > 0 && scanProgress < 100 && (
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-[-20px] rounded-full border-2 border-gold/50"
                          />
                        )}
                     </div>
                     <p className="text-gold/50 text-xs uppercase tracking-[0.5em] font-bold">
                        {scanProgress > 0 ? (scanProgress === 100 ? "MATCH FOUND!" : `ANALYZING... ${scanProgress}%`) : "READY TO SCAN"}
                     </p>
                  </div>

                  {/* Scan Line Animation */}
                  {scanProgress > 0 && scanProgress < 100 && (
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-[2px] bg-gold shadow-[0_0_15px_gold] z-20"
                    />
                  )}

                  {/* Pulsing Corners */}
                  <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-gold shadow-gold-glow animate-pulse" />
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-gold shadow-gold-glow animate-pulse" />
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-gold shadow-gold-glow animate-pulse" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-gold shadow-gold-glow animate-pulse" />
              </div>

              <div className="flex flex-col items-center space-y-6">
                 <button 
                   onClick={startScan}
                   disabled={scanProgress > 0}
                   className="px-16 py-5 bg-dark text-gold font-bold uppercase tracking-[0.4em] text-xs shadow-2xl hover:bg-gold hover:text-dark transition-all duration-500 disabled:opacity-50 min-w-[300px]"
                 >
                    {scanProgress > 0 ? "SCANNING IN PROGRESS..." : "START FACE SCAN"}
                 </button>
                 <div className="flex items-center space-x-6 text-xs text-secondary font-bold uppercase tracking-widest">
                    <span className="flex items-center space-x-2"><CircleCheck size={14} className="text-emerald-500" /> <span>Secure</span></span>
                    <span className="flex items-center space-x-2"><CircleCheck size={14} className="text-emerald-500" /> <span>Real-time</span></span>
                    <span className="flex items-center space-x-2"><CircleCheck size={14} className="text-emerald-500" /> <span>GDPR Ready</span></span>
                 </div>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Found Photos */}
          {phase === 2 && (
            <motion.div 
               key="results"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-12"
            >
               {/* Success Banner */}
               <div className="bg-emerald-50 text-emerald-600 p-8 border-l-8 border-emerald-500 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center space-x-6">
                     <CircleCheck size={40} />
                     <div className="space-y-1">
                        <h2 className="text-xl md:text-2xl font-cinzel font-bold uppercase">Success! 6 Photos Found for You</h2>
                        <p className="text-xs uppercase tracking-widest font-bold text-emerald-600/60">Our AI has successfully matched {mockPhotos.length} moments from the event.</p>
                     </div>
                  </div>
                  <button className="px-6 py-2 border border-emerald-500/30 text-xs uppercase font-bold tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                     Recalibrate Face Mask
                  </button>
               </div>

               {/* Action Bar */}
               <div className="sticky top-[100px] z-30 bg-background/95 backdrop-blur-md py-6 flex flex-col md:flex-row items-center justify-between border-b border-gold/10 gap-6">
                  <div className="flex items-center space-x-8">
                     <button 
                       onClick={() => selectedPhotos.length === mockPhotos.length ? setSelectedPhotos([]) : setSelectedPhotos(mockPhotos.map(p => p.id))}
                       className="text-xs uppercase font-bold text-dark border-b border-dark/20 pb-1 hover:border-gold transition-colors tracking-widest"
                     >
                        {selectedPhotos.length === mockPhotos.length ? "Deselect All" : "Select All"}
                     </button>
                     <p className="text-xs uppercase font-bold tracking-widest text-secondary">
                        <span className="text-gold">{selectedPhotos.length}</span> Moments Selected
                     </p>
                  </div>
                  <div className="flex items-center space-x-4">
                     <button 
                        onClick={handleDownload}
                        disabled={selectedPhotos.length === 0 || isDownloading}
                        className="px-8 py-3 bg-dark text-gold text-xs uppercase font-bold tracking-widest hover:bg-gold hover:text-dark transition-all disabled:opacity-30 shadow-xl flex items-center space-x-3"
                     >
                        {isDownloading ? (
                           <div className="w-3 h-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                        ) : <Download size={16} />}
                        <span>{isDownloading ? "DOWNLOADING..." : "DOWNLOAD SELECTED"}</span>
                     </button>
                  </div>
               </div>

               {/* Photo Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                  {mockPhotos.map((photo) => {
                    const isSelected = selectedPhotos.includes(photo.id);
                    return (
                      <motion.div 
                        key={photo.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`aspect-[4/5] relative group overflow-hidden border-2 transition-all duration-300 ${isSelected ? 'border-gold shadow-2xl scale-[0.98]' : 'border-dark/5 hover:border-gold/30'}`}
                      >
                         <img src={photo.src} className="w-full h-full object-cover" alt="Moment" />
                         
                         {/* Selection Overlay */}
                         <div 
                           className={`absolute inset-0 transition-bg duration-300 cursor-pointer ${isSelected ? 'bg-gold/10' : 'bg-transparent group-hover:bg-dark/20'}`}
                           onClick={() => togglePhoto(photo.id)}
                         />

                         {/* Checkmark Tooltip */}
                         <div 
                            className={`absolute top-4 left-4 p-2 transition-all duration-300 shadow-xl ${isSelected ? 'bg-gold text-dark' : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'}`}
                            onClick={() => togglePhoto(photo.id)}
                         >
                            <CircleCheck size={20} />
                         </div>

                         {/* Action Buttons */}
                         <div className="absolute bottom-6 right-6 flex items-center space-x-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                            <button className="p-3 bg-dark/80 backdrop-blur-md text-white border border-white/10 hover:bg-gold hover:text-dark transition-all">
                               <Maximize2 size={16} />
                            </button>
                            <button className="p-3 bg-dark/80 backdrop-blur-md text-white border border-white/10 hover:bg-gold hover:text-dark transition-all">
                               <Share2 size={16} />
                            </button>
                         </div>
                      </motion.div>
                    );
                  })}
               </div>

               {/* Upsell Section */}
               <div className="mt-24 p-12 md:p-20 bg-dark text-white relative overflow-hidden text-center space-y-12 shadow-2xl border-t-8 border-gold">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gold/20" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold/20" />
                  
                  <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                     <div className="inline-block p-4 bg-gold/10 text-gold rounded-full mb-4">
                        <ShoppingBag size={48} />
                     </div>
                     <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white uppercase tracking-tight">Full Gallery Access</h2>
                        <p className="text-secondary text-sm md:text-base uppercase tracking-widest font-normal leading-relaxed">
                           Love all the moments? Purchase the entire collection of matched photos in <span className="text-white font-bold">RAW + 4K HD RESOLUTION</span> for a special lifetime keepsake.
                        </p>
                     </div>
                     <div className="pt-8">
                        <button className="px-16 py-6 bg-gold text-dark text-xs uppercase tracking-[0.4em] font-bold hover:bg-white transition-all shadow-xl shadow-gold/20 relative group overflow-hidden">
                           <span className="relative z-10 flex items-center space-x-4">
                              <CreditCard size={18} />
                              <span>BUY ALL PHOTOS ₹499</span>
                           </span>
                           <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                        </button>
                     </div>
                     <p className="text-white/30 text-xs uppercase tracking-widest pt-4">Instant delivery to your email after payment.</p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
};

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>}>
      <MyPhotosPage />
    </Suspense>
  );
}
