"use client";

import React, { useState, useEffect } from 'react';
import { getEvents, updateEventAiStatus } from '@/lib/db';
import { Event } from '@prisma/client';
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
  FileArchive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const UploadPhotosPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get('id');

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(preselectedId || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  
  const [processingAi, setProcessingAi] = useState(false);
  const [driveLink, setDriveLink] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);

  useEffect(() => {
    getEvents().then(data => {
      setEvents(data);
      if (!selectedEventId && data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    });
  }, [selectedEventId]);

  const handleProcessAi = async () => {
    if (!selectedEventId) return;
    
    setProcessingAi(true);
    setUploadProgress(10);
    
    try {
      const formData = new FormData();
      formData.append('album_id', selectedEventId);
      if (zipFile) formData.append('album_zip', zipFile);
      if (driveLink) formData.append('drive_link', driveLink);

      // This will call our proxy API route (we need to create this next)
      const res = await fetch('/api/admin/process-event', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        await updateEventAiStatus(selectedEventId, true, selectedEventId);
        alert("AI Processing started successfully!");
        router.push('/admin/events');
      } else {
        const err = await res.json();
        alert(`AI Error: ${err.error || 'Failed to process'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while starting AI");
    } finally {
      setProcessingAi(false);
      setUploadProgress(0);
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-dark tracking-tight uppercase">
            AI Photo Processing
          </h1>
          <p className="text-secondary text-xs uppercase tracking-[0.3em] font-medium">
            Upload your session album and trigger the Face Recognition Engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* Settings & Event Selection */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 shadow-sm border-t-4 border-gold ring-1 ring-gold/10 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-dark border-b border-gold/10 pb-4">Target Session</h3>
              <div className="space-y-4">
                 <label className="text-xs uppercase font-bold tracking-widest text-secondary">Active Event</label>
                 <select 
                    className="w-full bg-dark/5 border-none py-4 px-4 text-sm font-bold tracking-widest appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-gold transition-all"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                 >
                    {events.map(evt => <option key={evt.id} value={evt.id}>{evt.name}</option>)}
                    {events.length === 0 && <option value="">No events available</option>}
                 </select>
                 
                 {selectedEvent && (
                    <div className="pt-6 space-y-4 border-t border-dark/5">
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                         <span className="text-secondary">Type</span>
                         <span className="text-dark">{selectedEvent.type}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                         <span className="text-secondary">AI Status</span>
                         <span className={(selectedEvent as any).isFaceProcessed ? 'text-emerald-500' : 'text-orange-500'}>
                            {(selectedEvent as any).isFaceProcessed ? 'PROCESSED' : 'PENDING'}
                         </span>
                      </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-dark p-8 shadow-2xl space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-white">AI Guidelines</h3>
              <ul className="space-y-4 text-[10px] text-white/50 uppercase tracking-widest leading-loose">
                 <li className="flex items-start space-x-3">
                    <Check size={14} className="text-gold shrink-0" />
                    <span>Upload as 1 single .ZIP file for maximum speed</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <Check size={14} className="text-gold shrink-0" />
                    <span>Google Drive links must be direct download ZIP links</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <Check size={14} className="text-gold shrink-0" />
                    <span>Ensure lighting is consistent in photos</span>
                 </li>
              </ul>
           </div>
        </div>

        {/* Upload & AI Zone */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-12 border-2 border-dashed border-gold/30 hover:border-gold transition-all duration-500 rounded-none text-center shadow-sm min-h-[400px] flex flex-col justify-center">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 {/* ZIP Option */}
                 <div className="space-y-6">
                    <FileArchive size={48} className="text-gold/40 mx-auto" />
                    <div className="space-y-2">
                       <h4 className="text-xs font-black uppercase tracking-widest text-dark">Option 1: Upload ZIP</h4>
                       <p className="text-[10px] text-secondary uppercase font-bold tracking-widest">Select the .zip file containing all event photos</p>
                    </div>
                    <input 
                       type="file" 
                       accept=".zip"
                       className="hidden" 
                       id="zip-upload"
                       onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                    />
                    <label 
                       htmlFor="zip-upload"
                       className="block w-full py-4 border border-dark/5 text-dark hover:bg-dark/5 cursor-pointer text-[10px] font-bold uppercase tracking-widest"
                    >
                       {zipFile ? zipFile.name : 'Choose ZIP File'}
                    </label>
                 </div>

                 {/* Drive Option */}
                 <div className="space-y-6 md:border-l md:border-dark/5 md:pl-12">
                    <LinkIcon size={48} className="text-gold/40 mx-auto" />
                    <div className="space-y-2">
                       <h4 className="text-xs font-black uppercase tracking-widest text-dark">Option 2: Drive Link</h4>
                       <p className="text-[10px] text-secondary uppercase font-bold tracking-widest">Paste the public sharing link to the album ZIP</p>
                    </div>
                    <input 
                       type="text"
                       placeholder="https://drive.google.com/..."
                       className="w-full bg-dark/5 border-none p-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-gold transition-all"
                       value={driveLink}
                       onChange={(e) => setDriveLink(e.target.value)}
                    />
                 </div>
              </div>

              <div className="mt-12 pt-12 border-t border-dark/5">
                 <button 
                   onClick={handleProcessAi}
                   disabled={processingAi || (!zipFile && !driveLink)}
                   className="px-12 py-5 bg-dark text-gold font-bold uppercase tracking-[0.4em] text-xs shadow-2xl hover:bg-gold hover:text-dark transition-all duration-500 disabled:opacity-30 flex items-center justify-center space-x-4 mx-auto"
                 >
                   {processingAi ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                        <span>RUNNING AI SCAN...</span>
                      </>
                   ) : (
                      <>
                        <Cpu size={18} />
                        <span>START FACE RECOGNITION SCAN</span>
                      </>
                   )}
                 </button>
                 <p className="mt-6 text-[9px] text-secondary font-black uppercase tracking-[0.3em] opacity-40">Scanning typically takes 2-5 minutes per thousand photos</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotosPage;
