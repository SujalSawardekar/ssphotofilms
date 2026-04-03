"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getEvents } from '@/lib/db';
import { Event } from '@prisma/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LuxuryWebcam from '@/components/LuxuryWebcam';
import { 
  Camera, 
  Upload, 
  Search, 
  ArrowRight, 
  Download, 
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Loader2,
  ScanLine,
  Zap,
  CloudDownload,
  ShieldCheck,
  FileArchive,
  Eye,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FindPhotosPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [step, setStep] = useState(1); // 1: Select Event, 2: Upload Face, 3: Results
  const [selectedEventId, setSelectedEventId] = useState('');
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanIndex, setCurrentScanIndex] = useState(0);
  const [isFinishingScan, setIsFinishingScan] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    getEvents(true).then(data => {
      setEvents(data);
    });
  }, []);

  // AUTO-SEARCH LOGIC: Trigger search immediately after state updates
  useEffect(() => {
    if (faceImage && selectedEventId && !isSearching && step === 2) {
      handleSearch(faceImage);
    }
  }, [faceImage, selectedEventId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleWebcamCapture = (file: File) => {
    setFaceImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowWebcam(false);
    setError(null);
  };

  const handleSearch = async (imageFile: File) => {
    setIsSearching(true);
    setError(null);
    setScanProgress(0);
    setCurrentScanIndex(0);
    setIsFinishingScan(false);

    try {
      const formData = new FormData();
      formData.append('album_id', selectedEventId);
      formData.append('face_image', imageFile);

      const res = await fetch('http://127.0.0.1:5001/api/v1/shortlist', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        const matches = data.matched_filenames || [];
        setResults(matches);
        
        // --- REALISTIC SCAN PROGRESS ---
        const selectedEvent = events.find(e => e.id === selectedEventId || (e as any).albumId === selectedEventId) as any;
        const totalActualPhotos = selectedEvent?.totalPhotos || 0;
        
        const totalSimulatedSteps = 100;
        for (let i = 1; i <= totalSimulatedSteps; i++) {
          await new Promise(r => setTimeout(r, 15));
          setScanProgress(i);
          setCurrentScanIndex(Math.floor((i / 100) * totalActualPhotos) + 1);
        }
        
        setIsFinishingScan(true);
        setTimeout(() => setStep(3), 800);
      } else {
        setError(data.error || "Failed to find matches. Try a clearer photo.");
        setIsSearching(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsSearching(false);
    }
  };

  const handleDownloadAll = async () => {
    if (results.length === 0 || !selectedEventId) return;
    
    setIsDownloading(true);
    try {
      const res = await fetch('http://127.0.0.1:5001/download_zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          album_id: selectedEventId,
          filenames: results
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my_moments_${selectedEventId.slice(0, 8)}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Download failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Could not download ZIP.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSingleDownload = async (filename: string) => {
    if (!selectedEventId) return;
    
    try {
      const res = await fetch(`http://127.0.0.1:5001/serve_image/${selectedEventId}/${filename}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Download failed.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const resetSearch = () => {
    setStep(2);
    setFaceImage(null);
    setPreviewUrl(null);
    setResults([]);
    setError(null);
    setIsSearching(false);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId || (e as any).albumId === selectedEventId);

  return (
    <main className="min-h-screen bg-[#F6F4F0] font-manrope pt-[160px] pb-20">
      <Navbar transparentDarkText={true} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-dark text-gold rounded-full flex items-center justify-center mb-4 shadow-2xl"
          >
            <Camera size={28} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-dark uppercase tracking-tight">Find Your Moments</h1>
          <p className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold max-w-xl opacity-60">Luxury AI search for your personal gallery</p>
        </div>

        {/* Search Engine Container */}
        <div className="bg-white rounded-none shadow-2xl border border-dark/5 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="h-1 w-full bg-dark/5 flex">
             <div className={`h-full transition-all duration-1000 bg-gold ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>

          <div className="p-8 md:p-12 lg:p-20">
             <AnimatePresence mode="wait">
                
                {/* STEP 1: EVENT SELECTION */}
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-4 text-center">
                       <h2 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-widest text-gold text-white bg-dark py-4 shadow-2xl">Step 01: Pick Event</h2>
                       <p className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold opacity-50">Select the occasion you attended</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {events.map((event) => (
                         <button 
                           key={event.id}
                           onClick={() => { setSelectedEventId((event as any).albumId || event.id); setStep(2); }}
                           className={`group text-left p-10 border transition-all duration-700 hover:border-gold hover:shadow-2xl ${
                             selectedEventId === (event as any).albumId || selectedEventId === event.id ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-dark/5 bg-white'
                           }`}
                         >
                            <h3 className="text-xl font-cinzel font-bold text-dark mb-3 group-hover:text-gold transition-colors uppercase">{event.name}</h3>
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] items-center flex font-bold text-secondary uppercase tracking-[0.2em] opacity-60">
                                 <CheckCircle2 size={12} className="mr-2 text-emerald-500" /> AI SCAN READY
                              </p>
                              <ArrowRight size={14} className="text-gold group-hover:translate-x-2 transition-transform" />
                            </div>
                         </button>
                       ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: FACE UPLOAD (AUTO-SEARCH) */}
                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="flex items-center space-x-6">
                       <button onClick={() => setStep(1)} className="p-3 bg-dark/5 hover:bg-dark hover:text-white rounded-full transition-all group">
                          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                       </button>
                       <div>
                          <h2 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-widest">Verify Identity</h2>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold opacity-60">Scanning in: <span className="text-gold">{selectedEvent?.name}</span></p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                       <div className="space-y-4">
                          <div className={`p-10 border-2 transition-all duration-700 ${isSearching ? 'border-gold bg-gold/5' : 'border-dashed border-dark/10 hover:border-gold'}`}>
                              <button 
                                onClick={() => setShowWebcam(true)}
                                disabled={isSearching}
                                className="w-full flex flex-col items-center justify-center space-y-6 cursor-pointer group py-8"
                              >
                                 <div className="w-20 h-20 bg-dark rounded-full flex items-center justify-center shadow-2xl group-hover:bg-gold transition-all duration-500">
                                    <Zap size={32} className="text-gold group-hover:text-dark transition-colors" />
                                 </div>
                                 <div className="text-center">
                                   <span className="text-[11px] font-black uppercase tracking-[0.3em] text-dark block mb-2">Start Live Studio Scan</span>
                                   <span className="text-[9px] font-bold uppercase tracking-widest text-secondary opacity-40 italic">Use your camera for optimal AI detection</span>
                                 </div>
                              </button>
                          </div>

                          <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest text-secondary opacity-20 italic">
                             <span className="bg-white px-4">or find via photo</span>
                          </div>

                          <div className="pt-2 text-center">
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                id="face-upload" 
                                onChange={handleFileChange}
                                disabled={isSearching}
                              />
                              <label 
                                htmlFor="face-upload"
                                className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:text-gold cursor-pointer transition-colors"
                              >
                                 <CloudDownload size={14} />
                                 <span>Upload High-Res Portrait</span>
                              </label>
                          </div>
                       </div>

                       <div className="flex flex-col items-center justify-center p-2 bg-dark/5 rounded-none aspect-square relative overflow-hidden ring-1 ring-dark/5 shadow-inner group">
                          {previewUrl ? (
                             <div className="w-full h-full relative overflow-hidden">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                {isSearching && (
                                   <>
                                     <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay animate-pulse" />
                                     <div className="absolute top-0 left-0 w-full h-1 bg-gold shadow-[0_0_20px_rgba(255,215,0,0.9)] animate-scan z-10" />
                                     <div className="absolute inset-0 flex items-center justify-center bg-dark/40 backdrop-blur-[2px]">
                                        <div className="bg-white/90 px-8 py-6 flex flex-col items-center space-y-4 shadow-2xl border border-gold/20 min-w-[240px]">
                                           <div className="flex items-center space-x-4 w-full">
                                              <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                                              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-dark">
                                                {isFinishingScan ? 'SCAN COMPLETE' : 'AI IDENTIFYING...'}
                                              </span>
                                           </div>
                                           <div className="w-full h-1 bg-dark/5 overflow-hidden">
                                              <motion.div 
                                                className="h-full bg-gold"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${scanProgress}%` }}
                                              />
                                           </div>
                                           <div className="flex justify-between w-full text-[9px] font-bold text-secondary tracking-widest">
                                              <span>{scanProgress}%</span>
                                              <span>SCANNED {currentScanIndex} PHOTOS</span>
                                           </div>
                                        </div>
                                     </div>
                                   </>
                                )}
                             </div>
                          ) : (
                             <div className="text-center opacity-10 py-20">
                                <ScanLine size={80} className="mx-auto mb-6" />
                                <p className="text-[11px] font-black uppercase tracking-[0.4em]">Awaiting Identity Scan</p>
                             </div>
                          )}
                       </div>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-[0.3em] text-center shadow-sm"
                      >
                         <AlertCircle size={16} className="inline mr-2 mb-1" />
                         {error}
                         <button onClick={resetSearch} className="ml-4 underline hover:text-dark">Try Again</button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: RESULTS */}
                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-12"
                  >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-dark/5 pb-10">
                       <div className="space-y-3">
                          <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-tight">Gallery Identified</h2>
                          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold opacity-60">
                             We scanned your session and identified <span className="text-gold font-black underline underline-offset-4">{results.length}</span> premium matches in <span className="text-dark font-black">{selectedEvent?.name}</span>
                          </p>
                       </div>
                       
                       <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={handleDownloadAll}
                            disabled={results.length === 0 || isDownloading}
                            className="bg-dark text-gold px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center space-x-3 shadow-xl hover:bg-gold hover:text-dark transition-all duration-500 disabled:opacity-20"
                          >
                             {isDownloading ? <Loader2 className="animate-spin" size={14} /> : <FileArchive size={14} />}
                             <span>Download All Moments</span>
                          </button>
                          
                          <button 
                            onClick={resetSearch}
                            className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-dark hover:text-gold transition-all bg-dark/5 px-6 py-3"
                          >
                             <RefreshCw size={14} />
                             <span>New Search</span>
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                       {results.map((filename, idx) => (
                         <motion.div 
                           key={idx}
                           initial={{ opacity: 0, y: 30 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.08 }}
                           className="group relative aspect-[4/5] bg-dark/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
                         >
                            <img 
                              src={`http://127.0.0.1:5001/serve_image/${selectedEventId}/${encodeURIComponent(filename)}`} 
                              alt="Result" 
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-dark/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center space-y-6 p-8 text-center backdrop-blur-[4px]">
                               <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold shadow-sm">Premium Discovery</p>
                               <div className="w-10 h-[1px] bg-gold/30" />
                               <div className="flex items-center space-x-4">
                                 <button 
                                   onClick={() => setSelectedPreviewImage(filename)}
                                   className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-dark transition-all shadow-xl backdrop-blur-md"
                                   title="Preview Image"
                                 >
                                    <Eye size={24} />
                                  </button>
                                  <button 
                                    onClick={() => handleSingleDownload(filename)}
                                    className="w-14 h-14 bg-gold text-dark rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                                    title="Download Image"
                                  >
                                     <Download size={24} />
                                  </button>
                               </div>
                            </div>
                         </motion.div>
                       ))}
                    </div>

                    {results.length === 0 && (
                      <div className="py-40 text-center flex flex-col items-center space-y-8">
                         <div className="p-10 bg-dark/5 rounded-full text-secondary/20 ring-1 ring-dark/5">
                            <ImageIcon size={72} />
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-[0.2em]">Zero Matches Detected</h3>
                            <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.3em] max-w-md mx-auto opacity-50 leading-loose">The identity profile was not detected in this session. Try a live scan with clearer lighting.</p>
                         </div>
                         <button 
                           onClick={resetSearch}
                           className="mt-8 px-12 py-5 bg-dark text-gold font-bold uppercase tracking-[0.5em] text-[10px] shadow-2xl hover:bg-gold hover:text-dark transition-all duration-500"
                         >
                           Recalibrate Identity
                         </button>
                      </div>
                    )}
                  </motion.div>
                )}

             </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showWebcam && (
          <LuxuryWebcam 
            onCapture={handleWebcamCapture}
            onClose={() => setShowWebcam(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPreviewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/95 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setSelectedPreviewImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPreviewImage(null)}
                className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-colors"
                title="Close"
              >
                <X size={32} />
              </button>

              {/* Preview Image */}
              <div className="relative w-full h-full rounded-none overflow-hidden shadow-2xl ring-1 ring-white/10 bg-dark/50">
                <img 
                  src={`http://127.0.0.1:5001/serve_image/${selectedEventId}/${encodeURIComponent(selectedPreviewImage)}`} 
                  alt="Full Preview" 
                  className="w-full h-full object-contain"
                />
                
                {/* Meta Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-dark/80 to-transparent flex justify-between items-end">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Premium Selection</p>
                      <h4 className="text-xl font-cinzel font-bold text-white uppercase tracking-widest">{selectedEvent?.name}</h4>
                   </div>
                   <button 
                     onClick={() => handleSingleDownload(selectedPreviewImage)}
                     className="bg-gold text-dark px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:bg-white transition-all flex items-center space-x-3"
                   >
                      <Download size={14} />
                      <span>Download Original</span>
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default FindPhotosPage;
