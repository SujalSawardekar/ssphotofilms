"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Eye, EyeOff, User as UserIcon, Lock, ArrowLeft, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <main className="h-screen w-full bg-white" />;

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    // Mock API call to simulate sending reset link
    setTimeout(() => {
      setForgotSuccess("A password reset link has been sent to your email address.");
      setForgotLoading(false);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess('');
        setForgotEmail('');
      }, 3000);
    }, 1500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      console.error("[LOGIN_DEBUG] Login error:", err);
      setError(`An error occurred during login: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full relative flex flex-col items-center justify-center bg-white font-manrope text-dark py-4 px-4 overflow-hidden shadow-inner">
      
      {/* Background Circular Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-dark/5 blur-[120px]" />

      {/* Login Card - Translucent & Compact */}
      <div className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-3xl rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.12)] border border-white/60 p-8 md:p-12 flex flex-col items-center">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 p-3 bg-white/20 hover:bg-white/40 rounded-full border border-white/40 transition-all group"
          title="Go Back"
        >
          <ArrowLeft size={16} className="text-dark group-active:-translate-x-1 transition-transform" />
        </button>

        {/* Avatar Placeholder */}
        <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl bg-white/60 flex items-center justify-center -mt-20">
           <div className="text-dark/10"><UserIcon size={32} /></div>
        </div>

        <div className="text-center mb-8 w-full">
          <h2 className="text-3xl font-cinzel font-black text-dark tracking-tight uppercase">Sign In</h2>
          <div className="h-1 w-12 bg-dark/10 mx-auto mt-1 rounded-full" />
        </div>

        {error && (
          <div className="w-full bg-red-50/50 backdrop-blur-md text-red-500 text-[10px] p-3 rounded-xl text-center font-black uppercase tracking-widest border border-red-500/20 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-xl font-cinzel text-dark block ml-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="ABC@GMAIL.COM"
              className="w-full bg-white/50 border border-white/60 focus:border-dark/20 px-6 py-4 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-dark/10 rounded-xl backdrop-blur-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xl font-cinzel text-dark block">Password</label>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full bg-white/50 border border-white/60 focus:border-dark/20 px-6 py-4 text-sm font-bold shadow-sm outline-none transition-all placeholder:text-dark/10 rounded-xl backdrop-blur-md pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/20 hover:text-dark/40"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[10px] font-black text-dark/30 hover:text-dark uppercase tracking-widest transition-colors mb-2"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-dark hover:bg-gold hover:text-dark text-white font-cinzel font-black tracking-[0.3em] uppercase py-4 rounded-xl mt-4 transition-all shadow-xl disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 text-center text-[11px] text-secondary uppercase tracking-widest font-bold">
           New User? <Link href="/register" className="text-dark font-black hover:underline decoration-gold decoration-2">Register Now</Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white p-8 md:p-10 shadow-2xl border-t-8 border-gold overflow-hidden rounded-lg mx-auto"
            >
              <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-cinzel font-bold text-dark uppercase tracking-tight">Reset Password</h3>
                   <p className="text-[9px] text-secondary uppercase tracking-widest font-bold opacity-40">Enter your email to receive a reset link</p>
                </div>

                {forgotError && <div className="bg-red-50 text-red-500 text-[10px] p-2.5 rounded font-bold uppercase tracking-widest border border-red-100">{forgotError}</div>}
                {forgotSuccess && <div className="bg-emerald-50 text-emerald-500 text-[10px] p-2.5 rounded font-bold uppercase tracking-widest border border-emerald-100">{forgotSuccess}</div>}

                <form onSubmit={handleForgotPass} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-secondary ml-0.5 font-manrope">Email Address</label>
                    <div className="relative">
                       <input 
                         type="email" 
                         required
                         placeholder="ABC@GMAIL.COM"
                         className="w-full bg-[#F9F9F9] border border-dark/5 focus:border-gold py-2.5 px-4 pl-10 outline-none text-xs font-bold text-dark transition-all rounded font-manrope"
                         value={forgotEmail}
                         onChange={(e) => setForgotEmail(e.target.value)}
                       />
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/20" size={14} />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 pt-2">
                    <button 
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-dark text-gold font-bold uppercase tracking-widest text-[10px] py-3.5 shadow-xl hover:bg-gold hover:text-dark transition-all duration-300 disabled:opacity-50"
                    >
                      {forgotLoading ? 'Searching...' : 'Send Reset Link'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="text-secondary font-bold uppercase tracking-widest text-[8px] hover:text-dark transition-colors text-center"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
