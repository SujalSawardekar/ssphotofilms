"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LuxuryWebcamProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const LuxuryWebcam = ({ onCapture, onClose }: LuxuryWebcamProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to File object
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "live_scan.jpg", { type: "image/jpeg" });
          onCapture(file);
        });
    }
  }, [webcamRef, onCapture]);

  const startCountdown = () => {
    setIsCapturing(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      capture();
      setCountdown(null);
      setIsCapturing(false);
    }
  }, [countdown, capture]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/95 backdrop-blur-xl p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white max-w-2xl w-full p-2 shadow-2xl border border-gold/20"
      >
        {/* Luxury Gold Frame */}
        <div className="absolute -inset-1 border border-gold/50 pointer-events-none opacity-20" />
        
        <div className="relative aspect-[4/3] bg-dark overflow-hidden">
           <Webcam
             audio={false}
             ref={webcamRef}
             screenshotFormat="image/jpeg"
             videoConstraints={{ facingMode: "user", width: 1280, height: 720 }}
             className="w-full h-full object-cover"
           />
           
           {/* UI Overlays */}
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Scan Reticle */}
              <div className="w-64 h-64 border-2 border-gold/30 rounded-full animate-pulse flex items-center justify-center">
                 <div className="w-1 h-1 bg-gold rounded-full" />
              </div>
              
              {/* Scan Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-scan" />
           </div>

           {/* Countdown Overlay */}
           <AnimatePresence>
             {countdown !== null && (
               <motion.div 
                 initial={{ scale: 2, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.5, opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center bg-dark/40 backdrop-blur-sm z-10"
               >
                  <span className="text-8xl font-cinzel font-bold text-gold">{countdown || '📸'}</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="p-8 space-y-6 bg-white">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <h3 className="text-xl font-cinzel font-bold text-dark tracking-widest uppercase">Live Identity Scan</h3>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-secondary opacity-40">Position your face within the center circle</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-secondary hover:text-dark transition-colors"
              >
                <X size={20} />
              </button>
           </div>

           <div className="flex items-center justify-center pt-4">
              <button 
                onClick={startCountdown}
                disabled={isCapturing}
                className="group relative flex flex-col items-center space-y-4"
              >
                 <div className="w-20 h-20 bg-dark rounded-full flex items-center justify-center shadow-2xl group-hover:bg-gold transition-all duration-500 group-active:scale-95">
                    <Zap size={32} className="text-gold group-hover:text-dark transition-colors" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark opacity-60">Begin Bio-Scan</span>
              </button>
           </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LuxuryWebcam;
