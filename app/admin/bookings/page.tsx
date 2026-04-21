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
import { pricingCategories } from '@/lib/mockData';
import { parsePrice } from '@/lib/utils';

const AdminBookingsDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({ amount: 0, method: 'Cash' });
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any | null>(null);
  
  // Custom UI State
  const [notifications, setNotifications] = useState<{id: number, message: string, type: 'success' | 'error'}[]>([]);
  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    value: string;
    onConfirm: (val: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    value: '',
    onConfirm: () => {}
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };
  
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
    message: 'Offline/Manual Booking',
    packageCategory: 'wedding',
    packageTitle: 'Basic Package'
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
      showNotification("Failed to update booking status.", "error");
    }
  };

  const handleStatusChangeSafe = (id: string, newStatus: string, reason?: string) => {
    if (newStatus === 'Rejected') {
      setPromptConfig({
        isOpen: true,
        title: 'Reject Booking',
        message: 'Please provide a reason for rejecting this booking.',
        value: '',
        onConfirm: (r) => {
          if (r.trim()) handleStatusChange(id, newStatus, r);
          else showNotification("Rejection reason is required.", "error");
        }
      });
    } else {
      handleStatusChange(id, newStatus);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      showNotification("Booking amount must be greater than zero.", "error");
      return;
    }
    if (formData.advancePaid < 0) {
      showNotification("Advance payment cannot be negative.", "error");
      return;
    }

    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      showNotification("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    try {
      await addBooking({
        ...formData,
        isOffline: true,
        status: 'Confirmed'
      });
      setIsManualModalOpen(false);
      resetForm();
      await fetchBookings();
      showNotification("Offline booking added successfully!", "success");
    } catch (error) {
      showNotification("Error adding manual booking.", "error");
    }
  };

  const handleAddInstallment = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setPaymentData({ amount: 0, method: 'Cash' });
    setIsPaymentModalOpen(true);
  };

  const handleAssignPhotographer = async (id: string) => {
    setPromptConfig({
      isOpen: true,
      title: 'Assign Team',
      message: 'Enter the name of the photographer/team for this event.',
      value: '',
      onConfirm: async (name) => {
        if (name.trim()) {
          try {
            await updateBookingPhotographer(id, name);
            await fetchBookings();
            showNotification(`Assigned ${name} successfully!`, "success");
          } catch (err) {
            showNotification("Failed to assign photographer.", "error");
          }
        }
      }
    });
  };

  const submitInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;
    if (paymentData.amount <= 0) {
      showNotification("Please enter a valid amount.", "error");
      return;
    }

    try {
      await addPaymentInstallment(selectedBookingId, paymentData.amount, paymentData.method);
      setIsPaymentModalOpen(false);
      await fetchBookings();
      showNotification("Payment recorded successfully!", "success");
    } catch (err) {
      showNotification("Failed to add payment.", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '', email: '', phone: '', eventType: 'Wedding', eventDate: '',
      location: '', hours: 4, amount: 0, advancePaid: 0, paymentMethod: 'Cash',
      isCustomPrice: false, message: 'Offline/Manual Booking',
      packageCategory: 'wedding',
      packageTitle: 'Basic Package'
    });
  };

  const handlePackageChange = (category: string, title: string) => {
    const pkg = pricingCategories.find(c => c.id === category)?.packages.find(p => p.title === title);
    if (pkg) {
      setFormData({
        ...formData,
        packageCategory: category,
        packageTitle: title,
        eventType: pricingCategories.find(c => c.id === category)?.label || 'Wedding',
        packageType: title,
        amount: parsePrice(pkg.discountPrice)
      } as any);
    }
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
                        key={booking.id} className="bg-white rounded-2xl p-8 shadow-sm border border-dark/5 relative flex flex-col group transition-all hover:shadow-xl">
                        
                        <div className="absolute top-6 right-6 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#FEF08A] text-[#854D0E] border border-[#854D0E]/10">Pending Approval</div>
                        
                        <div className="mb-6">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold italic mb-1">{booking.eventType || 'New Event'}</p>
                           <h3 className="text-3xl font-cinzel font-bold text-dark">{booking.clientName}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-8 border-b border-dark/5">
                           <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Contact Information</p>
                              <div className="flex flex-col space-y-1">
                                 <div className="flex items-center text-[10px] font-medium text-dark/70"><Mail size={12} className="mr-2 text-dark/40" /> {booking.email}</div>
                                 <div className="flex items-center text-[10px] font-medium text-dark/70"><Phone size={12} className="mr-2 text-dark/40" /> {booking.phone}</div>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Event Logistics</p>
                              <div className="flex flex-col space-y-1">
                                 <div className="flex items-center text-[10px] font-medium text-dark/70"><CalendarIcon size={12} className="mr-2 text-dark/40" /> {new Date(booking.eventDate).toLocaleDateString('en-GB')}</div>
                                 <div className="flex items-center text-[10px] font-medium text-dark/70"><MapPin size={12} className="mr-2 text-dark/40" /> {booking.location}</div>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Package & Duration</p>
                              <div className="text-[10px] font-bold text-dark uppercase">{booking.packageType || 'Custom'} ({booking.hours} Hours)</div>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Quoted Amount</p>
                              <div className="text-xl font-black text-dark tracking-tighter">₹{booking.amount?.toLocaleString()}</div>
                           </div>
                        </div>

                        {/* Payment Status for Pending */}
                        <div className="grid grid-cols-2 gap-4 mb-8 bg-[#FAF9F6]/50 p-4 rounded-xl border border-dark/5">
                           <div className="space-y-1 text-left">
                              <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Paid So Far</p>
                              <p className="text-sm font-black text-emerald-600">₹{Number(booking.totalPaid || 0).toLocaleString()}</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">
                                 {booking.isOffline ? 'Balance Due' : 'Outstanding'}
                              </p>
                              <p className={`text-sm font-black ${(Number(booking.amount) - Number(booking.totalPaid || 0)) > 0 ? (booking.isOffline ? 'text-red-500' : 'text-dark') : 'text-emerald-600'}`}>
                                 ₹{(Number(booking.amount) - Number(booking.totalPaid || 0)).toLocaleString()}
                              </p>
                           </div>
                        </div>

                        {booking.message && (
                           <div className="mb-8 p-4 bg-[#FAF9F6] rounded-lg italic text-[11px] text-dark/60 border-l-2 border-gold/40 quotes">
                              "{booking.message}"
                           </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-auto">
                          <button onClick={() => handleStatusChange(booking.id, 'Confirmed')} className="flex items-center justify-center space-x-2 py-4 bg-[#D1FAE5] text-[#059669] text-[10px] uppercase tracking-widest font-black rounded-lg hover:bg-emerald-600 hover:text-white transition-all">
                             <Check size={14} /><span>Accept Booking</span>
                          </button>
                          <button onClick={() => setSelectedBookingDetails(booking)} className="flex items-center justify-center space-x-2 py-4 border border-dark/10 text-dark text-[10px] uppercase tracking-widest font-black rounded-lg hover:bg-dark hover:text-white transition-all">
                             <Box size={14} /><span>View Details</span>
                          </button>
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
                  const remaining = Number(booking.amount) - (Number(booking.totalPaid) || 0);
                  const isDone = new Date(booking.eventDate) < new Date();

                  return (
                    <div key={booking.id} className="bg-white rounded-2xl p-8 shadow-xl border border-dark/5 relative flex flex-col group overflow-hidden">
                      {/* Premium Accent */}
                      <div className="absolute top-0 left-0 w-2 h-full bg-gold opacity-30 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-6 text-left">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF2D55] italic">Premium Event</p>
                             {booking.isOffline && <span className="bg-zinc-100 text-zinc-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Offline</span>}
                          </div>
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
                        <div className="space-y-4 text-left">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Package</p>
                            <p className="text-xs font-bold text-dark uppercase truncate">{booking.packageType || 'Professional Shoot'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Total Amount</p>
                            <p className="text-md font-black text-dark">₹{Number(booking.amount).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="space-y-4 text-right">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Paid So Far</p>
                            <p className="text-md font-black text-emerald-600">₹{Number(booking.totalPaid || 0).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">
                               Balance Remaining
                            </p>
                            <p className={`text-md font-black ${remaining > 0 ? (booking.isOffline ? 'text-red-500' : 'text-dark') : 'text-emerald-600'}`}>
                              {remaining <= 0 ? (
                                <span className="flex items-center justify-end gap-1"><CheckCircle2 size={12} /> PAID</span>
                              ) : (
                                `₹${Number(remaining).toLocaleString()}`
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {remaining <= 0 ? (
                          <div className="flex items-center justify-center space-x-2 py-3 bg-emerald-50 text-emerald-600 text-[9px] uppercase tracking-widest font-black rounded-lg border border-emerald-200">
                             <CheckCircle2 size={12} /><span>Fully Paid</span>
                          </div>
                        ) : (
                          <button onClick={() => handleAddInstallment(booking.id)} className="flex items-center justify-center space-x-2 py-3 bg-emerald-600 text-white text-[9px] uppercase tracking-widest font-black rounded-lg hover:bg-emerald-700 transition-all shadow-lg">
                             <Plus size={12} /><span>Add Pay</span>
                          </button>
                        )}
                        <button onClick={() => setSelectedBookingDetails(booking)} className="flex items-center justify-center space-x-2 py-3 border border-dark/10 text-dark text-[9px] uppercase tracking-widest font-black rounded-lg hover:bg-dark hover:text-white transition-all">
                           <Box size={12} /><span>Details</span>
                        </button>
                        <Link href={`/admin/bookings/${booking.id}/invoice`} className="flex items-center justify-center space-x-2 py-3 bg-dark text-gold text-[9px] uppercase tracking-widest font-black rounded-lg hover:bg-gold hover:text-dark transition-all">
                           <FileText size={12} /><span>Invoice</span>
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
             <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-10 border-b border-dark/5 pb-6">
                   <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-widest">Manual Booking</h2>
                   <button onClick={() => setIsManualModalOpen(false)} className="text-dark/20 hover:text-red-500"><XCircle size={24} /></button>
                </div>
                <form onSubmit={handleManualSubmit} className="space-y-8">
                   <div className="grid grid-cols-2 gap-8 text-left">
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Client Name</label><input required className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Phone Number</label><input required type="tel" pattern="[6-9][0-9]{9}" placeholder="10-digit number" className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                      
                      {/* Package Selection */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Service Category</label>
                        <select className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md text-sm" value={formData.packageCategory} onChange={e => handlePackageChange(e.target.value, formData.packageTitle)}>
                          {pricingCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Package Tier</label>
                        <select className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md text-sm" value={formData.packageTitle} onChange={e => handlePackageChange(formData.packageCategory, e.target.value)}>
                          {pricingCategories.find(c => c.id === formData.packageCategory)?.packages.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Event Date</label><input required type="datetime-local" className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Location</label><input required className="px-4 py-2.5 bg-[#FAF9F6] border border-dark/5 rounded-md focus:outline-none focus:border-gold text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                      
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Total Amount (₹)</label><input required type="number" min="1" className="px-4 py-2.5 border-2 border-dark/10 rounded-md focus:border-gold text-sm font-bold" value={formData.amount} onChange={e => handleNumChange('amount', e.target.value)} /></div>
                      <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Advance Paid (₹)</label><input type="number" min="0" className="px-4 py-2.5 border-2 border-emerald-100 rounded-md focus:border-emerald-500 text-sm font-bold text-emerald-600" value={formData.advancePaid} onChange={e => handleNumChange('advancePaid', e.target.value)} /></div>
                   </div>
                   <button type="submit" className="w-full py-4 bg-dark text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-gold transition-all">Confirm Offline Booking</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md">
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-8 border-b border-dark/5 pb-4">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-1">{selectedBookingDetails.eventType}</p>
                    <h2 className="text-2xl font-cinzel font-bold text-dark">{selectedBookingDetails.clientName}</h2>
                  </div>
                  <button onClick={() => setSelectedBookingDetails(null)} className="p-2 text-dark/20 hover:text-red-500 transition-colors"><XCircle size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-10 pr-4">
                  <div className="grid grid-cols-2 gap-10 text-left">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-dark/30 uppercase tracking-widest">Package Features</p>
                      <ul className="space-y-2">
                        {selectedBookingDetails.packageFeatures?.map((f: string, i: number) => (
                          <li key={i} className="text-xs text-dark/70 flex items-start">
                            <Check size={10} className="mr-2 mt-1 text-emerald-500 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-dark/30 uppercase tracking-widest">Premium Upgrades</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBookingDetails.includeBothSide && <span className="px-3 py-1 bg-gold/10 text-gold text-[8px] font-black uppercase rounded-full">Both Side Coverage</span>}
                          {selectedBookingDetails.includeReel && <span className="px-3 py-1 bg-[#FF2D55]/10 text-[#FF2D55] text-[8px] font-black uppercase rounded-full">Cinematic Reel</span>}
                        </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-dark/30 uppercase tracking-widest">Total Transaction</p>
                         <p className="text-2xl font-cinzel font-bold text-dark">₹{Number(selectedBookingDetails.amount).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedBookingDetails.installments?.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-dark/30 uppercase tracking-[0.2em] border-b border-dark/5 pb-2 text-left">Payment Installments</p>
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-dark/40 border-b border-dark/5 italic">
                            <th className="py-2 font-medium">Date</th>
                            <th className="py-2 font-medium">Method</th>
                            <th className="py-2 font-medium text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark/5">
                          {selectedBookingDetails.installments.map((inst: any, i: number) => (
                            <tr key={inst.id}>
                              <td className="py-3">{new Date(inst.date).toLocaleDateString()}</td>
                              <td className="py-3 uppercase font-black text-[9px] tracking-widest">{inst.method}</td>
                              <td className="py-3 text-right font-bold">₹{Number(inst.amount).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-dark">
                            <td colSpan={2} className="py-4 font-black uppercase tracking-widest">Total Received</td>
                            <td className="py-4 text-right font-black text-emerald-600 text-sm">₹{Number(selectedBookingDetails.totalPaid).toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {selectedBookingDetails.message && (
                    <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-dark/5 text-left">
                      <p className="text-[9px] font-black text-dark/30 uppercase tracking-widest mb-2">Message/Notes</p>
                      <p className="text-sm italic text-dark/60">"{selectedBookingDetails.message}"</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-dark/5 flex justify-end">
                  <button onClick={() => setSelectedBookingDetails(null)} className="px-8 py-3 bg-dark text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all">Close Details</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Entry Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark/70 backdrop-blur-md">
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-10">
                <div className="flex justify-between items-center mb-8 border-b border-dark/5 pb-4"><h2 className="text-xl font-cinzel font-bold text-dark uppercase tracking-widest">Add Payment</h2><button onClick={() => setIsPaymentModalOpen(false)} className="text-dark/20 hover:text-red-500"><XCircle size={20} /></button></div>
                <form onSubmit={submitInstallment} className="space-y-8">
                   <div className="flex flex-col space-y-1.5"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest">Amount to Record (₹)</label><input required type="number" min="1" autoFocus className="px-5 py-4 bg-[#FAF9F6] border border-dark/5 rounded-xl focus:outline-none focus:border-gold text-2xl font-bold font-cinzel text-emerald-600" value={paymentData.amount === 0 ? '' : paymentData.amount} onChange={e => setPaymentData({...paymentData, amount: parseInt(e.target.value) || 0})} /></div>
                   <div className="flex flex-col space-y-2"><label className="text-[10px] font-black text-dark/30 uppercase tracking-widest text-center">Payment Method</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setPaymentData({...paymentData, method: 'Cash'})} className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${paymentData.method === 'Cash' ? 'bg-dark text-white' : 'bg-white text-dark/30 border-dark/10'}`}>Cash</button><button type="button" onClick={() => setPaymentData({...paymentData, method: 'Online'})} className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${paymentData.method === 'Online' ? 'bg-dark text-white' : 'bg-white text-dark/30 border-dark/10'}`}>Online</button></div></div>
                   <button type="submit" className="w-full py-4 bg-emerald-600 text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">Confirm Receipt</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Prompt Modal */}
      <AnimatePresence>
        {promptConfig.isOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-lg">
              <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
                 <h2 className="text-xl font-cinzel font-bold text-dark uppercase tracking-widest mb-2">{promptConfig.title}</h2>
                 <p className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mb-6">{promptConfig.message}</p>
                 <div className="space-y-6">
                    <input autoFocus className="w-full px-4 py-3 bg-[#FAF9F6] border border-dark/10 rounded-lg focus:outline-none focus:border-gold font-medium" value={promptConfig.value} onChange={e => setPromptConfig({...promptConfig, value: e.target.value})} placeholder="Type here..." />
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => setPromptConfig({...promptConfig, isOpen: false})} className="py-3 border border-dark/10 text-dark/40 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-dark/5 transition-all">Cancel</button>
                       <button onClick={() => { promptConfig.onConfirm(promptConfig.value); setPromptConfig({...promptConfig, isOpen: false}); }} className="py-3 bg-dark text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gold transition-all">Confirm</button>
                    </div>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col space-y-3 pointer-events-none">
         <AnimatePresence>
            {notifications.map(n => (
               <motion.div key={n.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className={`flex items-center space-x-3 px-6 py-4 rounded-full shadow-2xl pointer-events-auto border ${n.type === 'success' ? 'bg-[#D1FAE5] text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                  {n.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-rose-500" />}
                  <span className="text-[11px] font-black uppercase tracking-widest">{n.message}</span>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      <Footer />

    </div>
  );
};

export default AdminBookingsDashboard;
