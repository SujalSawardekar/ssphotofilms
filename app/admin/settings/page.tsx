"use client";

import React, { useState } from 'react';
import { useCms } from '@/lib/CmsContext';
import { Save, Shield, Compass, Phone, Mail, MapPin, Globe, Award } from 'lucide-react';

export default function SettingsPage() {
  const { contents, updateContentKey, publish, isSaving } = useCms();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await publish('content');
    if (success) {
      alert("Settings updated successfully!");
    }
  };

  const getVal = (key: string, def: string) => {
    return contents[key] !== undefined ? contents[key] : def;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4F0] p-6 md:p-10 font-manrope">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-dark/10 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-cinzel font-bold text-dark tracking-wide uppercase">Settings</h1>
          <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">Configure global details and SEO metrics</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Contact Coordinates */}
        <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-dark/5">
            <Phone size={18} className="text-gold" />
            <h3 className="font-cinzel text-lg font-bold text-dark uppercase tracking-tight">Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Phone Number</label>
              <input
                type="text"
                value={getVal('contact.phone', '+91 98765 43210')}
                onChange={(e) => updateContentKey('contact.phone', e.target.value)}
                className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest">WhatsApp Number</label>
              <input
                type="text"
                value={getVal('contact.whatsapp', '+91 98765 43210')}
                onChange={(e) => updateContentKey('contact.whatsapp', e.target.value)}
                className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
              />
            </div>

            <div className="space-y-1 col-span-full">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={getVal('contact.email', 'info@ssphotofilms.com')}
                onChange={(e) => updateContentKey('contact.email', e.target.value)}
                className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
              />
            </div>

            <div className="space-y-1 col-span-full">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Studio Address</label>
              <textarea
                value={getVal('contact.address', 'SS Studio, Mumbai, Maharashtra')}
                onChange={(e) => updateContentKey('contact.address', e.target.value)}
                className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold h-20 resize-none"
              />
            </div>

            <div className="space-y-1 col-span-full">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Google Map Location Link</label>
              <input
                type="text"
                value={getVal('contact.map', '')}
                onChange={(e) => updateContentKey('contact.map', e.target.value)}
                className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                placeholder="Google maps link URL"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata Config */}
        <div className="space-y-8">
          
          <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-2 border-b border-dark/5">
              <Compass size={18} className="text-gold" />
              <h3 className="font-cinzel text-lg font-bold text-dark uppercase tracking-tight">SEO Parameters</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Browser Title Tag</label>
                <input
                  type="text"
                  value={getVal('seo.title', 'SS Photo & Films | Capturing Timeless Stories')}
                  onChange={(e) => updateContentKey('seo.title', e.target.value)}
                  className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Meta Description Tag</label>
                <textarea
                  value={getVal('seo.description', 'SS Photo & Films is a premium photography studio...')}
                  onChange={(e) => updateContentKey('seo.description', e.target.value)}
                  className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold h-20 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Keywords (Comma separated)</label>
                <textarea
                  value={getVal('seo.keywords', 'photography, wedding, films')}
                  onChange={(e) => updateContentKey('seo.keywords', e.target.value)}
                  className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold h-20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-white rounded-2xl border border-dark/10 p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-2 border-b border-dark/5">
              <Globe size={18} className="text-gold" />
              <h3 className="font-cinzel text-lg font-bold text-dark uppercase tracking-tight">Social Profiles</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Instagram URL</label>
                <input
                  type="text"
                  value={getVal('contact.social.instagram', 'https://instagram.com/ssphotofilms')}
                  onChange={(e) => updateContentKey('contact.social.instagram', e.target.value)}
                  className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">YouTube URL</label>
                <input
                  type="text"
                  value={getVal('contact.social.youtube', 'https://youtube.com/ssphotofilms')}
                  onChange={(e) => updateContentKey('contact.social.youtube', e.target.value)}
                  className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                />
              </div>

              <div className="space-y-1 col-span-full">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Facebook URL</label>
                <input
                  type="text"
                  value={getVal('contact.social.facebook', 'https://facebook.com/ssphotofilms')}
                  onChange={(e) => updateContentKey('contact.social.facebook', e.target.value)}
                  className="w-full bg-[#F6F4F0] border border-dark/5 px-4 py-2.5 text-xs font-bold text-dark outline-none rounded-xl focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gold hover:bg-dark hover:text-white border border-gold text-dark px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 shadow-xl"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
