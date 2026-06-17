"use client";

import React, { useState } from 'react';
import { useCms } from '@/lib/CmsContext';
import { Plus, Trash2, Edit2, Save, ArrowUp, ArrowDown, Clipboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicesManagerPage() {
  const { 
    services, 
    updatePackage, 
    addPackage, 
    deletePackage, 
    reorderPackages, 
    updateCategoryInfo,
    publish, 
    isSaving, 
    openMediaSelector 
  } = useCms();

  const [activeCatId, setActiveCatId] = useState(services[0]?.id || 'wedding');
  const [selectedPkgIdx, setSelectedPkgIdx] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New Package Form State
  const [newTitle, setNewTitle] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');
  const [newBothSidePrice, setNewBothSidePrice] = useState('');
  const [newReelPrice, setNewReelPrice] = useState('');
  const [newFeatures, setNewFeatures] = useState('');
  const [newImageSrc, setNewImageSrc] = useState('/assets/occasion-wedding.jpg');

  const activeCategory = services.find(c => c.id === activeCatId);

  const handleCreatePackage = () => {
    if (!newTitle || !newOriginalPrice || !newDiscountPrice) {
      alert("Please fill all required fields");
      return;
    }

    const newPkg = {
      title: newTitle,
      originalPrice: newOriginalPrice,
      discountPrice: newDiscountPrice,
      bothSidePrice: newBothSidePrice || null,
      reelPrice: newReelPrice || null,
      features: newFeatures.split('\n').filter(Boolean),
      imageSrc: newImageSrc,
      captionTitle: newTitle,
      captionSubtitle: ''
    };

    addPackage(activeCatId, newPkg);
    
    // Reset Form
    setNewTitle('');
    setNewOriginalPrice('');
    setNewDiscountPrice('');
    setNewBothSidePrice('');
    setNewReelPrice('');
    setNewFeatures('');
    setIsCreating(false);
  };

  const handlePublish = async () => {
    const success = await publish('services');
    if (success) {
      setNotification({ message: "Services pricing successfully updated!", type: 'success' });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  if (!activeCategory) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F4F0] p-10 font-manrope">
        Loading Services Config...
      </div>
    );
  }

  const activePackage = selectedPkgIdx !== null ? activeCategory.packages[selectedPkgIdx] : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4F0] p-6 md:p-10 font-manrope">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dark/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-cinzel font-bold text-dark tracking-wide uppercase">Services Manager</h1>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">Configure pricing packages and options</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedPkgIdx(null);
            }}
            className="bg-dark hover:bg-gold hover:text-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md"
          >
            <Plus size={16} />
            <span>Create Package</span>
          </button>
          
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="bg-gold hover:bg-white text-dark border border-gold px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shadow-md"
          >
            <Save size={16} />
            <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-nowrap overflow-x-auto space-x-4 border-b border-dark/5 pb-3 mb-8">
        {services.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCatId(cat.id);
              setSelectedPkgIdx(null);
              setIsCreating(false);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeCatId === cat.id
                ? 'bg-dark text-white shadow-sm'
                : 'bg-white border border-dark/10 text-secondary hover:text-dark'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Packages List & Cat description */}
        <div className="w-full lg:w-5/12 bg-white rounded-2xl border border-dark/10 p-6 shadow-sm space-y-6">
          
          {/* Category Description */}
          <div className="space-y-2 pb-4 border-b border-dark/5">
            <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Category Description</label>
            <textarea
              value={activeCategory.description || ''}
              onChange={(e) => updateCategoryInfo(activeCatId, { description: e.target.value })}
              className="w-full bg-[#F6F4F0] border border-dark/5 p-3 text-xs font-medium text-dark outline-none rounded-xl focus:border-gold resize-none h-20"
            />
          </div>

          <h3 className="font-cinzel text-lg font-bold text-dark uppercase tracking-tight">Packages</h3>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {(activeCategory.packages || []).map((pkg: any, idx: number) => {
              const isFirst = idx === 0;
              const isLast = idx === activeCategory.packages.length - 1;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedPkgIdx(idx);
                    setIsCreating(false);
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPkgIdx === idx
                      ? 'border-gold bg-gold/5 shadow-sm'
                      : 'border-dark/5 hover:bg-dark/5'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-dark truncate uppercase tracking-wider">{pkg.title}</h4>
                    <p className="text-xs text-secondary/70 font-semibold mt-1">₹{Number(pkg.discountPrice).toLocaleString('en-IN')} /-</p>
                  </div>

                  {/* Reordering indicators */}
                  <div className="flex items-center space-x-1 shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={isFirst}
                      onClick={() => reorderPackages(activeCatId, idx, idx - 1)}
                      className={`p-1.5 hover:text-gold text-dark/40 ${isFirst ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      disabled={isLast}
                      onClick={() => reorderPackages(activeCatId, idx, idx + 1)}
                      className={`p-1.5 hover:text-gold text-dark/40 ${isLast ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {activeCategory.packages?.length === 0 && (
              <p className="text-secondary/50 text-sm text-center py-8">No packages configured for this category.</p>
            )}
          </div>
        </div>

        {/* Right Side: details panel */}
        <div className="w-full lg:w-7/12">
          {isCreating ? (
            /* Creation Form */
            <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-dark uppercase tracking-tight">Create Pricing Package</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-full">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Package Name / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Platinum Package"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Original Price (Crossed out)</label>
                  <input
                    type="text"
                    placeholder="e.g. 54,999"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Offer Price (Discounted)</label>
                  <input
                    type="text"
                    placeholder="e.g. 44,999"
                    value={newDiscountPrice}
                    onChange={(e) => setNewDiscountPrice(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Both Side Cover Upgrade price (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 64,999"
                    value={newBothSidePrice}
                    onChange={(e) => setNewBothSidePrice(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Reel add-on price (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,500"
                    value={newReelPrice}
                    onChange={(e) => setNewReelPrice(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest">Package Features (One per line)</label>
                <textarea
                  placeholder="e.g.&#10;1 Candid Photographer&#10;1 Traditional Videographer&#10;All Raw Photos provided"
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  className="w-full bg-[#F6F4F0] border border-dark/5 p-4 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold h-28 leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest block">Package Cover Image</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative border bg-dark/5">
                    <img src={newImageSrc} alt="Package" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaSelector((url) => setNewImageSrc(url))}
                    className="bg-[#F6F4F0] hover:bg-dark hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    Choose Cover
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleCreatePackage}
                  className="bg-dark text-white hover:bg-gold hover:text-dark px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md"
                >
                  Create Package
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-secondary hover:text-dark text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : activePackage ? (
            /* Editing Detail Panel */
            <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-dark uppercase tracking-tight">{activePackage.title}</h3>
                  <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">Editing Package Details</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete package "${activePackage.title}"?`)) {
                      deletePackage(activeCatId, selectedPkgIdx!);
                      setSelectedPkgIdx(null);
                    }
                  }}
                  className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete Package"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-dark/5 pt-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Title</label>
                  <input
                    type="text"
                    value={activePackage.title}
                    onChange={(e) => updatePackage(activeCatId, selectedPkgIdx!, { title: e.target.value })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Cover Image</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openMediaSelector((url) => updatePackage(activeCatId, selectedPkgIdx!, { imageSrc: url }))}
                      className="bg-[#F6F4F0] hover:bg-dark hover:text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Original Price</label>
                  <input
                    type="text"
                    value={activePackage.originalPrice}
                    onChange={(e) => updatePackage(activeCatId, selectedPkgIdx!, { originalPrice: e.target.value })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Offer Price</label>
                  <input
                    type="text"
                    value={activePackage.discountPrice}
                    onChange={(e) => updatePackage(activeCatId, selectedPkgIdx!, { discountPrice: e.target.value })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Both Side Cover price Upgrade</label>
                  <input
                    type="text"
                    value={activePackage.bothSidePrice || ''}
                    onChange={(e) => updatePackage(activeCatId, selectedPkgIdx!, { bothSidePrice: e.target.value || null })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                    placeholder="None"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Reel add-on price</label>
                  <input
                    type="text"
                    value={activePackage.reelPrice || ''}
                    onChange={(e) => updatePackage(activeCatId, selectedPkgIdx!, { reelPrice: e.target.value || null })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                    placeholder="None"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest">Package Features (One per line)</label>
                <textarea
                  value={activePackage.features.join('\n')}
                  onChange={(e) => updatePackage(activeCatId, selectedPkgIdx!, { features: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full bg-[#F6F4F0] border border-dark/5 p-4 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold h-36 leading-relaxed"
                />
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dark/10 p-16 shadow-sm flex flex-col items-center justify-center text-center">
              <Clipboard size={48} className="text-dark/20 mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-dark uppercase tracking-tight">No Package Selected</h3>
              <p className="text-secondary text-sm max-w-sm mt-2 leading-relaxed">
                Choose a pricing package from the list on the left to configure parameters, or create a brand new one.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Toast Notification */}
      <div className="fixed bottom-10 right-10 z-[200] pointer-events-none">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-2xl pointer-events-auto border ${
                notification.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <AlertCircle size={16} className="text-rose-500" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
