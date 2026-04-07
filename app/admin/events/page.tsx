"use client";

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Trash2,
  Check,
  AlertCircle,
  X,
  FileImage,
  CloudUpload,
  Cpu,
  Link as LinkIcon,
  Search,
  Activity,
  ShieldCheck,
  Clock,
  Plus,
  Loader2,
  ChevronRight,
  LayoutGrid,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getEvents, addEvent, toggleEventPublish, resetEventAiProgress } from '@/lib/db';
import { Event as PrismaEvent } from '@prisma/client';

// Use a distinct name for the data type to avoid DOM naming conflicts
interface DbEvent extends PrismaEvent {
  aiStatus: string;
  isPublished: boolean;
  driveLink: string | null;
  currentProgress: number;
  totalPhotos: number;
  aiStage: string;
  lastPhoto: string | null;
  _count?: {
    photos: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    type: 'Wedding',
    driveLink: '',
    zipFile: null as File | null
  });

  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null; name: string | null }>({
    show: false,
    id: null,
    name: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 2000); // Faster refresh for real-time progress
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      // Ensure the correct properties are mapped even if Prisma client is lagging in IDE
      setEvents(data as any);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, publish: boolean) => {
    try {
      await toggleEventPublish(id, publish);
      fetchEvents();
    } catch (err) {
      alert("Error updating publication status.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!deleteModal.id) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/events/${deleteModal.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteModal({ show: false, id: null, name: null });
        fetchEvents();
      } else {
        alert("Failed to delete session.");
      }
    } catch (err) {
      alert("Error deleting session.");
    } finally {
      setIsDeleting(false);
    }
  };

  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, stage: '' });

  const handleStartProcessing = async () => {
    if (!newEvent.name || !newEvent.date) return;

    // Rigorous Date Check (Prevent past dates)
    const selectedDate = new Date(newEvent.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today for comparison

    if (selectedDate < today) {
      alert("Error: Sessions cannot be created for past dates.");
      return;
    }

    try {
      // Generate a human-readable album ID (Folder Name)
      const sanitizedName = newEvent.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const albumId = `${sanitizedName}_${newEvent.date}`;

      // 1. Create the event entry first to get an ID
      const event = await addEvent({
        name: newEvent.name,
        date: newEvent.date,
        type: newEvent.type,
        albumId: albumId, // Pass the human-readable folder name
        driveLink: newEvent.driveLink || null
      });

      setShowAddModal(false);
      fetchEvents();

      // 2. Trigger Processing (DIRECT TO AI ENGINE at Port 5001)
      const pythonForm = new FormData();
      pythonForm.append('album_id', event.id);

      let hasSource = false;
      if (newEvent.zipFile) {
        pythonForm.append('album_zip', newEvent.zipFile);
        hasSource = true;
      } else if (newEvent.driveLink) {
        pythonForm.append('drive_link', newEvent.driveLink);
        hasSource = true;
      }

      if (hasSource) {
        // Step A: Mark as Processing in local DB
        await fetch('/api/admin/ai-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ album_id: event.albumId, current: 0, total: 100, stage: 'Starting AI Scanning...' })
        });

        // Step B: Direct upload to Flask (Bypasses Next.js Proxy/Limits)
        const AI_ENGINE_URL = 'http://127.0.0.1:5001/api/owner/process_album';
        try {
          console.log(`Attempting direct upload to AI Engine: ${AI_ENGINE_URL}`);

          // Use the human-readable folder name as the album_id
          pythonForm.set('album_id', event.albumId || '');

          const uploadRes = await fetch(AI_ENGINE_URL, {
            method: 'POST',
            body: pythonForm,
            mode: 'cors'
          });

          if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            throw new Error(`AI Engine Error (${uploadRes.status}): ${errorText}`);
          }

          console.log("AI Engine Direct Upload Success");
        } catch (fError: any) {
          console.error("Direct AI Engine Upload Failed:", fError);
          // Help the user diagnose why it failed
          if (fError.message?.includes('Failed to fetch')) {
            console.warn("AI Engine is likely not running on http://127.0.0.1:5001. Please start the Python app.");
          }

          // Fallback to retry via standard route (Next.js Proxy) which has built-in timeouts
          console.log("Retrying via Next.js Proxy fallback...");
          const fallbackRes = await fetch('/api/admin/process-event', { method: 'POST', body: pythonForm });
          if (!fallbackRes.ok) {
            const fallbackError = await fallbackRes.text();
            console.error("Fallback upload also failed:", fallbackError);
            alert("Error: AI Engine is unreachable. Make sure the Python script is running on port 5001.");
          }
        }
      }

      setCreationStep(1);
      setNewEvent({ name: '', date: '', type: 'Wedding', driveLink: '', zipFile: null });

      // Force UI Refresh and state reset
      setTimeout(() => {
        router.refresh();
        fetchEvents();
      }, 500);

    } catch (err) {
      console.error(err);
      alert("Error initializing session");
    }
  };

  const handleRestartScan = async (event: any) => {
    try {
      // 1. Reset progress in DB
      await resetEventAiProgress(event.id);

      // 2. Refresh UI immediately to show 'Processing'
      fetchEvents();

      // 3. Trigger Flask AI Engine
      const pythonForm = new FormData();
      pythonForm.set('album_id', event.albumId || '');
      if (event.driveLink) {
        pythonForm.append('drive_link', event.driveLink);
      }

      const AI_ENGINE_URL = 'http://127.0.0.1:5001/api/owner/process_album';
      console.log(`Restarting scan for ${event.albumId}...`);

      const res = await fetch(AI_ENGINE_URL, {
        method: 'POST',
        body: pythonForm,
        mode: 'cors'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.message || "Unknown error";

        // If direct fails, try proxy
        const proxyRes = await fetch('/api/admin/process-event', {
          method: 'POST',
          body: pythonForm
        });

        if (!proxyRes.ok) {
          const proxyMsg = await proxyRes.text();
          throw new Error(errorMsg || proxyMsg);
        }
      }

      alert("AI Scanning restarted successfully!");
      fetchEvents();
    } catch (error: any) {
      console.error("Failed to restart scan:", error);
      alert(`AI Error: ${error.message || "Engine unreachable"}`);
    }
  };

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 min-h-screen pb-20 pt-[160px] px-8 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-cinzel font-bold text-dark tracking-tight uppercase">Photo Sessions</h1>
          <p className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Complete lifecycle: Creation, AI Scanning, & Publishing</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setCreationStep(1); }}
          className="bg-dark text-gold px-8 py-3.5 rounded-none font-bold uppercase tracking-[0.2em] text-[10px] flex items-center space-x-3 shadow-xl hover:bg-gold hover:text-dark transition-all duration-500"
        >
          <Plus size={16} />
          <span>New Session</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sessions', value: events.length, icon: Activity, color: 'text-blue-500' },
          { label: 'Ready to Publish', value: events.filter(e => e.aiStatus === 'Ready' && !e.isPublished).length, icon: AlertCircle, color: 'text-orange-400' },
          { label: 'Live on Portal', value: events.filter(e => e.isPublished).length, icon: ShieldCheck, color: 'text-gold' },
          { label: 'Processing', value: events.filter(e => e.aiStatus === 'Processing').length, icon: Clock, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 shadow-sm border border-dark/5 flex items-center space-x-4">
            <div className={`p-3 bg-dark/5 rounded-full ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold tracking-widest text-secondary opacity-50">{stat.label}</p>
              <p className="text-xl font-bold text-dark">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30 group-focus-within:text-gold transition-colors" size={18} />
          <input
            type="text"
            placeholder="SEARCH BY CLIENT OR EVENT TYPE..."
            className="w-full bg-white border border-dark/5 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase outline-none focus:ring-1 focus:ring-gold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredEvents.map((event) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-dark/5 hover:border-gold/30 transition-all group flex flex-col"
            >
              <div className="p-8 space-y-6 flex-1">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${event.aiStatus === 'Ready' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                    {event.aiStatus === 'Ready' ? 'AI Analyzed' : 'In Progress'}
                  </span>
                  <div className="flex gap-2">
                    {event.aiStatus !== 'Ready' && (
                      <button
                        onClick={() => handleRestartScan(event)}
                        title="Restart/Retry stuck scan"
                        className="text-dark/10 hover:text-gold transition-colors p-1"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                    <button onClick={() => setDeleteModal({ show: true, id: event.id, name: event.name })} className="text-dark/10 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF2D55] italic">{event.type}</p>
                  <h3 className="text-xl font-cinzel font-bold text-dark group-hover:text-gold transition-colors uppercase">{event.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-dark/5">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Capture Date</p>
                    <p className="text-xs font-bold text-dark">{event.date}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-dark/30">Total Photos</p>
                    <p className="text-xs font-bold text-dark">{event.totalPhotos || 0}</p>
                  </div>
                </div>

                {event.aiStatus === 'Processing' && (
                  <div className="pt-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-2">
                      <span className="text-gold animate-pulse">{event.aiStage || 'Initializing...'}</span>
                      <span>{Math.round((event.currentProgress / (event.totalPhotos || 1)) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-dark/5 w-full rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.currentProgress / (event.totalPhotos || 1)) * 100}%` }}
                        className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                      />
                    </div>
                    {event.lastPhoto && (
                      <p className="mt-2 text-[7px] text-secondary opacity-40 uppercase tracking-tighter truncate">
                        Currently: {event.lastPhoto}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 border-t border-dark/5">
                <button onClick={() => router.push(`/find-photos?eventId=${event.id}`)} className="py-4 text-[9px] font-black uppercase tracking-widest text-dark/40 hover:text-dark hover:bg-dark/5 transition-all">View Gallery</button>
                <button onClick={() => handleTogglePublish(event.id, !event.isPublished)} className={`py-4 text-[9px] font-black uppercase tracking-widest transition-all ${event.isPublished ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'bg-dark text-gold hover:bg-gold hover:text-dark'}`}>
                  {event.isPublished ? 'Take Down' : 'Unleash Live'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white max-w-md w-full p-12 shadow-2xl relative overflow-hidden"
            >
              {/* Gold Border Highlight */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gold" />

              <div className="space-y-8 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 size={32} />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-tight">Delete Session?</h2>
                  <p className="text-secondary text-xs uppercase font-bold tracking-widest opacity-60 leading-relaxed">
                    YOU ARE ABOUT TO REMOVE <span className="text-red-500">"{deleteModal.name}"</span>.
                    ALL PHOTOS AND AI DATA WILL BE PERMANENTLY ERASED FROM YOUR STORAGE.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeleteModal({ show: false, id: null, name: null })}
                    className="py-4 border border-dark/10 text-[10px] font-black uppercase tracking-widest text-secondary hover:bg-dark/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                    className="py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 shadow-xl"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <span>Confirm Delete</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal (Step 1 or 2) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark/95 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-xl shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-secondary/30 hover:text-dark transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-12 space-y-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-tight">
                  {creationStep === 1 ? 'New Session' : 'Data Source'}
                </h2>
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-secondary opacity-50">
                  Step 0{creationStep} of 02
                </p>
              </div>

              {creationStep === 1 ? (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-secondary opacity-40 block">Client / Album Name</label>
                    <input
                      type="text"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      className="w-full border-b border-dark/10 py-4 text-sm font-bold placeholder:text-stone-300 focus:border-gold outline-none transition-all"
                      placeholder="E.g. Jethva Wedding 2025"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-secondary opacity-40 block">Event Date</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        min={new Date().toLocaleDateString('en-CA')} // yyyy-mm-dd local
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className={`w-full border-b py-4 text-sm font-bold focus:border-gold outline-none transition-all ${newEvent.date && new Date(newEvent.date) < new Date(new Date().setHours(0, 0, 0, 0))
                            ? 'border-red-500 text-red-500'
                            : 'border-dark/10'
                          }`}
                      />
                      {newEvent.date && new Date(newEvent.date) < new Date(new Date().setHours(0, 0, 0, 0)) && (
                        <p className="text-[7px] font-bold text-red-500 uppercase tracking-widest mt-1">Error: Date cannot be in the past</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-secondary opacity-40 block">Select Event</label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        className="w-full border-b border-dark/10 py-4 text-sm font-bold focus:border-gold outline-none transition-all bg-transparent"
                      >
                        <option>Wedding</option>
                        <option>Cinematography</option>
                        <option>Candid Photography</option>
                        <option>Engagement</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => setCreationStep(2)}
                    disabled={
                      !newEvent.name ||
                      !newEvent.date ||
                      new Date(newEvent.date) < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    className="w-full bg-dark text-gold py-5 font-bold uppercase tracking-[0.4em] text-[10px] items-center justify-center flex space-x-4 shadow-xl hover:bg-gold hover:text-dark disabled:opacity-20 transition-all duration-500"
                  >
                    <span>Continue</span>
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="p-12 border border-dashed border-dark/10 hover:border-gold transition-all group flex flex-col items-center text-center cursor-pointer relative">
                    <CloudUpload size={40} className="text-secondary/20 group-hover:text-gold transition-colors mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 group-hover:text-dark transition-colors">Select Zip Archive</p>
                    <input
                      type="file"
                      accept=".zip,.rar"
                      onChange={(e) => setNewEvent({ ...newEvent, zipFile: e.target.files?.[0] || null })}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {newEvent.zipFile && (
                      <p className="mt-4 text-[10px] text-emerald-500 font-bold uppercase">{newEvent.zipFile.name}</p>
                    )}
                  </div>

                  <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest text-secondary opacity-20 italic">
                    <span className="bg-white px-4">or use cloud link</span>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary flex items-center space-x-2">
                      <LinkIcon size={12} />
                      <span>Google Drive Folder Link</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full bg-dark/5 border-b border-dark/10 py-4 px-2 text-[11px] font-bold outline-none focus:border-gold transition-all"
                      value={newEvent.driveLink}
                      onChange={(e) => setNewEvent({ ...newEvent, driveLink: e.target.value })}
                    />
                    <p className="text-[9px] text-orange-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                      <AlertCircle size={10} />
                      <span>IMPORTANT: Set folder to "Anyone with the link" for Scanning to work.</span>
                    </p>
                  </div>

                  <button
                    onClick={handleStartProcessing}
                    disabled={!newEvent.driveLink && !newEvent.zipFile}
                    className="w-full bg-dark text-gold py-5 font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-4 shadow-xl hover:bg-gold hover:text-dark disabled:opacity-20 transition-all duration-500"
                  >
                    <Cpu size={14} />
                    <span>Start AI Analysis</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
