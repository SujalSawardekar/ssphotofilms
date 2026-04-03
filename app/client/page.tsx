"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { Booking, ClientQuery, ClientQueryMessage } from '@prisma/client';
import { getBookings, getQueries, addQueryMessage, markQueryMessagesAsSeen } from '@/lib/db';
import { Calendar, MapPin, Box, MessageSquare, Link as LinkIcon, Send, CheckCheck } from 'lucide-react';
import Footer from '@/components/Footer';
import ClientSidebar from '@/components/ClientSidebar';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [clientBookings, setClientBookings] = useState<Booking[]>([]);
  const [clientQueries, setClientQueries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'queries' | 'account'>('bookings');
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const clientName = user?.name || "";
  const clientEmail = user?.email || "";

  const fetchDashboardData = async () => {
    const allBookings = await getBookings();
    setClientBookings(allBookings.filter(b => b.email === clientEmail || b.clientName === clientName));

    const allQueries = await getQueries();
    setClientQueries(allQueries.filter(q => q.userEmail === clientEmail || q.email === clientEmail));
  };

  useEffect(() => {
    if (clientEmail || clientName) {
      fetchDashboardData();
    }
  }, [clientName, clientEmail]);

  useEffect(() => {
    if (selectedQueryId && clientQueries.length > 0) {
      const active = clientQueries.find(q => q.id === selectedQueryId);
      if (active && active.messages.some((m: any) => m.sender === 'admin' && m.status === 'sent')) {
        markQueryMessagesAsSeen(selectedQueryId, 'client').then(() => fetchDashboardData());
      }
    }
  }, [selectedQueryId, clientQueries]);

  const handleSendMessage = async (queryId: string) => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await addQueryMessage(queryId, replyText, 'client');
      setReplyText('');
      await fetchDashboardData();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess("Password updated successfully!");
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPasswordError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const activeChat = clientQueries.find(q => q.id === selectedQueryId);

  return (
    <div className="flex min-h-screen bg-[#F6F4F0] font-manrope">
      <ClientSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-auto">

        {/* === BOOKINGS TAB === */}
        {activeTab === 'bookings' && (
          <>
            <section className="bg-[#F2EFEB] py-14 text-center border-b border-dark/5">
              <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-dark uppercase tracking-wider">
                MY BOOKINGS
              </h1>
              <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#646464] mt-3">
                MANAGE AND TRACK YOUR PHOTOGRAPHY SESSIONS
              </p>
            </section>

            <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-12 space-y-8">
              {clientBookings.map((booking, idx) => (
                <div key={idx} className="bg-white rounded-lg p-8 shadow-sm border border-dark/5 relative overflow-hidden">
                  <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wider ${
                    (booking.status === 'Confirmed' && new Date(booking.eventDate) < new Date()) ? 'bg-blue-100 text-blue-600' :
                    booking.status === 'Confirmed' ? 'bg-[#A7F3D0] text-[#065F46]' :
                    booking.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                    booking.status === 'Completed' ? 'bg-[#F3F4F6] text-[#374151]' :
                    'bg-[#FEF08A] text-[#854D0E]'
                  }`}>
                    {(booking.status === 'Confirmed' && new Date(booking.eventDate) < new Date()) ? 'Event Done' : 
                     booking.status === 'Confirmed' ? 'Accepted' : booking.status}
                  </div>

                  <h2 className="text-2xl font-cinzel text-dark mb-4">{booking.eventType}</h2>

                  {booking.status === 'Confirmed' && (
                    new Date(booking.eventDate) < new Date() ? 
                    <p className="text-blue-600 font-medium text-sm mb-4 flex items-center">
                      <CheckCheck size={14} className="mr-2" /> Service Completed. Thank you for choosing us!
                    </p> :
                    <p className="text-[#059669] font-medium text-sm mb-4 flex items-center">
                      <CheckCheck size={14} className="mr-2" /> Booking Confirmed. Your date is secured.
                    </p>
                  )}
                  {booking.status === 'Rejected' && (
                    <div className="mb-4">
                      <p className="text-[#D0312D] font-bold text-sm">✗ This booking was not accepted.</p>
                      <p className="text-secondary text-xs italic mt-1">Reason: {(booking as any).cancellationReason || "No reason specified."}</p>
                    </div>
                  )}
                  {booking.status === 'Completed' && <p className="text-[#374151] font-medium text-sm mb-4">✓ Service Completed.</p>}
                  {booking.status === 'Pending' && <p className="text-[#A16207] font-medium text-sm mb-4">⏳ Awaiting confirmation from our team.</p>}

                  <div className="flex flex-col md:flex-row md:items-center gap-5 mb-4">
                    <div className="flex items-center space-x-3 text-sm text-dark">
                      <Calendar size={16} className="text-secondary" />
                      <span>{booking.eventDate}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-dark">
                      <MapPin size={16} className="text-secondary" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3 pt-4 border-t border-dark/5 mt-4">
                    <div className="flex items-start space-x-3 text-sm text-dark">
                      <Box size={16} className="text-secondary mt-1 shrink-0" />
                      <div>
                        <p className="font-bold uppercase text-[10px] tracking-widest text-secondary mb-2">{booking.packageType || 'Custom Package'}</p>
                        <ul className="space-y-1.5">
                          {(booking as any).packageFeatures && (booking as any).packageFeatures.length > 0 ? (
                            (booking as any).packageFeatures.map((feature: string, i: number) => (
                              <li key={i} className="text-xs text-dark/70 flex items-center">
                                <span className="w-1 h-1 bg-gold rounded-full mr-2 shrink-0" />
                                {feature}
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-dark/40 italic">Standard shoot features included.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {(booking as any).photographerName && (
                      <div className="flex items-center space-x-3 text-sm text-dark bg-gold/5 p-3 rounded-md border border-gold/10">
                        <CheckCheck size={16} className="text-gold shrink-0" />
                        <p className="text-xs font-bold uppercase tracking-widest text-dark">Assigned: {(booking as any).photographerName}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {clientBookings.length === 0 && (
                <div className="text-center py-20 bg-white border border-dark/5 rounded-lg">
                  <p className="text-secondary mb-4">You have no active bookings.</p>
                  <Link href="/services" className="text-dark font-bold uppercase text-xs tracking-widest underline underline-offset-4">
                    Browse Services
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* === QUERIES TAB (CONVERSATIONAL) === */}
        {activeTab === 'queries' && (
          <div className="flex-1 flex flex-col min-h-screen">
            <section className="bg-[#F2EFEB] py-14 text-center border-b border-dark/5">
              <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-dark uppercase tracking-wider">
                MY MESSAGES
              </h1>
              <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#646464] mt-3">
                DIRECT CONVERSATION WITH OUR CREATIVE TEAM
              </p>
            </section>

            <div className="flex-1 flex h-[600px] bg-white border-t border-dark/5">
               {/* Sessions List */}
               <div className="w-full md:w-80 border-r border-dark/5 flex flex-col bg-white">
                  <div className="p-4 border-b border-dark/5 bg-[#F8F9FA] flex justify-between items-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Chat History</p>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-dark/5">
                     {clientQueries.map(q => (
                        <button 
                          key={q.id}
                          onClick={() => setSelectedQueryId(q.id)}
                          className={`w-full text-left p-6 transition-all hover:bg-[#F5F6F6] ${selectedQueryId === q.id ? 'bg-[#F2EFEB] border-l-4 border-gold pl-5' : ''}`}
                        >
                           <div className="flex justify-between items-baseline mb-1">
                              <span className="text-[10px] font-bold text-dark uppercase tracking-widest">{q.date}</span>
                              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${q.status === 'Open' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                 {q.status}
                              </span>
                           </div>
                           <p className="text-[11px] text-secondary truncate font-medium">{q.messages.length > 0 ? q.messages[q.messages.length-1].text : q.message}</p>
                        </button>
                     ))}
                     {clientQueries.length === 0 && (
                        <div className="p-12 text-center opacity-40">
                           <MessageSquare className="mx-auto mb-4" size={24} />
                           <p className="text-[10px] uppercase font-bold tracking-widest">No Active Chats</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Chat Window */}
               <div className="flex-1 bg-[#EBE7E0] relative flex flex-col overflow-hidden" style={{ backgroundImage: 'url("https://w7.pngwing.com/pngs/422/126/png-transparent-whatsapp-background-thumbnail.png")', backgroundRepeat: 'repeat', backgroundSize: '300px', backgroundBlendMode: 'soft-light' }}>
                  <AnimatePresence mode="wait">
                  {activeChat ? (
                     <motion.div 
                        key={activeChat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col"
                     >
                        {/* Feed */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                           {/* Initial Inquiry */}
                           <div className="flex justify-end">
                              <div className="bg-[#DCF8C6] p-4 rounded-lg rounded-tr-none shadow-sm max-w-[80%] relative">
                                 <p className="text-xs text-dark font-medium leading-relaxed">{activeChat.message}</p>
                                 <div className="text-right mt-2">
                                    <span className="text-[8px] text-secondary font-bold uppercase tracking-widest">{activeChat.date}</span>
                                 </div>
                              </div>
                           </div>

                           {/* Messages */}
                           {activeChat.messages.map((msg: any) => (
                              <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`p-4 rounded-lg shadow-sm max-w-[80%] relative ${msg.sender === 'client' ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                                    <p className="text-xs text-dark font-medium leading-relaxed">{msg.text}</p>
                                    <div className="flex items-center justify-end space-x-1 mt-2">
                                       <span className="text-[8px] text-secondary font-bold uppercase tracking-widest">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                       {msg.sender === 'client' && (
                        <div className="flex items-center ml-1">
                           {msg.status === 'seen' ? (
                             <CheckCheck size={12} className="text-blue-500" />
                           ) : (
                             <CheckCheck size={12} className="text-secondary/40" />
                           )}
                        </div>
                     )}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white/80 backdrop-blur-md border-t border-dark/5">
                           <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(activeChat.id); }} className="flex items-center space-x-4 max-w-3xl mx-auto">
                              <input 
                                 type="text"
                                 placeholder="Send a message..."
                                 className="flex-1 bg-[#F0F2F5] rounded-full px-6 py-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-gold transition-all"
                                 value={replyText}
                                 onChange={(e) => setReplyText(e.target.value)}
                              />
                              <button 
                                 type="submit"
                                 disabled={!replyText.trim() || loading}
                                 className="w-10 h-10 bg-dark text-gold flex items-center justify-center rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                              >
                                 {loading ? <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /> : <Send size={16} />}
                              </button>
                           </form>
                        </div>
                     </motion.div>
                  ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-12 space-y-6">
                        <MessageSquare size={64} className="text-gold" />
                        <div className="space-y-2">
                           <h3 className="text-xl font-cinzel font-bold text-dark uppercase tracking-tight">Your Direct Portal</h3>
                           <p className="text-[10px] font-bold uppercase tracking-widest max-w-[250px] leading-loose">Select a conversation from the left to view messages or ask the team a follow-up question.</p>
                        </div>
                     </div>
                  )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        )}

        {/* === ACCOUNT TAB === */}
        {activeTab === 'account' && (
          <>
            <section className="bg-[#F2EFEB] py-14 text-center border-b border-dark/5">
              <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-dark uppercase tracking-wider">
                MY ACCOUNT
              </h1>
              <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#646464] mt-3">
                VIEW AND MANAGE YOUR PROFILE DETAILS
              </p>
            </section>

            <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">
              <div className="bg-white rounded-lg p-10 shadow-sm border border-dark/5 space-y-10">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-gold border-2 border-gold/10">
                    <span className="text-4xl font-bold font-cinzel">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-tight">{user?.name}</h2>
                    <p className="text-secondary font-medium tracking-widest uppercase text-xs mt-1">Authorized Client Account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-dark/5">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Email Address</p>
                    <p className="text-dark font-medium">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Account Type</p>
                    <p className="text-dark font-medium uppercase tracking-widest text-sm">Standard {user?.role}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Member Since</p>
                    <p className="text-dark font-medium">March 2026</p>
                  </div>
                   <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Security</p>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="text-dark font-bold text-xs underline underline-offset-4 decoration-gold/50 hover:decoration-gold transition-all"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white p-8 md:p-10 shadow-2xl border-t-8 border-gold overflow-hidden rounded-lg mx-auto"
            >
              <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-cinzel font-bold text-dark uppercase tracking-tight">Update Password</h3>
                   <p className="text-[9px] text-secondary uppercase tracking-widest font-bold opacity-40">Secure your account</p>
                </div>

                {passwordError && <div className="bg-red-50 text-red-500 text-[10px] p-2.5 rounded font-bold uppercase tracking-widest border border-red-100">{passwordError}</div>}
                {passwordSuccess && <div className="bg-emerald-50 text-emerald-500 text-[10px] p-2.5 rounded font-bold uppercase tracking-widest border border-emerald-100">{passwordSuccess}</div>}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-secondary ml-0.5">Current Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-[#F9F9F9] border border-dark/5 focus:border-gold py-2.5 px-4 outline-none text-xs font-bold text-dark transition-all rounded"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-secondary ml-0.5">New Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-[#F9F9F9] border border-dark/5 focus:border-gold py-2.5 px-4 outline-none text-xs font-bold text-dark transition-all rounded"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-secondary ml-0.5">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-[#F9F9F9] border border-dark/5 focus:border-gold py-2.5 px-4 outline-none text-xs font-bold text-dark transition-all rounded"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    />
                  </div>

                  <div className="flex flex-col space-y-3 pt-2">
                    <button 
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full bg-dark text-gold font-bold uppercase tracking-widest text-[10px] py-3.5 shadow-xl hover:bg-gold hover:text-dark transition-all duration-300 disabled:opacity-50"
                    >
                      {passwordLoading ? 'Verifying...' : 'Set New Password'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="text-secondary font-bold uppercase tracking-widest text-[8px] hover:text-dark transition-colors text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientDashboard;
