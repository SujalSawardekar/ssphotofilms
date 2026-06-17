"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '@/lib/CmsContext';
import { useAuth } from '@/lib/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  RotateCcw, 
  RotateCw, 
  Eye, 
  Edit3, 
  X, 
  UploadCloud, 
  Trash2, 
  Search, 
  HardDrive, 
  Image as ImageIcon,
  Check
} from 'lucide-react';

export const CmsEditor: React.FC = () => {
  const { user } = useAuth();
  const {
    editMode,
    setEditMode,
    isPreview,
    setIsPreview,
    undo,
    redo,
    canUndo,
    canRedo,
    publish,
    isSaving,
    hasUnsavedChanges,
    discardChanges,
    isMediaSelectorOpen,
    closeMediaSelector,
    selectMediaItem
  } = useCms();

  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [storageInfo, setStorageInfo] = useState({ usedBytes: 0, limitBytes: 10 * 1024 * 1024 * 1024 });
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Media Library items
  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.media || []);
        if (data.storage) {
          setStorageInfo(data.storage);
        }
      }
    } catch (e) {
      console.error("Failed to load media items:", e);
    }
  };

  useEffect(() => {
    if (isMediaSelectorOpen) {
      fetchMedia();
    }
  }, [isMediaSelectorOpen]);

  // Handle uploading file directly from selector drawer
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError('');

    try {
      // Clean name resolution probe
      let resolution = 'Unknown';
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = () => {
            resolution = `${img.naturalWidth}x${img.naturalHeight}`;
            resolve(null);
          };
          img.onerror = () => resolve(null);
        });
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('resolution', resolution);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      setMediaItems(prev => [data.item, ...prev]);
      // Update storage info locally
      setStorageInfo(prev => ({
        ...prev,
        usedBytes: prev.usedBytes + file.size
      }));
      // Automatically select the newly uploaded item
      selectMediaItem(data.item.url);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle media deletion from selection drawer
  const handleDeleteMedia = async (id: string, size: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent choosing when clicking delete
    if (!window.confirm("Are you sure you want to permanently delete this media file?")) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMediaItems(prev => prev.filter(item => item.id !== id));
        setStorageInfo(prev => ({
          ...prev,
          usedBytes: Math.max(0, prev.usedBytes - size)
        }));
      }
    } catch (err) {
      console.error("Delete media error:", err);
    }
  };

  // Filter items in grid
  const filteredMedia = mediaItems.filter(item => 
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercent = Math.min(100, (storageInfo.usedBytes / storageInfo.limitBytes) * 100);

  if (!user || user.role !== 'admin' || !editMode) return null;

  return (
    <>
      {/* Sticky Admin Floating Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-dark text-white h-16 border-b border-white/10 flex items-center justify-between px-6 shadow-2xl font-manrope">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <span className="font-cinzel text-gold font-bold tracking-widest text-sm">SS PHOTO</span>
            <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded font-black tracking-widest uppercase">EDITOR</span>
          </div>

          <div className="h-6 w-[1px] bg-white/10" />

          {/* Mode Selector */}
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
            <button
              onClick={() => setIsPreview(false)}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                !isPreview 
                  ? 'bg-gold text-dark' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Edit3 size={12} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                isPreview 
                  ? 'bg-gold text-dark' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Eye size={12} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Action controls (Undo, Redo, Discard, Publish) */}
        <div className="flex items-center space-x-4">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${
                canUndo ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'
              }`}
              title="Undo"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${
                canRedo ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'
              }`}
              title="Redo"
            >
              <RotateCw size={16} />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-white/10" />

          {/* Autosave badge */}
          {hasUnsavedChanges && (
            <span className="text-[9px] text-[#A17A5D] uppercase tracking-widest font-black hidden sm:inline animate-pulse">
              * Unsaved Changes
            </span>
          )}

          {/* Discard & Publish */}
          {hasUnsavedChanges && (
            <button
              onClick={discardChanges}
              className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors px-3 py-2"
            >
              Discard
            </button>
          )}

          <button
            onClick={() => publish('all')}
            disabled={isSaving}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-xl transition-all ${
              isSaving
                ? 'bg-gold/50 text-dark/70 cursor-wait'
                : hasUnsavedChanges
                ? 'bg-gold hover:bg-white text-dark hover:scale-105'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <Save size={14} />
            <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
          </button>

          <button
            onClick={() => setEditMode(false)}
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Exit Editor"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Adjust body padding when editor is visible */}
      <style jsx global>{`
        body {
          padding-top: 64px !important;
        }
      `}</style>

      {/* Slide-over Media Selector Modal Drawer */}
      <AnimatePresence>
        {isMediaSelectorOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end font-manrope">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMediaSelector}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Selector Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-dark/10 flex items-center justify-between bg-[#F6F4F0]">
                <div className="space-y-1">
                  <h3 className="font-cinzel text-xl font-bold text-dark uppercase tracking-tight">Select Media</h3>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Choose or upload photography asset</p>
                </div>
                <button
                  onClick={closeMediaSelector}
                  className="p-2 hover:bg-dark/5 rounded-full text-dark/40 hover:text-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Upload Drop Zone & Progress */}
              <div className="p-6 border-b border-dark/5 bg-white">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUpload}
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLoading}
                  className="w-full h-32 border-2 border-dashed border-dark/10 hover:border-gold rounded-2xl flex flex-col items-center justify-center space-y-2 bg-[#F9F9F9] hover:bg-gold/5 transition-all group"
                >
                  <UploadCloud size={32} className="text-dark/30 group-hover:text-gold transition-colors" />
                  <span className="text-xs font-bold text-dark uppercase tracking-widest">
                    {uploadLoading ? 'Uploading File...' : 'Upload Image or Video'}
                  </span>
                  <span className="text-[9px] text-secondary/40 font-bold uppercase">JPG, PNG, WEBP, MP4 (Max 10GB capacity)</span>
                </button>

                {uploadError && (
                  <p className="text-xs text-red-500 font-bold uppercase tracking-wider text-center mt-3">{uploadError}</p>
                )}
              </div>

              {/* Search & Storage Meter */}
              <div className="px-6 py-4 border-b border-dark/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="SEARCH FILE..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 pl-9 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                  />
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/30" />
                </div>

                {/* Storage usage meter */}
                <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0">
                  <HardDrive size={16} className="text-dark/40" />
                  <div className="text-[10px] space-y-1 flex-1 sm:flex-initial">
                    <div className="flex justify-between w-full font-bold uppercase text-dark/60">
                      <span>Capacity</span>
                      <span>{formatSize(storageInfo.usedBytes)} / 10 GB</span>
                    </div>
                    <div className="w-40 bg-dark/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gold h-full rounded-full transition-all duration-500" 
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#F6F4F0]/30 grid grid-cols-3 gap-4 content-start">
                {filteredMedia.map(item => {
                  const isVideo = item.mimeType?.startsWith('video/') || item.fileName.endsWith('.mp4');
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => selectMediaItem(item.url)}
                      className="group/item relative aspect-square bg-white border border-dark/5 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:border-gold hover:shadow-md transition-all flex items-center justify-center"
                    >
                      {isVideo ? (
                        <div className="relative w-full h-full bg-dark/95 flex flex-col items-center justify-center text-white p-2">
                          <ImageIcon size={24} className="text-gold" />
                          <span className="text-[8px] uppercase tracking-wider font-black text-center mt-2 truncate max-w-full">
                            {item.fileName}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.fileName}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                        />
                      )}

                      {/* Image hover details overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 flex flex-col items-center justify-center p-3 text-center transition-all duration-300">
                        <span className="text-[8px] text-white/50 uppercase tracking-wider truncate max-w-full font-bold">
                          {item.fileName}
                        </span>
                        <span className="text-[9px] text-gold font-bold mt-1">
                          {item.resolution || 'Unknown'}
                        </span>
                        <span className="text-[9px] text-white/80 mt-0.5">
                          {formatSize(item.size)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteMedia(item.id, item.size, e)}
                          className="mt-3 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                          title="Delete item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredMedia.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-dark/10 rounded-2xl">
                    <p className="text-dark/30 font-cinzel italic text-lg uppercase tracking-widest">No media files found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CmsEditor;
