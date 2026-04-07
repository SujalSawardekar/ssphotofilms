"use client";

import React, { useState } from 'react';
import { mockEvents } from '@/lib/mockData';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Search,
  ExternalLink,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GenerateQRPage = () => {
  const [selectedEventId, setSelectedEventId] = useState(mockEvents[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedQR(null);
    
    // Simulate generation delay
    setTimeout(() => {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SS-EVT-${selectedEventId}&bgcolor=FAF7F2&color=1A1410`;
      setGeneratedQR(qrUrl);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`SS-EVT-${selectedEventId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-dark tracking-tight uppercase">
            Generate QR Codes
          </h1>
          <p className="text-secondary text-xs uppercase tracking-[0.3em] font-medium">
            Create unique access points for event attendees to find their personal photos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* Selection Pane */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 shadow-sm border-t-4 border-gold ring-1 ring-gold/10 space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-dark border-b border-gold/10 pb-4">Event Configuration</h3>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-secondary">Select Event</label>
                    <select 
                       className="w-full bg-dark/5 border-none py-4 px-4 text-sm font-bold tracking-widest outline-none focus:ring-2 focus:ring-gold transition-all"
                       value={selectedEventId}
                       onChange={(e) => setSelectedEventId(e.target.value)}
                    >
                       {mockEvents.map(evt => <option key={evt.id} value={evt.id}>{evt.name}</option>)}
                    </select>
                 </div>

                 <div className="p-6 bg-gold/5 border border-gold/10 rounded-none space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-secondary">Access Code</span>
                       <button onClick={handleCopy} className="text-gold flex items-center space-x-2 hover:text-dark transition-colors">
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          <span>{selectedEventId}</span>
                       </button>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-secondary">Encryption</span>
                       <span className="text-dark">AES-256 (MOCK)</span>
                    </div>
                 </div>

                 <button 
                   onClick={handleGenerate}
                   disabled={isGenerating}
                   className="w-full flex items-center justify-center space-x-4 bg-dark text-gold font-bold uppercase tracking-[0.4em] text-xs py-5 shadow-xl hover:bg-gold hover:text-dark transition-all duration-500 disabled:opacity-50"
                 >
                   {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                   ) : (
                      <>
                        <QrCode size={18} />
                        <span>Generate QR Code</span>
                      </>
                   )}
                 </button>
              </div>
           </div>

           <div className="bg-dark p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Printer size={120} className="text-white" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-white relative z-10">Integration Tip</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest leading-loose mt-4 relative z-10">
                 Place this QR code on guest welcome cards or reception tables. Attendees can immediately see their matched photos.
              </p>
           </div>
        </div>

        {/* Display Pane */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
             {generatedQR ? (
               <motion.div 
                 key="qr-display"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white p-12 md:p-20 shadow-2xl ring-1 ring-gold/10 text-center space-y-12 relative overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-[50%] h-[1px] bg-gold/20" />
                 <div className="absolute top-0 left-0 w-[1px] h-[50%] bg-gold/20" />
                 <div className="absolute bottom-0 right-0 w-[50%] h-[1px] bg-gold/20" />
                 <div className="absolute bottom-0 right-0 w-[1px] h-[50%] bg-gold/20" />

                 <div className="space-y-4">
                    <h2 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-widest">
                       {mockEvents.find(e => e.id === selectedEventId)?.name}
                    </h2>
                    <p className="text-gold text-xs uppercase font-bold tracking-[0.5em]">Event Access Code: {selectedEventId}</p>
                 </div>

                 <div className="inline-block p-8 bg-ivory border-[12px] border-dark shadow-2xl">
                    <img src={generatedQR} alt="QR Code" className="w-[250px] h-[250px] mix-blend-multiply" />
                 </div>

                 <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
                    <button className="flex items-center justify-center space-x-3 border border-dark text-dark text-xs uppercase font-bold tracking-widest py-4 hover:bg-dark hover:text-white transition-all duration-300">
                       <Download size={16} />
                       <span>Download Image</span>
                    </button>
                    <button className="flex items-center justify-center space-x-3 bg-dark text-white text-xs uppercase font-bold tracking-widest py-4 hover:bg-gold hover:text-dark transition-all duration-300">
                       <Printer size={16} />
                       <span>Print Code</span>
                    </button>
                 </div>
               </motion.div>
             ) : (
               <div className="bg-white p-20 border-2 border-dashed border-gold/20 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[500px]">
                  <QrCode size={80} className="text-gold/20" />
                  <div className="space-y-2">
                     <h3 className="text-xl font-cinzel text-secondary/40 font-bold uppercase tracking-widest">Preview Area</h3>
                     <p className="text-secondary/40 text-xs uppercase tracking-widest">Configure event and click generate to view the QR Code</p>
                  </div>
               </div>
             )}
           </AnimatePresence>

           {/* History / Previous QR Grid */}
           <div className="mt-16 space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-dark flex items-center justify-between">
                 <span>Previously Generated</span>
                 <span className="text-xs text-secondary/50 font-normal">History log #2025-01</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {mockEvents.map((evt, idx) => (
                   <div key={idx} className="bg-white p-6 shadow-sm ring-1 ring-gold/5 group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="aspect-square bg-ivory p-4 mb-4 relative">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SS-EVT-${evt.id}&bgcolor=FAF7F2&color=1A1410`} className="w-full h-full opacity-40 group-hover:opacity-100 transition-opacity mix-blend-multiply" alt="QR" />
                         <div className="absolute inset-0 bg-dark/60 backdrop-blur-[1px] opacity-100 group-hover:opacity-0 transition-opacity flex items-center justify-center">
                            <QrCode size={32} className="text-gold/50" />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-xs font-bold text-dark truncate uppercase tracking-widest">{evt.name}</h4>
                         <p className="text-xs text-secondary uppercase tracking-widest">Code: {evt.id}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQRPage;
