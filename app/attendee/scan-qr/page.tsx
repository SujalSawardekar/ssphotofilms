"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { 
  QrCode, 
  ArrowRight, 
  Camera, 
  Search, 
  Zap, 
  Lock,
  ChevronRight,
  Scan
} from 'lucide-react';
import { motion } from 'framer-motion';

const ScanQRPage = () => {
  const [eventCode, setEventCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode) return;
    setIsSearching(true);
    
    // Simulate lookup
    setTimeout(() => {
      router.push(`/attendee/my-photos?event=${eventCode}`);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-dark flex flex-col font-manrope selection:bg-gold selection:text-dark">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-32 relative overflow-hidden">
        {/* Background Ambient Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-full opacity-5 pointer-events-none">
           <div className="w-full h-full bg-gold blur-[150px] rounded-full animate-pulse" />
        </div>

        <div className="w-full max-w-2xl relative z-10 space-y-12">
          {/* Main Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-ivory shadow-2xl relative overflow-hidden ring-1 ring-gold/20"
          >
             <div className="absolute top-0 left-0 w-full h-[8px] bg-gold" />
             
             <div className="p-12 md:p-20 flex flex-col items-center text-center space-y-10">
                <div className="relative group">
                   <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[3px] border-dark/5 flex items-center justify-center text-gold bg-dark/2 shadow-inner group-hover:scale-110 group-hover:border-gold transition-all duration-700">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                         <Scan size={64} strokeWidth={1.5} />
                      </motion.div>
                   </div>
                   <div className="absolute -top-2 -right-2 p-3 bg-gold text-dark rounded-full shadow-xl">
                      <Zap size={20} fill="currentColor" />
                   </div>
                </div>

                <div className="space-y-4">
                   <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-dark uppercase tracking-tight">
                      Scan Event QR
                   </h1>
                   <p className="text-secondary text-xs uppercase tracking-[0.4em] font-medium max-w-sm mx-auto leading-relaxed">
                      Scan the QR provided at your event or enter your access code manually.
                   </p>
                </div>

                <form onSubmit={handleAccess} className="w-full max-w-sm space-y-6 pt-6">
                   <div className="relative group">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-gold transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="ENTER EVENT CODE (e.g. SS-EVT-001)"
                        className="w-full bg-transparent border-b-2 border-dark/10 focus:border-gold py-4 pl-8 outline-none text-sm font-bold text-dark tracking-widest transition-all placeholder:text-secondary/30 text-center"
                        value={eventCode}
                        onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                      />
                   </div>
                   <button 
                     type="submit" 
                     disabled={isSearching}
                     className="w-full bg-dark text-gold font-bold uppercase tracking-[0.4em] text-xs py-6 shadow-2xl hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group disabled:opacity-50"
                   >
                     {isSearching ? (
                        <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
                     ) : (
                        <span className="relative z-10 group-hover:scale-110 transition-transform block">Access My Photos</span>
                     )}
                     <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                   </button>
                </form>
             </div>
          </motion.div>

          {/* Steps / Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: QrCode, title: "Scan QR", desc: "Use your camera to scan the event code." },
               { icon: Camera, title: "Face ID", desc: "Our AI matches your photos instantly." },
               { icon: Zap, title: "Download", desc: "Preserve and share in full resolution." },
             ].map((step, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 + (idx * 0.1) }}
                   className="text-center space-y-4 group"
                >
                   <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center text-gold mx-auto group-hover:bg-gold group-hover:text-dark transition-all duration-500">
                      <step.icon size={24} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">{step.title}</h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest">{step.desc}</p>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ScanQRPage;
