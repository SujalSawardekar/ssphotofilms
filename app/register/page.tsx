"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { addUser } from '@/lib/db';
import { isTempEmail } from '@/lib/utils';
import { Eye, EyeOff, User as UserIcon, Camera, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    image: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (isTempEmail(formData.email)) {
      setError("Please use a permanent email address. Temporary emails are not allowed.");
      return;
    }

    setLoading(true);

    try {
      await addUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        image: formData.image,
        role: 'client'
      });

      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Account created, but automatic login failed.');
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full relative flex flex-col items-center justify-center bg-white font-manrope text-dark py-4 px-4 overflow-hidden shadow-inner">
      
      {/* Background Circular Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-dark/5 blur-[120px]" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white/40 backdrop-blur-3xl rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.1)] border border-white/60 p-6 md:p-10 flex flex-col items-center">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 md:top-8 md:left-8 p-3 bg-white/20 hover:bg-white/40 rounded-full border border-white/40 transition-all group"
          title="Go Back"
        >
          <ArrowLeft size={18} className="text-dark group-active:-translate-x-1 transition-transform" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-cinzel font-black text-dark tracking-tight uppercase">Create Your Account</h2>
          <p className="text-sm text-dark/60 mt-2">Join us to manage your bookings and view your gallery.</p>
          <div className="h-1 w-12 bg-dark/10 mx-auto mt-4 rounded-full" />
        </div>

        {/* Compact Avatar Section */}
        <div className="w-full flex items-center justify-center space-x-6 mb-8 px-4">
           <div className="relative w-16 h-16 rounded-full bg-white/60 shadow-xl flex items-center justify-center overflow-hidden shrink-0 border border-white/60 group">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-dark/10"><UserIcon size={32} /></div>
              )}
           </div>
           <div className="flex flex-col space-y-2">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="text-[9px] px-8 py-2 bg-dark text-white rounded-full font-black uppercase tracking-widest hover:bg-gold hover:text-dark transition-all flex items-center space-x-2"
              >
                <Camera size={12} />
                <span>Upload Profile Photo</span>
              </button>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {error && (
            <div className="bg-red-50/50 backdrop-blur-md text-red-500 text-[10px] p-2 rounded-xl text-center font-black uppercase tracking-widest border border-red-500/20">
              {error}
            </div>
          )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {/* Row 1: Full Name (Spans 2) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xl font-cinzel text-dark block ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="SHREYAS SAWARDEKAR"
                  className="w-full bg-white/50 border border-white/60 focus:border-dark/20 px-6 py-3 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-dark/10 rounded-xl backdrop-blur-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Row 2: Contact & Email (2 columns) */}
              <div className="space-y-1.5">
                <label className="text-xl font-cinzel text-dark block ml-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 00000 00000"
                  className="w-full bg-white/50 border border-white/60 focus:border-dark/20 px-6 py-3 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-dark/10 rounded-xl backdrop-blur-md"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xl font-cinzel text-dark block ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="abc@gmail.com"
                  className="w-full bg-white/50 border border-white/60 focus:border-dark/20 px-6 py-3 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-dark/10 rounded-xl backdrop-blur-md"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Row 3: Security (2 columns) */}
              <div className="space-y-1.5">
                <label className="text-xl font-cinzel text-dark block ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/50 border border-white/60 focus:border-dark/20 px-6 py-3 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-dark/10 rounded-xl backdrop-blur-md pr-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/20 hover:text-dark/40">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xl font-cinzel text-dark block ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/50 border border-white/60 focus:border-dark/20 px-6 py-3 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-dark/10 rounded-xl backdrop-blur-md pr-12"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/20 hover:text-dark/40">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
           </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-dark hover:bg-gold hover:text-dark text-white font-cinzel font-black tracking-[0.3em] uppercase py-4 rounded-xl mt-4 transition-all shadow-xl disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-[11px] text-secondary uppercase tracking-widest font-bold">
           Already have an account? <Link href="/login" className="text-dark font-black hover:underline decoration-gold decoration-2">Sign In</Link>
        </div>
      </div>
    </main>
  );
}
