"use client";

import React, { useState } from 'react';
import { useCms } from '@/lib/CmsContext';
import { Plus, Trash2, Edit2, Image as ImageIcon, Save, ArrowLeft, Calendar, FileText, User } from 'lucide-react';
import Link from 'next/link';

export default function GalleryManagerPage() {
  const { gallery, updateGalleryStory, addGalleryStory, deleteGalleryStory, publish, isSaving, openMediaSelector } = useCms();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('ALL');

  // New Story Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('WEDDINGS');
  const [newDate, setNewDate] = useState('');
  const [newNames, setNewNames] = useState('');
  const [newMainImage, setNewMainImage] = useState('/assets/occasion-wedding.jpg');

  const categories = [
    "WEDDINGS",
    "HALDI",
    "PRE-WEDDING",
    "MATERNITY",
    "BABY & KIDS",
    "ENGAGEMENT",
    "PORTRAIT"
  ];

  const handleCreateStory = () => {
    if (!newTitle || !newNames || !newDate) {
      alert("Please fill all required fields");
      return;
    }
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newStory = {
      id: `story_${Date.now()}`,
      slug,
      title: newTitle,
      category: newCategory,
      date: newDate,
      names: newNames,
      mainImage: newMainImage,
      images: [newMainImage]
    };
    addGalleryStory(newStory);
    
    // Reset form
    setNewTitle('');
    setNewNames('');
    setNewDate('');
    setIsCreating(false);
    setSelectedStoryId(newStory.id);
    
    // Switch filter tab to show the new story's category if it is not already 'ALL'
    if (activeCategoryTab !== 'ALL') {
      setActiveCategoryTab(newCategory);
    }
  };

  const handlePublish = async () => {
    const success = await publish('gallery');
    if (success) {
      alert("Gallery changes published successfully!");
    }
  };

  const activeStory = gallery.find(s => s.id === selectedStoryId);
  const filteredStories = activeCategoryTab === 'ALL'
    ? gallery
    : gallery.filter(s => s.category === activeCategoryTab);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4F0] p-6 md:p-10 font-manrope w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dark/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-cinzel font-bold text-dark tracking-wide uppercase">Gallery CMS</h1>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">Manage photo sessions and categories</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-dark hover:bg-gold hover:text-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md"
          >
            <Plus size={16} />
            <span>Create Session</span>
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

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        
        {/* Left Grid: List of Stories */}
        <div className="w-full lg:w-5/12 bg-white rounded-2xl border border-dark/10 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h3 className="font-cinzel text-lg font-bold text-dark uppercase tracking-tight">Photo Sessions</h3>
            
            {/* Horizontal Scrollable Event Category Filter Tabs */}
            <div className="flex overflow-x-auto gap-1.5 pb-2 border-b border-dark/5 scrollbar-hide">
              <button
                type="button"
                onClick={() => setActiveCategoryTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                  activeCategoryTab === 'ALL'
                    ? 'bg-dark text-white shadow-sm'
                    : 'bg-[#F6F4F0] text-dark/60 hover:text-dark hover:bg-dark/5'
                }`}
              >
                All ({gallery.length})
              </button>
              {categories.map(cat => {
                const count = gallery.filter(s => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategoryTab(cat);
                      setNewCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                      activeCategoryTab === cat
                        ? 'bg-dark text-white shadow-sm'
                        : 'bg-[#F6F4F0] text-dark/60 hover:text-dark hover:bg-dark/5'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
            {filteredStories.map(story => (
              <div
                key={story.id}
                onClick={() => {
                  setSelectedStoryId(story.id);
                  setIsCreating(false);
                }}
                className={`flex items-center space-x-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedStoryId === story.id
                    ? 'border-gold bg-gold/5 shadow-sm'
                    : 'border-dark/5 hover:bg-dark/5'
                }`}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0 bg-dark/5">
                  <img src={story.mainImage} alt={story.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-dark truncate uppercase tracking-wider">{story.names}</h4>
                  <p className="text-xs text-secondary font-medium truncate mt-0.5">{story.title}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[9px] bg-gold/20 text-[#B36F4E] px-2 py-0.5 rounded font-black tracking-widest uppercase">{story.category}</span>
                    <span className="text-[10px] text-secondary/60 font-semibold">{story.images?.length || 0} Photos</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredStories.length === 0 && (
              <p className="text-secondary/50 text-xs font-bold uppercase tracking-wider text-center py-12">
                {activeCategoryTab === 'ALL'
                  ? "No photo sessions found."
                  : `No sessions in ${activeCategoryTab} event.`}
              </p>
            )}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="w-full lg:w-7/12">
          {isCreating ? (
            /* Creation Form */
            <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-dark uppercase tracking-tight">New Photo Session</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Client / Event Names</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Rahul & Sneha"
                      value={newNames}
                      onChange={(e) => setNewNames(e.target.value)}
                      className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 pl-10 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                    />
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/30" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Session Tagline / Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Vows under the Stars"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 pl-10 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                    />
                    <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/30" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Session Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. JANUARY 10, 2026"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-3 pl-10 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold transition-all"
                    />
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/30" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest">Main Cover Photo</label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0 bg-dark/5 border">
                    <img src={newMainImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => openMediaSelector((url) => setNewMainImage(url))}
                    className="bg-[#F6F4F0] hover:bg-dark hover:text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    Choose from Library
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleCreateStory}
                  className="bg-dark text-white hover:bg-gold hover:text-dark px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md"
                >
                  Create Session
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-secondary hover:text-dark text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : activeStory ? (
            /* Editing Detail View */
            <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm space-y-8">
              
              {/* Story Header Summary */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-bold text-dark uppercase tracking-tight">{activeStory.names}</h3>
                  <p className="text-xs text-[#B36F4E] font-black uppercase tracking-widest mt-1">Slug: {activeStory.slug}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this entire photo session?")) {
                      deleteGalleryStory(activeStory.id);
                      setSelectedStoryId(null);
                    }
                  }}
                  className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete Session"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Editable Meta details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-dark/5 pt-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Client Names</label>
                  <input
                    type="text"
                    value={activeStory.names}
                    onChange={(e) => updateGalleryStory(activeStory.id, { names: e.target.value })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Tagline</label>
                  <input
                    type="text"
                    value={activeStory.title}
                    onChange={(e) => updateGalleryStory(activeStory.id, { title: e.target.value })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Category</label>
                  <select
                    value={activeStory.category}
                    onChange={(e) => updateGalleryStory(activeStory.id, { category: e.target.value })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Date</label>
                  <input
                    type="text"
                    value={activeStory.date}
                    onChange={(e) => updateGalleryStory(activeStory.id, { date: e.target.value })}
                    className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                  />
                </div>
              </div>

              {/* Cover Image Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest block">Main cover Image</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative border bg-dark/5">
                    <img src={activeStory.mainImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => openMediaSelector((url) => updateGalleryStory(activeStory.id, { mainImage: url }))}
                    className="bg-[#F6F4F0] hover:bg-dark hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    Choose Cover Photo
                  </button>
                </div>
              </div>

              {/* Images Grid */}
              <div className="space-y-4 border-t border-dark/5 pt-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-secondary uppercase tracking-widest">Images list ({activeStory.images?.length || 0})</label>
                  <button
                    onClick={() => {
                      openMediaSelector((url) => {
                        const updatedImages = [...(activeStory.images || []), url];
                        updateGalleryStory(activeStory.id, { images: updatedImages });
                      });
                    }}
                    className="bg-dark hover:bg-gold hover:text-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl flex items-center gap-1.5 transition-all shadow"
                  >
                    <Plus size={14} />
                    <span>Add Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 max-h-[30vh] overflow-y-auto pr-2">
                  {(activeStory.images || []).map((img: string, idx: number) => (
                    <div key={idx} className="group/photo relative aspect-square bg-dark/5 rounded-xl overflow-hidden border">
                      <img src={img} alt="Story image" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-all duration-300">
                        <button
                          onClick={() => {
                            if (window.confirm("Remove this image from session?")) {
                              const updatedImages = activeStory.images.filter((_: string, i: number) => i !== idx);
                              updateGalleryStory(activeStory.id, { images: updatedImages });
                            }
                          }}
                          className="bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                          title="Remove Image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dark/10 p-16 shadow-sm flex flex-col items-center justify-center text-center">
              <ImageIcon size={48} className="text-dark/20 mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-dark uppercase tracking-tight">No Session Selected</h3>
              <p className="text-secondary text-sm max-w-sm mt-2 leading-relaxed">
                Choose a session from the list on the left to edit, or create a brand new one to add details.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
