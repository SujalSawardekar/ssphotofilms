"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, CheckCircle2, Phone, Mail, MapPin, Camera } from 'lucide-react';

interface InvoiceModalProps {
  booking: any;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const amount = Number(booking.amount) || 0;
  const totalPaid = Number(booking.totalPaid) || 0;
  const remaining = amount - totalPaid;
  const hasReel = booking.includeReel;
  const hasBothSide = booking.includeBothSide;
  const travelCharges = Number(booking.travelCharges) || 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-10 overflow-y-auto bg-dark/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[850px] bg-white shadow-2xl overflow-hidden flex flex-col rounded-none md:rounded-3xl my-auto print:shadow-none print:rounded-none print:w-full print:max-w-none print:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
          }
        `}} />
        
        {/* Action Bar */}
        <div className="p-4 bg-[#F9F9F9] border-b border-dark/5 flex justify-between items-center no-print">
           <p className="text-[10px] font-black uppercase tracking-widest text-dark/40">Professional Invoice Document</p>
           <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 bg-dark text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#8FB13E] transition-all"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
              <button onClick={onClose} className="p-2 text-dark/20 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
           </div>
        </div>

        {/* Invoice Area - Matching Admin Style */}
        <div className="flex-1 p-8 md:p-14 lg:p-16 print-area bg-white overflow-y-auto max-h-[85vh] print:max-h-none print:overflow-visible">
           
           {/* Header Section */}
           <div className="flex justify-between items-start mb-10">
              <div className="flex-1 space-y-6">
                 <div className="space-y-1 text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-dark uppercase tracking-tight leading-none mb-2">S S PHOTO & FILMS</h1>
                    <p className="text-lg md:text-xl font-bold text-dark/60">Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-GB')}</p>
                 </div>
                 
                 <div className="space-y-4 pt-4 max-w-[500px] text-left">
                    <div className="flex items-end space-x-3 pb-1 border-b-2 border-[#8FB13E]">
                       <span className="text-lg md:text-xl font-black text-dark whitespace-nowrap">Name:</span>
                       <span className="text-lg md:text-xl font-medium text-dark/80 px-2 flex-1 truncate">{booking.clientName}</span>
                    </div>
                    <div className="flex items-end space-x-3 pb-1 border-b-2 border-[#8FB13E]">
                       <span className="text-lg md:text-xl font-black text-dark whitespace-nowrap">Event Name:</span>
                       <span className="text-lg md:text-xl font-medium text-dark/80 px-2 flex-1 truncate">{booking.eventType}</span>
                    </div>
                 </div>
              </div>

              <div className="text-right hidden md:flex flex-col items-center">
                 <div className="w-24 h-auto mb-2">
                    <img src="/assets/s-s-photo-&-films-2.png" alt="Logo" className="w-full h-auto object-contain" />
                 </div>
                 <div className="text-center">
                    <p className="font-cinzel text-[8px] font-black tracking-[0.2em] text-dark leading-tight uppercase">SHREYAS SAWARDEKAR</p>
                    <p className="text-[7px] font-black text-dark/40 tracking-[0.4em] uppercase">PHOTO & FILMS</p>
                 </div>
              </div>
           </div>

           {/* Particulars Table */}
           <div className="mb-12">
              <div className="border-2 border-dark overflow-hidden bg-white">
                 <div className="flex bg-[#8FB13E] text-white border-b-2 border-dark">
                    <div className="flex-[3] p-3 md:p-4 text-center font-black uppercase tracking-[0.2em] border-r-2 border-dark text-xs md:text-sm">PARTICULARS</div>
                    <div className="flex-1 p-3 md:p-4 text-center font-black uppercase tracking-[0.2em] text-xs md:text-sm">RATE</div>
                 </div>
                 
                 <div className="flex min-h-[300px]">
                    <div className="flex-[3] p-6 md:p-10 border-r-2 border-dark text-left">
                       <ul className="space-y-6">
                          <li>
                             <span className="font-bold uppercase text-[9px] tracking-[0.2em] text-dark/30 block mb-2">Service Package</span>
                             <p className="text-lg md:text-xl font-bold text-dark">{booking.packageType || 'Professional Shoot Package'}</p>
                          </li>
                          
                          {(booking.packageFeatures && booking.packageFeatures.length > 0) && (
                             <li>
                                <span className="font-bold uppercase text-[9px] tracking-[0.2em] text-dark/30 block mb-3">Key Features</span>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                   {booking.packageFeatures.map((f: string, i: number) => (
                                      <li key={i} className="text-xs md:text-sm text-dark/60 flex items-center">
                                         <div className="w-1 h-1 rounded-full bg-[#8FB13E] mr-2 shrink-0" /> {f}
                                      </li>
                                   ))}
                                </ul>
                             </li>
                          )}

                          {/* Add-ons specifically listed */}
                          {(hasBothSide || hasReel || travelCharges > 0) && (
                             <li className="pt-4 border-t border-dark/5">
                                <span className="font-bold uppercase text-[9px] tracking-[0.2em] text-dark/30 block mb-3">Additional Adjustments</span>
                                <div className="space-y-2">
                                   {hasBothSide && <p className="text-xs font-bold text-gold uppercase tracking-widest">+ Both Side Coverage Included</p>}
                                   {hasReel && <p className="text-xs font-bold text-[#FF2D55] uppercase tracking-widest">+ Cinematic Reel Add-on (₹1,500)</p>}
                                   {travelCharges > 0 && <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">+ Outstation Travel (₹{travelCharges.toLocaleString()})</p>}
                                </div>
                             </li>
                          )}

                          <li className="pt-6 text-dark/30 text-[10px] italic uppercase tracking-widest">
                             Location: {booking.location} • Duration: {booking.hours} Hours
                          </li>
                       </ul>
                    </div>
                    <div className="flex-1 p-6 md:p-10 text-center flex flex-col items-center justify-start bg-white">
                       <p className="mt-2 text-2xl md:text-3xl text-dark font-black tracking-tighter">₹{amount.toLocaleString()}/-</p>
                    </div>
                 </div>

                 {/* Summary Footer */}
                 <div className="flex border-t-2 border-dark">
                    <div className="hidden md:flex flex-[3] border-r-2 border-dark text-right p-4 italic text-dark/20 text-[9px] items-center justify-end">
                       * This is a system-generated document for SS Photo & Films. Valid for all official purposes.
                    </div>
                    <div className="flex-1 w-full md:w-auto">
                       <div className="flex justify-between px-4 py-3 border-b-2 border-dark bg-[#FAF9F6]">
                          <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                          <span className="text-xs font-bold text-dark">₹{amount.toLocaleString()}/-</span>
                       </div>
                       
                       <div className="flex justify-between px-4 py-3 border-b-2 border-dark">
                          <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
                          <span className="text-xs font-bold text-emerald-600">₹{totalPaid.toLocaleString()}/-</span>
                       </div>
                       
                       <div className={`flex justify-between px-4 py-3 ${remaining <= 0 ? 'bg-emerald-50' : 'bg-[#8FB13E]/10'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${remaining <= 0 ? 'text-emerald-600' : 'text-[#8FB13E]'}`}>
                             {remaining <= 0 ? 'STATUS' : 'BALANCE'}
                          </span>
                          <span className={`text-xs font-black ${remaining <= 0 ? 'text-emerald-600' : 'text-[#8FB13E]'}`}>
                             {remaining <= 0 ? 'FULLY PAID' : `₹${remaining.toLocaleString()}/-`}
                          </span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Footer Contact Section */}
           <div className="pt-10 border-t-2 border-dark/10 flex flex-col md:flex-row justify-between items-start gap-10">
              <div className="space-y-4 flex-1 text-left">
                 <div className="flex items-center space-x-3 text-sm font-bold text-dark">
                    <Phone size={14} className="text-[#8FB13E]" />
                    <span>+91 77410 83155</span>
                 </div>
                 <div className="flex items-center space-x-3 text-sm font-bold text-dark">
                    <Mail size={14} className="text-[#8FB13E]" />
                    <span>ssphotographyofficial13@gmail.com</span>
                 </div>
                 <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-3 text-sm font-bold text-dark">
                       <MapPin size={14} className="text-[#8FB13E]" />
                       <span>Ss Studio Sawardekar Complex 1st floor, Tal.Chiplun</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm font-bold text-[#8FB13E] pt-2">
                       <Camera size={14} className="text-[#8FB13E]" />
                       <span>@s_s.photography.official</span>
                    </div>
                 </div>
              </div>

              {/* QR Section */}
              <div className="flex flex-col items-center bg-[#FAF9F6] p-6 rounded-2xl border-2 border-dark/10">
                 <p className="text-[8px] font-black uppercase tracking-[0.2em] text-dark/30 mb-4">Official Instagram QR</p>
                 <div className="w-24 h-24 p-2 bg-white rounded-xl shadow-sm mb-3 flex items-center justify-center">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/ss_photography_official13/" 
                      alt="QR" 
                      className="w-full h-full object-contain"
                    />
                 </div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-[#8FB13E]">Follow Us for Updates</p>
              </div>
           </div>
           
           <p className="text-center mt-12 text-dark/10 text-[9px] font-black uppercase tracking-[0.5em] hidden md:block">SS PHOTO & FILMS - OFFICIAL DOCUMENT</p>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoiceModal;
