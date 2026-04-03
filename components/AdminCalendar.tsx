"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Booking } from '@prisma/client';

interface AdminCalendarProps {
  bookings: any[]; 
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
    setSelectedBooking(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
    setSelectedBooking(null);
  };

  const handleYearChange = (newYear: number) => {
    setCurrentDate(new Date(newYear, month, 1));
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(year, month);
    const offset = firstDayOfMonth(year, month);
    const pads = Array(offset).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    return [...pads, ...days];
  }, [year, month]);

  const getBookingsForDay = (day: number | null) => {
    if (!day) return [];
    return bookings.filter(b => {
      if (!b.eventDate) return false;
      const bDate = new Date(b.eventDate);
      return (
        bDate.getDate() === day &&
        bDate.getMonth() === month &&
        bDate.getFullYear() === year
      );
    });
  };

  const dayBookings = getBookingsForDay(selectedDay);
  const now = new Date();

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-2xl border border-dark/10 shadow-2xl overflow-hidden font-manrope min-h-[600px]">
      
      {/* Left Pane: Calendar Grid */}
      <div className="lg:w-[450px] border-r border-dark/10 flex flex-col bg-white">
        {/* Calendar Header */}
        <div className="p-8 border-b border-dark/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <select 
                value={month} 
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="bg-transparent font-cinzel font-bold text-dark uppercase tracking-widest outline-none cursor-pointer hover:text-gold transition-colors"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select 
                value={year} 
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="bg-transparent font-cinzel font-bold text-gold outline-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const y = new Date().getFullYear() - 5 + i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
           <div className="flex items-center space-x-1">
             <button onClick={prevMonth} className="p-2 hover:bg-dark/5 rounded-full transition-colors text-dark/40 hover:text-dark">
               <ChevronLeft size={20} />
             </button>
             <button onClick={nextMonth} className="p-2 hover:bg-dark/5 rounded-full transition-colors text-dark/40 hover:text-dark">
               <ChevronRight size={20} />
             </button>
           </div>
        </div>

        {/* Week Day Labels */}
        <div className="grid grid-cols-7 bg-[#FAF9F6] border-b border-dark/5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-dark/30">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 flex-1 border-t border-dark/5">
           {calendarDays.map((day, idx) => {
             const dayBookingsList = getBookingsForDay(day);
             const isSelected = selectedDay === day;
             const isToday = day && day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
             
             const confirmedBookings = dayBookingsList.filter(b => b.status === 'Confirmed');
             const hasConfirmed = confirmedBookings.length > 0;
             const isPastDate = day && new Date(year, month, day) < new Date(now.setHours(0,0,0,0));
             const isEventDone = hasConfirmed && isPastDate;

             return (
               <div 
                 key={idx} 
                 onClick={() => { if(day) { setSelectedDay(day); setSelectedBooking(null); setShowAllUpcoming(false); }}}
                 className={`relative h-12 flex flex-col items-center justify-center cursor-pointer transition-all border-b border-r border-dark/5 ${
                   !day ? 'bg-dark/[0.01] cursor-default' : 
                   isSelected ? 'bg-gold/10' : 
                   isEventDone ? 'bg-blue-50/50' :
                   hasConfirmed ? 'bg-emerald-50' : 'bg-white hover:bg-dark/[0.02]'
                 }`}
               >
                  {day && (
                    <>
                      <span className={`text-sm font-bold transition-all ${
                        isSelected ? 'text-gold scale-125' : 
                        isToday ? 'text-dark underline decoration-gold decoration-2 underline-offset-4' : 
                        isEventDone ? 'text-blue-400' :
                        hasConfirmed ? 'text-emerald-600' : 'text-dark/40'
                      }`}>
                        {day}
                      </span>
                      {hasConfirmed && (
                        <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isEventDone ? 'bg-blue-300' : 'bg-emerald-400'}`} />
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Right Pane: Day Details */}
      <div className="flex-1 flex flex-col bg-[#FAF9F6]">
        <AnimatePresence mode="wait">
          {!selectedDay || (dayBookings.length === 0 && !showAllUpcoming) ? (
            <motion.div 
               initial={{opacity:0}} animate={{opacity:1}}
               className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto"
            >
               <div className="text-center py-12 border-b border-dark/10 mb-10">
                  <CalendarIcon size={48} strokeWidth={1} className="mx-auto mb-4 text-dark/10" />
                  <p className="font-cinzel tracking-widest uppercase text-xs text-dark/30">
                    {selectedDay ? `No events scheduled for ${new Date(year, month, selectedDay).toLocaleDateString()}` : 'Select a date to view bookings'}
                  </p>
               </div>

               {/* Upcoming Events Section */}
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Upcoming Events</h3>
                  <div className="space-y-4">
                    {bookings
                      .filter(b => b.status === 'Confirmed' && new Date(b.eventDate) >= new Date())
                      .sort((a,b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                      .slice(0, 3)
                      .map(b => (
                        <div key={b.id} onClick={() => { setSelectedBooking(b); setSelectedDay(new Date(b.eventDate).getDate()); setCurrentDate(new Date(b.eventDate)); }}
                          className="group bg-white p-6 rounded-xl border border-dark/5 hover:border-gold shadow-sm transition-all cursor-pointer flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Clock size={16} /></div>
                              <div>
                                 <h4 className="font-cinzel font-bold text-dark group-hover:text-gold transition-colors">{b.clientName}</h4>
                                 <p className="text-[10px] text-dark/40 uppercase font-black tracking-widest">{b.eventType} • {new Date(b.eventDate).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <ChevronRight size={16} className="text-dark/10" />
                        </div>
                      ))
                    }
                    <button 
                      onClick={() => setShowAllUpcoming(true)}
                      className="w-full py-4 border border-dark/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-dark/20 hover:text-gold hover:border-gold transition-all"
                    >
                       View All Upcoming Events
                    </button>
                  </div>
               </div>
            </motion.div>
          ) : showAllUpcoming ? (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto">
               <button onClick={() => setShowAllUpcoming(false)} className="text-[10px] font-black text-dark/40 uppercase tracking-widest hover:text-gold flex items-center mb-10">
                  <ChevronLeft size={16} className="mr-1" /> Back to calendar
               </button>
               <h3 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-widest mb-8">All Upcoming Events</h3>
               <div className="space-y-4">
                  {bookings
                    .filter(b => b.status === 'Confirmed' && new Date(b.eventDate) >= new Date())
                    .sort((a,b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                    .map(b => (
                      <div key={b.id} onClick={() => { setSelectedBooking(b); setShowAllUpcoming(false); setSelectedDay(new Date(b.eventDate).getDate()); }}
                        className="group bg-white p-6 rounded-xl border border-dark/5 hover:border-gold shadow-sm transition-all cursor-pointer flex items-center justify-between">
                         <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Clock size={20} /></div>
                            <div>
                               <h4 className="font-cinzel font-bold text-dark text-lg group-hover:text-gold transition-colors">{b.clientName}</h4>
                               <div className="flex items-center space-x-4 mt-1">
                                 <span className="text-[10px] text-dark/40 font-bold uppercase tracking-widest">{b.eventType}</span>
                                 <span className="text-xs text-dark/20">•</span>
                                 <span className="text-[10px] text-dark/60 font-black">{new Date(b.eventDate).toLocaleString()}</span>
                               </div>
                            </div>
                         </div>
                         <ExternalLink size={18} className="text-dark/10 group-hover:text-gold transition-colors" />
                      </div>
                    ))
                  }
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key={selectedDay}
              initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}
              className="flex-1 flex flex-col p-8 lg:p-12"
            >
              {/* Day Header */}
              <div className="mb-10 pb-8 border-b border-dark/10">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">Schedule For</p>
                <h3 className="text-3xl font-cinzel font-bold text-dark">
                  {new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>

              {/* Event List or Selected Event Details */}
              <div className="flex-1">
                {selectedBooking ? (
                  /* SELECTED BOOKING VIEW */
                  <div className="space-y-8 max-w-2xl">
                    <button 
                      onClick={() => setSelectedBooking(null)}
                      className="text-[10px] font-black text-dark/40 uppercase tracking-widest hover:text-gold flex items-center mb-6"
                    >
                      <ChevronLeft size={16} className="mr-1" /> Back to list
                    </button>

                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center space-x-3">
                          {new Date(selectedBooking.eventDate) < new Date() ? (
                            <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
                              <CheckCircle2 size={12} className="mr-1.5" /> Event Done
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                              Upcoming Event
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest mb-1">Client</p>
                          <p className="text-xl font-cinzel text-dark">{selectedBooking.clientName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest mb-1">Event Type</p>
                          <p className="text-lg text-dark">{selectedBooking.eventType}</p>
                        </div>
                        <div className="flex items-center space-x-6">
                           <div>
                             <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest mb-1">Time</p>
                             <div className="flex items-center text-dark font-medium">
                               <Clock size={16} className="text-gold mr-2" />
                               {new Date(selectedBooking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest mb-1">Duration</p>
                             <p className="text-dark font-medium">{selectedBooking.hours} Hours</p>
                           </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-dark/5 shadow-sm space-y-4">
                        <p className="text-[10px] font-black text-dark/30 uppercase tracking-widest mb-2 border-b border-dark/5 pb-2">Financials</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-dark/60">Total Amount:</span>
                          <span className="text-lg font-bold text-dark font-cinzel">₹{selectedBooking.amount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-dark/60">Advance Paid:</span>
                          <span className="text-sm font-bold text-emerald-600">₹{selectedBooking.advancePaid || 0}</span>
                        </div>
                        <div className="pt-2 border-t border-dark/5 flex justify-between items-center">
                          <span className="text-sm font-bold text-dark">Remaining:</span>
                          <span className="text-lg font-black text-gold font-cinzel">₹{selectedBooking.amount - (selectedBooking.totalPaid || 0)}</span>
                        </div>
                        <div className="pt-4 border-t border-dark/5">
                           <p className="text-[9px] font-black text-dark/30 uppercase mb-2 tracking-widest">Payment History</p>
                           {(selectedBooking.installments && selectedBooking.installments.length > 0) ? (
                              <div className="space-y-1.5">
                                {selectedBooking.installments.map((inst: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-[11px]">
                                    <span className="text-dark/40 italic">{new Date(inst.date).toLocaleDateString()}</span>
                                    <span className="font-bold text-dark/60">₹{inst.amount} ({inst.method})</span>
                                  </div>
                                ))}
                              </div>
                           ) : (
                              <p className="text-[10px] italic text-dark/20 text-center">No installments recorded</p>
                           )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-dark/10 flex flex-wrap gap-4">
                       <Link href={`/admin/bookings/${selectedBooking.id}/invoice`} className="px-6 py-2.5 bg-dark text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-gold hover:text-dark transition-all flex items-center space-x-2">
                         <FileText size={14} /><span>Generate Invoice</span>
                       </Link>
                    </div>
                  </div>
                ) : (
                  /* LIST VIEW FOR THE DAY */
                  <div className="space-y-4">
                    {dayBookings.length > 0 ? (
                      dayBookings.map(b => (
                        <div 
                          key={b.id} 
                          onClick={() => setSelectedBooking(b)}
                          className="group bg-white p-6 rounded-xl border border-dark/5 hover:border-gold shadow-sm hover:shadow-xl transition-all cursor-pointer flex items-center justify-between"
                        >
                           <div className="flex items-center space-x-6">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                b.status === 'Pending' ? 'bg-gold/10 text-gold' : 'bg-red-50 text-red-600'
                              }`}>
                                <Clock size={20} />
                              </div>
                              <div>
                                <h4 className="font-cinzel font-bold text-dark text-lg group-hover:text-gold transition-colors">{b.clientName}</h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-[10px] text-dark/40 font-bold uppercase tracking-widest">{b.eventType}</span>
                                  <span className="text-xs text-dark/20">•</span>
                                  <span className="text-[10px] text-dark/60 font-black">{new Date(b.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                           </div>
                           <ExternalLink size={18} className="text-dark/10 group-hover:text-gold transition-colors" />
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-dark/20 border-2 border-dashed border-dark/5 rounded-xl">
                        <p className="font-cinzel uppercase tracking-[0.2em] text-xs">No events scheduled for this day</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCalendar;
