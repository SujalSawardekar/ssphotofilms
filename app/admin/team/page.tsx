"use client";

import React, { useEffect, useState } from 'react';
import { getTeamApplications, updateTeamApplicationStatus } from '@/lib/db';
import { sendTeamApplicationReply } from './teamActions';
import { TeamApplication } from '@prisma/client';
import { 
  Users, 
  Mail, 
  Phone, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Briefcase,
  Search,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTeamApplications() {
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<TeamApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getTeamApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateTeamApplicationStatus(id, status);
      fetchApplications();
      if (selectedApp?.id === id) {
        setSelectedApp(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F2EFEB]">
      {/* Header */}
      <section className="bg-white py-12 px-8 border-b border-dark/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-cinzel font-bold text-dark tracking-tight uppercase">
              Team Applications
            </h1>
            <p className="text-secondary text-xs uppercase tracking-[0.3em] font-medium">
              Review and manage creative talent applications.
            </p>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH CANDIDATES..."
              className="pl-12 pr-6 py-4 bg-[#F8F6F2] border-none rounded-none text-xs font-bold tracking-widest outline-none ring-1 ring-dark/5 focus:ring-gold transition-all w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="flex-1 flex overflow-hidden">
        {/* Applications List */}
        <div className="w-full md:w-1/2 lg:w-1/3 border-r border-dark/5 overflow-y-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Users size={48} className="mx-auto text-gold/20" />
              <p className="text-secondary uppercase tracking-widest text-xs">No applications found.</p>
            </div>
          ) : (
            <div className="divide-y divide-dark/5">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`w-full text-left p-6 transition-all hover:bg-[#F8F6F2] group relative ${
                    selectedApp?.id === app.id ? 'bg-[#F8F6F2]' : ''
                  }`}
                >
                  {selectedApp?.id === app.id && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gold" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-cinzel font-bold text-dark text-sm uppercase tracking-wider group-hover:text-gold transition-colors">
                      {app.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded ${
                      app.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                      app.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-secondary text-xs truncate mb-3">{app.email}</p>
                  <div className="flex items-center text-[10px] text-secondary/60 font-bold uppercase tracking-widest">
                    <Clock size={12} className="mr-1.5" />
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detailed View */}
        <div className="hidden md:flex flex-1 bg-[#F2EFEB] overflow-y-auto p-12">
          <AnimatePresence mode="wait">
            {selectedApp ? (
              <motion.div
                key={selectedApp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-3xl mx-auto space-y-10"
              >
                {/* Profile Header */}
                <div className="bg-white p-10 shadow-sm ring-1 ring-dark/5 relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-dark text-gold font-cinzel text-3xl font-bold flex items-center justify-center">
                        {selectedApp.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-tight">{selectedApp.name}</h2>
                        <div className="flex items-center text-xs text-secondary font-bold tracking-widest uppercase">
                          <Briefcase size={14} className="mr-2 text-gold" />
                          <span>{selectedApp.experience} Years Experience</span>
                        </div>
                      </div>
                    </div>
                    {selectedApp.status === 'Pending' ? (
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleStatusUpdate(selectedApp.id, 'Rejected')}
                          className="p-3 text-secondary hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                        >
                          <XCircle size={24} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedApp.id, 'Approved')}
                          className="p-3 text-gold hover:text-emerald-500 hover:bg-emerald-50 transition-all rounded-full"
                        >
                          <CheckCircle2 size={24} />
                        </button>
                      </div>
                    ) : (
                      <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${
                        selectedApp.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {selectedApp.status}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-8 border-t border-dark/5 pt-8">
                    <div className="space-y-1">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em]">Email Address</p>
                      <p className="text-sm font-medium text-dark flex items-center">
                        <Mail size={14} className="mr-2 text-gold/60" />
                        {selectedApp.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em]">Phone Number</p>
                      <p className="text-sm font-medium text-dark flex items-center">
                        <Phone size={14} className="mr-2 text-gold/60" />
                        {selectedApp.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expertise & Links */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-white p-8 shadow-sm ring-1 ring-dark/5 space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-dark border-b border-dark/5 pb-4 flex items-center">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full mr-3" />
                        Specializations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.specialization.map(spec => (
                          <span key={spec} className="px-3 py-1 bg-dark/5 text-secondary text-[10px] font-bold uppercase tracking-widest">
                            {spec}
                          </span>
                        ))}
                      </div>
                   </div>

                   <div className="bg-white p-8 shadow-sm ring-1 ring-dark/5 space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-dark border-b border-dark/5 pb-4 flex items-center">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full mr-3" />
                        Portfolio Link
                      </h3>
                      <a 
                        href={selectedApp.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gold/5 border border-gold/20 text-gold hover:bg-gold hover:text-dark transition-all group"
                      >
                        <span className="text-xs font-bold uppercase tracking-widest truncate max-w-[200px]">View Creative Work</span>
                        <ExternalLink size={16} />
                      </a>
                   </div>
                </div>

                {/* Reply Section (Simulated Email) */}
                <div className="bg-dark p-10 shadow-2xl space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-widest">Applicant Correspondence</h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">SEND A DIRECT REPLY TO {selectedApp.email}</p>
                  </div>
                   <div className="space-y-4">
                     {replySent ? (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="bg-emerald-500/10 border border-emerald-500/20 p-6 text-center space-y-4"
                       >
                         <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                         <div className="space-y-1">
                           <p className="text-white text-xs font-bold uppercase tracking-widest">Message Dispatched</p>
                           <p className="text-white/40 text-[10px] uppercase tracking-widest">The candidate will receive your response via email.</p>
                         </div>
                         <button 
                           onClick={() => setReplySent(false)}
                           className="text-gold text-[9px] font-bold uppercase tracking-[0.2em] hover:underline"
                         >
                           Send another message
                         </button>
                       </motion.div>
                     ) : (
                       <>
                         <textarea 
                           rows={4}
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           placeholder="Write your email reply here (e.g. Schedule a meeting)..."
                           className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-gold outline-none transition-all resize-none font-medium placeholder:text-white/20"
                         />
                         <button 
                           onClick={async () => {
                             if (!replyText.trim() || !selectedApp) return;
                             setSending(true);
                             setError(null);
                             try {
                               const res = await sendTeamApplicationReply(selectedApp.id, replyText);
                               if (res.success) {
                                 setReplySent(true);
                                 setReplyText('');
                               } else {
                                 setError(res.error || "Failed to send email.");
                               }
                             } catch (err: any) {
                               setError(err.message || "Something went wrong.");
                             } finally {
                               setSending(false);
                             }
                           }}
                           disabled={sending}
                           className="w-full py-4 bg-gold text-dark font-bold uppercase tracking-[0.4em] text-xs hover:bg-white transition-colors flex items-center justify-center space-x-3 disabled:opacity-50"
                         >
                           {sending ? (
                             <div className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
                           ) : (
                             <>
                               <Mail size={16} />
                               <span>Dispatch Email</span>
                             </>
                           )}
                         </button>
                         {error && (
                           <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2"
                           >
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                              <span>Error: {error}</span>
                           </motion.div>
                         )}
                       </>
                     )}
                     <p className="text-[9px] text-white/30 text-center uppercase tracking-widest italic">
                       This will resolve as a direct SMTP outreach to the candidate.
                     </p>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <Users size={80} className="text-gold" />
                <div className="space-y-2">
                   <h3 className="text-xl font-cinzel font-bold text-dark uppercase tracking-widest">Candidate Portfolio Viewer</h3>
                   <p className="text-secondary text-xs uppercase tracking-widest">Select an application from the left pane to begin review</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
