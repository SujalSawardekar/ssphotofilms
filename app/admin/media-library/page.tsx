"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Trash2, 
  UploadCloud, 
  HardDrive, 
  Image as ImageIcon, 
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [storageInfo, setStorageInfo] = useState({ usedBytes: 0, limitBytes: 10 * 1024 * 1024 * 1024 });
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.error("Failed to load media:", e);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError('');

    try {
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
      setStorageInfo(prev => ({
        ...prev,
        usedBytes: prev.usedBytes + file.size
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, size: number) => {
    if (!window.confirm("Delete this media asset permanently?")) return;

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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaItems.filter(item => 
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const usagePercent = Math.min(100, (storageInfo.usedBytes / storageInfo.limitBytes) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4F0] p-6 md:p-10 font-manrope">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dark/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-cinzel font-bold text-dark tracking-wide uppercase">Media Library</h1>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">Central panel to host and monitor storage</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/jpeg,image/png,image/webp,video/mp4"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadLoading}
            className="bg-dark hover:bg-gold hover:text-dark text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md"
          >
            <UploadCloud size={16} />
            <span>{uploadLoading ? 'Uploading...' : 'Upload Media'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Upload Drop / Storage bar / Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Storage usage meter */}
        <div className="bg-white rounded-2xl border border-dark/10 p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-gold/10 text-[#B36F4E] rounded-xl">
            <HardDrive size={24} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between font-bold uppercase text-xs text-dark/70">
              <span>Disk Storage Used</span>
              <span>{formatSize(storageInfo.usedBytes)} / 10 GB</span>
            </div>
            <div className="w-full bg-dark/5 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gold h-full rounded-full transition-all duration-500" 
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-secondary font-semibold uppercase pt-1">
              Cap limit to prevent server overload
            </p>
          </div>
        </div>

        {/* Upload error banner / Search */}
        <div className="bg-white rounded-2xl border border-dark/10 p-6 shadow-sm flex flex-col justify-center">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH ASSET BY FILENAME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 pl-10 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/30" />
          </div>
        </div>

        {/* Allowed Formats */}
        <div className="bg-white rounded-2xl border border-dark/10 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-dark/70">Supported File Formats</h4>
            <p className="text-[10px] text-secondary font-semibold uppercase leading-relaxed">
              Allowed: JPG, PNG, WEBP, MP4.<br />Video uploads are capped inside limits.
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {['JPG', 'PNG', 'WEBP', 'MP4'].map(ext => (
              <span key={ext} className="text-[8px] bg-dark/5 text-dark font-black px-1.5 py-0.5 rounded tracking-widest">{ext}</span>
            ))}
          </div>
        </div>

      </div>

      {uploadError && (
        <div className="bg-red-50/50 backdrop-blur-md text-red-500 text-[10px] p-3 rounded-xl text-center font-black uppercase tracking-widest border border-red-500/20 mb-8 max-w-md">
          {uploadError}
        </div>
      )}

      {/* Media Gallery items Grid */}
      <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm flex-1">
        <h3 className="font-cinzel text-lg font-bold text-dark uppercase tracking-tight mb-6">Asset Repository</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {filteredMedia.map(item => {
            const isVideo = item.mimeType?.startsWith('video/') || item.fileName.endsWith('.mp4');
            
            return (
              <div 
                key={item.id}
                className="group/card relative aspect-square bg-[#F6F4F0]/50 border border-dark/5 rounded-xl overflow-hidden shadow-sm flex items-center justify-center cursor-default hover:border-gold hover:shadow-md transition-all"
              >
                {isVideo ? (
                  <div className="relative w-full h-full bg-dark flex flex-col items-center justify-center text-white p-3">
                    <ImageIcon size={32} className="text-gold" />
                    <span className="text-[9px] uppercase tracking-wider font-black text-center mt-3 truncate max-w-full">
                      {item.fileName}
                    </span>
                  </div>
                ) : (
                  <img src={item.url} alt={item.fileName} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                )}

                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/card:opacity-100 flex flex-col items-center justify-center p-3 text-center transition-all duration-300 z-10">
                  <p className="text-[8px] text-white/50 uppercase tracking-widest truncate max-w-full font-bold">{item.fileName}</p>
                  <p className="text-[9px] text-gold font-bold mt-1.5">{item.resolution || 'Unknown'}</p>
                  <p className="text-[9px] text-white/80 mt-0.5">{formatSize(item.size)}</p>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + item.url);
                        alert("Asset URL copied to clipboard!");
                      }}
                      className="bg-white text-dark hover:bg-gold px-2 py-1 text-[8px] font-black uppercase rounded tracking-widest transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.size)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredMedia.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-dark/10 rounded-2xl">
              <ImageIcon size={32} className="text-dark/20 mx-auto mb-2" />
              <p className="text-secondary/50 text-sm font-semibold">No media assets found matching the query.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
