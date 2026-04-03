"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBookingWithInstallments } from '@/lib/db';
import { Printer, ChevronLeft, Phone, Mail, MapPin, Camera, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const InvoicePage = () => {
  const params = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (params.id) {
        try {
          const data = await getBookingWithInstallments(params.id as string);
          setBooking(data);
          setLoading(false);
        } catch (err) {
          console.log("Invoice fetch failed");
        }
      }
    };
    fetchInvoiceData();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-cinzel tracking-widest text-dark/20 uppercase bg-white">Preparing Document...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center font-cinzel text-red-500 bg-white">Invoice Not Found. Run 'npx prisma generate'!</div>;

  const remaining = booking.amount - (booking.totalPaid || 0);

  return (
    <div className="min-h-screen bg-white py-10 px-4 font-manrope print:py-0 print:px-0">
      {/* Action Bar (Hidden on print) */}
      <div className="max-w-[800px] mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link href="/admin/bookings" className="flex items-center text-[10px] font-black text-dark/40 hover:text-dark uppercase tracking-widest transition-all">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Link>
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-dark text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#8FB13E] transition-all flex items-center space-x-2"
        >
          <Printer size={16} />
          <span>Print Invoice</span>
        </button>
      </div>

      {/* Invoice Document */}
      <div className="max-w-[800px] mx-auto bg-white border border-dark/5 shadow-2xl p-10 lg:p-16 print:border-0 print:shadow-none min-h-[1000px] flex flex-col justify-between">
        
        {/* Header Section (Restructured per Screenshot 4) */}
        <div className="flex justify-between items-start mb-10">
           <div className="flex-1 space-y-6">
              <div className="space-y-1">
                 <h1 className="text-5xl font-black text-dark uppercase tracking-tight leading-none mb-2">S S PHOTO & FILMS</h1>
                 <p className="text-xl font-bold text-dark/60">Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-GB')}</p>
              </div>
              
              <div className="space-y-4 pt-4 max-w-[500px]">
                 <div className="flex items-end space-x-3 pb-1 border-b-2 border-[#8FB13E]">
                    <span className="text-xl font-black text-dark whitespace-nowrap">Name:</span>
                    <span className="text-xl font-medium text-dark/80 px-2 flex-1">{booking.clientName}</span>
                 </div>
                 <div className="flex items-end space-x-3 pb-1 border-b-2 border-[#8FB13E]">
                    <span className="text-xl font-black text-dark whitespace-nowrap">Event Name:</span>
                    <span className="text-xl font-medium text-dark/80 px-2 flex-1">{booking.eventType}</span>
                 </div>
                 <div className="h-[2px] w-full bg-[#8FB13E]/30 mt-4"></div>
              </div>
           </div>

           <div className="text-right flex flex-col items-center">
              <div className="w-32 h-auto mb-2">
                 <img src="/assets/s-s-photo-&-films-2.png" alt="Logo" className="w-full h-auto object-contain" />
              </div>
              <div className="text-center">
                 <p className="font-cinzel text-xs font-black tracking-[0.2em] text-dark leading-tight uppercase">SHREYAS SAWARDEKAR</p>
                 <p className="text-[10px] font-black text-dark/40 tracking-[0.4em] uppercase">PHOTO & FILMS</p>
              </div>
           </div>
        </div>

        {/* Particulars Table */}
        <div className="flex-1 mb-16">
           <div className="border-2 border-dark overflow-hidden bg-white">
              <div className="flex bg-[#8FB13E] text-white border-b-2 border-dark">
                 <div className="flex-[3] p-4 text-center font-black uppercase tracking-[0.2em] border-r-2 border-dark">PARTICULARS</div>
                 <div className="flex-1 p-4 text-center font-black uppercase tracking-[0.2em]">RATE</div>
              </div>
              
              {/* Table Body Content */}
              <div className="flex min-h-[350px]">
                 <div className="flex-[3] p-10 border-r-2 border-dark">
                    <ul className="space-y-4 text-xl font-medium text-dark text-left">
                       <li>
                          <span className="font-bold uppercase text-[10px] tracking-[0.2em] text-dark/30 block mb-2">Service Package</span>
                          <span className="font-bold">Professional Photography: {booking.packageType || 'Custom Package'}</span>
                       </li>
                       {booking.packageFeatures && booking.packageFeatures.length > 0 && (
                          <li className="mt-4">
                             <span className="font-bold uppercase text-[10px] tracking-[0.2em] text-dark/30 block mb-3">What's Included</span>
                             <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                                {booking.packageFeatures.map((f: string, i: number) => (
                                   <li key={i} className="text-sm text-dark/60 flex items-center">
                                      <CheckCircle2 size={12} className="mr-2 text-[#8FB13E] shrink-0" /> {f}
                                   </li>
                                ))}
                             </ul>
                          </li>
                       )}
                       <li className="pt-6 text-dark/40 text-sm italic">
                          <span>Coverage: {booking.hours} Hours • {booking.location}</span>
                       </li>
                    </ul>
                 </div>
                 <div className="flex-1 p-10 text-center text-3xl font-bold text-dark flex flex-col items-center justify-start bg-white">
                    <p className="mt-2 text-dark font-black tracking-tighter">₹{booking.amount}/-</p>
                 </div>
              </div>

              {/* Summary Footer */}
              <div className="flex border-t-2 border-dark">
                 <div className="flex-[3] border-r-2 border-dark text-right p-4 italic text-dark/20 text-[10px] flex items-center justify-end">
                    * This is a computer generated document
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between px-4 py-3 border-b-2 border-dark bg-[#FAF9F6]">
                       <span className="text-xs font-black uppercase tracking-widest">Total</span>
                       <span className="text-xs font-bold text-dark">₹{booking.amount}/-</span>
                    </div>
                    {booking.isOffline ? (
                      <>
                        <div className="flex justify-between px-4 py-3 border-b-2 border-dark">
                           <span className="text-xs font-black uppercase tracking-widest">Paid</span>
                           <span className="text-xs font-bold">₹{booking.totalPaid}/-</span>
                        </div>
                        <div className="flex justify-between px-4 py-3 bg-[#8FB13E]/10">
                           <span className="text-xs font-black uppercase tracking-widest text-[#8FB13E]">Balance</span>
                           <span className="text-xs font-black text-[#8FB13E]">₹{remaining}/-</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between px-4 py-3 bg-emerald-50">
                         <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Status</span>
                         <span className="text-xs font-black text-emerald-600">FULL PAID</span>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Totals & History (Only for Offline) */}
        {booking.isOffline && booking.installments?.length > 0 && (
           <div className="mb-16 bg-[#FAF9F6] p-8 rounded-xl border-2 border-dark/10">
              <p className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] mb-4">Detailed Payment History</p>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                 <div className="flex justify-between text-xs border-b border-dark/5 pb-1">
                    <span className="text-dark/40 italic">Initial Advance</span>
                    <span className="font-bold">₹{booking.advancePaid}</span>
                 </div>
                 {booking.installments.map((inst: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs border-b border-dark/5 pb-1">
                       <span className="text-dark/40 italic">{new Date(inst.date).toLocaleDateString()}</span>
                       <span className="font-bold">₹{inst.amount}</span>
                    </div>
                 ))}
                 <div className="flex justify-between text-sm font-black pt-2 col-span-2 text-[#8FB13E]">
                    <span>TOTAL RECEIVED</span>
                    <span>₹{booking.totalPaid}</span>
                 </div>
              </div>
           </div>
        )}

        {/* Footer Contact Section */}
        <div className="pt-10 border-t-2 border-dark/10 flex flex-col md:flex-row justify-between items-start gap-10">
           <div className="space-y-4 flex-1 text-left">
              <div className="flex items-center space-x-3 text-sm font-bold text-dark">
                 <Phone size={14} className="text-[#8FB13E]" />
                 <span>77410 83155 / 7219495714</span>
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

           {/* QR Section (Placeholder) */}
           <div className="flex flex-col items-center bg-[#FAF9F6] p-6 rounded-2xl border-2 border-dark/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark/30 mb-4">Official Instagram QR</p>
              <div className="w-32 h-32 p-3 bg-white rounded-xl shadow-sm mb-3 flex items-center justify-center">
                 <img 
                   src="/assets/instagram-qr.png" 
                   alt="QR" 
                   className="w-full h-full object-contain"
                   onError={(e) => {
                      (e.target as any).src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/ss_photography_official13/";
                   }}
                 />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8FB13E]">@SS_PHOTOGRAPHY_OFFICIAL13</p>
           </div>
        </div>
      </div>
      
      <p className="text-center mt-10 text-dark/20 text-[10px] font-black uppercase tracking-[0.5em] print:hidden">Official Invoice Document</p>
    </div>
  );
};

export default InvoicePage;
