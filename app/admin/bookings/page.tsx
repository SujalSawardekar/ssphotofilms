"use client";

import React, { useState, useEffect } from 'react';
import { Booking } from '@prisma/client';
import { getBookings, updateBookingStatus, addBooking, addPaymentInstallment, updateBookingPhotographer } from '@/lib/db';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Box, 
  Mail, 
  Phone, 
  Clock4, 
  CheckCircle2, 
  XCircle, 
  Check, 
  List, 
  Plus,
  FileText
} from 'lucide-react';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import AdminCalendar from '@/components/AdminCalendar';
import Link from 'next/link';

const AdminBookingsDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({ amount: 0, method: 'Cash' });
  
  // Form State for Manual Booking
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    eventDate: '',
    location: '',
    hours: 4,
    amount: 0,
    advancePaid: 0,
    paymentMethod: 'Cash',
    isCustomPrice: false,
    message: 'Offline/Manual Booking'
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.log("DB fetch failed, likely missing Prisma generate.");
    }
  };

  const pendingBookings = bookings.filter(b => b.status === "Pending");
  const acceptedBookings = bookings.filter(b => b.status === "Confirmed");

  const handleStatusChange = async (id: string, newStatus: string, reason?: string) => {
    try {
      await updateBookingStatus(id, newStatus, reason);
      await fetchBookings();
      if (newStatus === 'Confirmed') {
        fetch('/api/cron/reminders', {
          headers: { 'Authorization': 'Bearer ss-photo-reminder-secret' }
        }).catch(err => console.log("Silent reminder scan failed:", err));
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const handleStatusChangeSafe = (id: string, newStatus: string, reason?: string) => {
    if (newStatus === 'Rejected') {
      const r = window.prompt("Reason for rejection:");
      if (r !== null) handleStatusChange(id, newStatus, r);
    } else {
      handleStatusChange(id, newStatus);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBooking({
        ...formData,
        isOffline: true,
        status: 'Confirmed'
      });
      setIsManualModalOpen(false);
      resetForm();
      await fetchBookings();
      alert("Offline booking added successfully!");
    } catch (error) {
      alert("Error adding manual booking. Ensure 'npx prisma generate' was run.");
    }
  };

  const handleAddInstallment = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setPaymentData({ amount: 0, method: 'Cash' });
    setIsPaymentModalOpen(true);
  };

  const handleAssignPhotographer = async (id: string) => {
    const name = window.prompt("Enter Photographer Name:");
    if (name) {
      try {
        await updateBookingPhotographer(id, name);
        await fetchBookings();
      } catch (err) {
        alert("Failed to assign photographer.");
      }
    }
  };

  const submitInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    try {
      await addPaymentInstallment(selectedBookingId, paymentData.amount, paymentData.method);
      setIsPaymentModalOpen(false);
      await fetchBookings();
      alert("Payment recorded successfully!");
    } catch (err) {
      alert("Failed to add payment.");
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '', email: '', phone: '', eventType: 'Wedding', eventDate: '',
      location: '', hours: 4, amount: 0, advancePaid: 0, paymentMethod: 'Cash',
      isCustomPrice: false, message: 'Offline/Manual Booking'
    });
  };

  const handleNumChange = (field: string, val: string) => {
    const num = parseInt(val);
    setFormData({ ...formData, [field]: isNaN(num) ? 0 : num });
  };

  return (
    <div className="flex flex-col min-h-full font-manrope">
      {/* Header */}
      <section className="bg-[#F2EFEB] py-14 text-center border-b border-dark/5">
        <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-dark uppercase tracking-wider">
          BOOKINGS
        </h1>
        <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#646464] mt-3">
          REVIEW AND MANAGE CUSTOMER BOOKING REQUESTS
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center mt-10 gap-4">
           <div className="flex space-x-2 bg-dark/5 p-1 rounded-full">
              <button onClick={() => setViewMode('list')} className={`flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-dark text-white' : 'text-dark/40 hover:text-dark'}`}><List size={14} /><span>List</span></button>
              <button onClick={() => setViewMode('calendar')} className={`flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-dark text-white' : 'text-dark/40 hover:text-dark'}`}><CalendarIcon size={14} /><span>Calendar</span></button>
           </div>
           
           <button onClick={() => setIsManualModalOpen(true)} className="flex items-center space-x-2 px-8 py-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-gold border border-[#D4AF37]/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all">
              <Plus size={16} /><span>Create Offline Booking</span>
           </button>
        </div>
      </section>

      <div className="flex-1 px-8 py-12 space-y-16">
        {viewMode === 'calendar' ? (
          <section><AdminCalendar bookings={bookings} /></section>
        ) : (
          <>
            {/* Pending Section */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3"><Clock4 size={20} className="text-[#A16207]" /><h2 className="text-xl font-manrope font-medium text-dark">Pending Bookings ({pendingBookings.length})</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pendingBookings.length === 0 ? (
                  <div className="col-span-full py-12 bg-white rounded-xl border border-dashed border-dark/10 flex flex-col items-center justify-center space-y-3 opacity-40">
                    <Clock4 size={30} />
                    <p className="text-[10px] font-black uppercase tracking-widest">No pending bookings at the moment</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {pendingBookings.map(booking => (
                      <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                        key={booking.id} className="bg-white rounded-lg p-8 shadow-sm border border-dark/5 relative flex flex-col">
                        <div className="absolute top-6 right-6 px-4 py-1.5 rounded-md text-sm font-bold uppercase bg-[#FEF08A] text-[#854D0E]">Pending</div>
                        <h3 className="text-2xl font-cinzel text-dark mb-5 pr-24">{booking.clientName}</h3>
                        <div className="space-y-3 mb-6 flex-1 italic text-xs text-dark/60 leading-relaxed">
                          <div className="flex items-center space-x-3 text-xs text-dark"><CalendarIcon size={14} className="text-secondary" /><span>{booking.eventDate}</span></div>
                          <div className="flex items-center space-x-3 text-xs text-dark"><Mail size={14} className="text-secondary" /><span>{booking.email}</span></div>
                          <div className="flex items-center space-x-3 text-xs text-dark font-medium"><Box size={14} className="text-secondary" /><span>{booking.packageType || 'Custom'}</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <button onClick={() => handleStatusChange(booking.id, 'Confirmed')} className="py-3 bg-[#D1FAE5] text-[#059669] text-xs uppercase tracking-widest font-bold hover:bg-[#A7F3D0] rounded-md transition-colors">Accept</button>
                          <button onClick={() => handleStatusChangeSafe(booking.id, 'Rejected')} className="py-3 bg-[#FCE7F3] text-[#BE185D] text-xs uppercase tracking-widest font-bold hover:bg-[#FBCFE8] rounded-md transition-colors">Reject</button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </section>

            {/* Accepted Section */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3"><CheckCircle2 size={20} className="text-[#059669]" /><h2 className="text-xl font-manrope font-medium text-dark">Accepted Bookings ({acceptedBookings.length})</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {acceptedBookings.map(booking => {
                  const remaining = booking.amount - (booking.totalPaid || 0);
                  const isDone = new Date(booking.eventDate) < new Date();

                  return (
                    <div key={booking.id} className="bg-white rounded-2xl p-8 shadow-xl border border-dark/5 relative flex flex-col group overflow-hidden">
                      {/* Premium Accent */}
                      <div className="absolute top-0 left-0 w-2 h-full bg-gold opacity-30 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF2D55] italic">Premium Event</p>
                          <h3 className="text-2xl font-cinzel font-bold text-dark">{booking.clientName}</h3>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 ${
                          isDone ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-blue-600' : 'bg-emerald-600 animate-pulse'}`} />
                          <span>{isDone ? 'Concluded' : 'Active'}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-[#FAF9F6] rounded-xl border border-dark/5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Package</p>
                            <p className="text-xs font-bold text-dark uppercase">{booking.packageType || 'Wedding Shoot'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Location</p>
                            <p className="text-xs font-bold text-dark truncate">{booking.location}</p>
                          </div>
                        </div>
                        <div className="space-y-4 text-right">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Total Amount</p>
                            <p className="text-lg font-black text-dark tracking-tighter">₹{booking.amount.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Date</p>
                            <p className="text-xs font-bold text-dark">{new Date(booking.eventDate).toLocaleDateString('en-GB')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-10 flex-1">
                         <p className="text-[9px] font-black uppercase tracking-widest text-dark/20 border-b border-dark/5 pb-2">Technical Summary</p>
                         <ul className="space-y-2">
                            {booking.packageFeatures && booking.packageFeatures.slice(0, 3).map((f: string, i: number) => (
                              <li key={i} className="flex items-center text-[11px] font-medium text-dark/60">
                                <div className="w-1 h-1 bg-gold rounded-full mr-3 shrink-0" />
                                <span className="truncate">{f}</span>
                              </li>
                            ))}
                         </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleAssignPhotographer(booking.id)} className="flex items-center justify-center space-x-2 py-4 bg-dark text-white text-[9px] uppercase tracking-widest font-black rounded-lg hover:bg-gold hover:text-dark transition-all shadow-lg">
                           <span>{booking.photographerName ? booking.photographerName : 'Assign Team'}</span>
                        </button>
                        <Link href={`/admin/bookings/${booking.id}/invoice`} className="flex items-center justify-center space-x-2 py-4 border border-dark/10 text-dark text-[9px] uppercase tracking-widest font-black rounded-lg hover:bg-dark hover:text-white transition-all">
                          <FileText size={14} /><span>Detailed Invoice</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Manual Booking Modal */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-md">
             <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-10 border-b border-dark/5 pb-6">
                   <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-widest">Manual Booking</h2>
                   <button onClick={() => setIsManualModalOpen(false)} className="text-dark/20 hover:text-red-500"><XCircle size={24} /></button>
                </div>
                <form onSubmit={handleManualSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Name</label><input required className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Phone</label><input required className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Date</label><input required type="datetime-local" className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Location</label><input required className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Amount (₹)</label><input required type="number" className="px-4 py-2.5 border-2 border-dark/10 rounded-md focus:border-gold text-sm font-bold" value={formData.amount} onChange={e => handleNumChange('amount', e.target.value)} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Advance (₹)</label><input type="number" className="px-4 py-2.5 border-2 border-emerald-100 rounded-md focus:border-emerald-500 text-sm font-bold text-emerald-600" value={formData.advancePaid} onChange={e => handleNumChange('advancePaid', e.target.value)} /></div>
                   </div>
                   <button type="submit" className="w-full py-4 bg-dark text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-gold transition-all">Confirm Offline Booking</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Entry Modal (REPLACES BLACK BOX) */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark/70 backdrop-blur-md">
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-10">
                <div className="flex justify-between items-center mb-8 border-b border-dark/5 pb-4"><h2 className="text-xl font-cinzel font-bold text-dark uppercase tracking-widest">Add Payment</h2><button onClick={() => setIsPaymentModalOpen(false)} className="text-dark/20 hover:text-red-500"><XCircle size={20} /></button></div>
                <form onSubmit={submitInstallment} className="space-y-8">
                   <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Amount to Record (₹)</label><input required type="number" autoFocus className="px-5 py-4 bg-[#FAF9F6] border border-dark/5 rounded-xl focus:outline-none focus:border-gold text-2xl font-bold font-cinzel text-emerald-600" value={paymentData.amount === 0 ? '' : paymentData.amount} onChange={e => setPaymentData({...paymentData, amount: parseInt(e.target.value) || 0})} /></div>
                   <div className="flex flex-col space-y-2"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest text-center">Payment Method</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setPaymentData({...paymentData, method: 'Cash'})} className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${paymentData.method === 'Cash' ? 'bg-dark text-white' : 'bg-white text-dark/30 border-dark/10'}`}>Cash</button><button type="button" onClick={() => setPaymentData({...paymentData, method: 'Online'})} className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${paymentData.method === 'Online' ? 'bg-dark text-white' : 'bg-white text-dark/30 border-dark/10'}`}>Online</button></div></div>
                   <button type="submit" className="w-full py-4 bg-emerald-600 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">Confirm Receipt</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AdminBookingsDashboard;
