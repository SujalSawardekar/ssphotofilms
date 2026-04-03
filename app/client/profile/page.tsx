"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/lib/authContext';
import { updateAvatar, updateProfile } from './profileActions';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Lock, 
  Save, 
  CircleCheck,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    city: 'Mumbai, Maharashtra',
    eventDate: '2025-12-15'
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 1. Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    setUploading(true);

    try {
      // 2. Convert to Base64 for a simple 'upload' to Prisma
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // 3. Call server action
        const res = await updateAvatar(user.id, base64String);
        
        if (res.success && res.user) {
          // 4. Update session
          updateUser({ image: base64String });
          setSuccess("Avatar updated successfully!");
          setTimeout(() => setSuccess(''), 3000);
        } else {
          alert(res.error || "Failed to update avatar.");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Photo upload error:", err);
      alert("An error occurred while uploading your photo.");
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      });

      if (res.success) {
        updateUser(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setError(res.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

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
        setSuccess("Password updated successfully!");
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-dark tracking-tight uppercase">
            Profile Settings
          </h1>
          <p className="text-secondary text-xs uppercase tracking-[0.3em] font-medium">
            Manage your personal information and preferences.
          </p>
        </div>
        <AnimatePresence>
          {isSaved && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="flex items-center space-x-2 text-emerald-500 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-4 py-2 border border-emerald-500/20 shadow-sm"
             >
                <CircleCheck size={16} />
                <span>Changes Saved Successfully</span>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Left Col: Avatar & Stats */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-10 shadow-xl border-t-8 border-gold ring-1 ring-gold/10 text-center space-y-8">
              <div className="relative inline-block group">
                 <div className={`w-32 h-32 rounded-full border-2 border-gold p-1 relative z-10 overflow-hidden shadow-2xl transition-opacity ${uploading ? 'opacity-50' : 'opacity-100'}`}>
                    <img src={user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                 </div>
                 <input 
                   type="file" 
                   ref={fileInputRef}
                   onChange={handlePhotoChange}
                   className="hidden" 
                   accept="image/*"
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   disabled={uploading}
                   className="absolute bottom-0 right-0 p-3 bg-dark text-gold rounded-full border-2 border-ivory z-20 hover:bg-gold hover:text-dark transition-all transform hover:scale-110 shadow-xl disabled:opacity-50"
                 >
                    <Camera size={16} />
                 </button>
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-cinzel font-bold text-dark uppercase">{formData.name}</h4>
                 <p className="text-xs text-secondary font-bold tracking-[0.4em] uppercase">Premium Client</p>
              </div>
           </div>

           <div className="bg-dark p-10 shadow-2xl space-y-8 text-center md:text-left">
              <div className="flex items-center space-x-3 text-gold">
                 <ShieldCheck size={20} />
                 <h4 className="text-sm font-bold uppercase tracking-widest text-white">Trust & Security</h4>
              </div>
              <p className="text-xs text-white/50 uppercase tracking-widest leading-loose">
                 Your data is protected with 128-bit encryption. All photos are stored in secure cloud galleries.
              </p>
              <button className="flex items-center space-x-3 text-xs font-bold text-gold uppercase tracking-[0.3em] border-b border-gold/30 pb-1 hover:border-gold transition-colors">
                 <span>Download My Data</span>
              </button>
           </div>
        </div>

        {/* Right Col: Form & Password */}
        <div className="lg:col-span-8 space-y-12">
            <div className="bg-white p-12 shadow-sm ring-1 ring-gold/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <UserIcon size={180} className="text-dark" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-dark border-b border-gold/10 pb-4 mb-10">Personal Information</h3>
                
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10 font-manrope">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-secondary flex items-center space-x-2">
                       <UserIcon size={12} className="text-gold" />
                       <span>Full Name</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-3 outline-none text-sm font-bold text-dark transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-secondary flex items-center space-x-2">
                       <Mail size={12} className="text-gold" />
                       <span>Email Address</span>
                    </label>
                    <input 
                      type="email" 
                      className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-3 outline-none text-sm font-bold text-dark transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-secondary flex items-center space-x-2">
                       <Phone size={12} className="text-gold" />
                       <span>Phone Number</span>
                    </label>
                    <input 
                      type="tel" 
                      className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-3 outline-none text-sm font-bold text-dark transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 pt-8">
                     <button 
                       type="submit"
                       className="flex items-center justify-center space-x-4 bg-dark text-gold font-bold uppercase tracking-[0.4em] text-xs py-5 px-12 shadow-xl hover:bg-gold hover:text-dark transition-all duration-500"
                     >
                        <Save size={18} />
                        <span>Save Changes</span>
                     </button>
                  </div>
                </form>
            </div>

            <div className="bg-white p-12 shadow-sm ring-1 ring-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                    <Lock size={180} className="text-dark" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-dark border-b border-gold/10 pb-4 mb-10">Security Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                   <div className="space-y-4">
                      <p className="text-secondary text-sm uppercase tracking-widest leading-loose">
                         Recommended to use a strong password with at least 8 characters, including symbols and numbers.
                      </p>
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="text-xs uppercase font-bold text-gold border border-gold/20 px-8 py-3 hover:bg-gold hover:text-dark transition-all"
                      >
                         Change Password
                      </button>
                   </div>
                </div>
            </div>
        </div>
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
              className="relative w-full max-w-md bg-white p-8 md:p-12 shadow-2xl border-t-8 border-gold overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Lock size={150} className="text-dark" />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                   <h3 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-tight">Security Update</h3>
                   <p className="text-[10px] text-secondary uppercase tracking-[0.3em] font-bold opacity-50 italic">Verify your credentials to continue</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 text-[10px] p-3 rounded font-bold uppercase tracking-widest border border-red-100">{error}</div>}
                {success && <div className="bg-emerald-50 text-emerald-500 text-[10px] p-3 rounded font-bold uppercase tracking-widest border border-emerald-100">{success}</div>}

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-secondary ml-1">Current Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-sm font-bold text-dark transition-all"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-secondary ml-1">New Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-sm font-bold text-dark transition-all"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-secondary ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-sm font-bold text-dark transition-all"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    />
                  </div>

                  <div className="flex flex-col space-y-4 pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-dark text-gold font-bold uppercase tracking-[0.4em] text-[10px] py-4 shadow-xl hover:bg-gold hover:text-dark transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Verify & Update'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="w-full text-secondary font-bold uppercase tracking-[0.3em] text-[8px] hover:text-dark transition-colors"
                    >
                      Nevermind, Cancel
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

export default ProfilePage;
