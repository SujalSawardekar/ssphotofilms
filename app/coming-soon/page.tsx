'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Check, Send } from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa6';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setErrorMsg('PLEASE ENTER A VALID EMAIL ADDRESS.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean, focused tape phrases as requested: Coming Soon · SS Photo & Films · Official Website · Chiplun's · Creative
  const baseGoldItems = [
    "★ COMING SOON",
    "★ SS PHOTO & FILMS",
    "★ OFFICIAL WEBSITE",
    "★ CHIPLUN'S FINEST",
    "★ CREATIVE CINEMA",
  ];
  const goldItemsRepeated = Array(12).fill(baseGoldItems).flat();

  const baseDarkItems = [
    "⚡ COMING SOON",
    "⚡ SS PHOTO & FILMS",
    "⚡ OFFICIAL WEBSITE",
    "⚡ CHIPLUN'S FINEST",
    "⚡ CREATIVE STORYTELLING",
  ];
  const darkItemsRepeated = Array(12).fill(baseDarkItems).flat();

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700&display=swap');

        .font-cinzel {
          font-family: 'Cinzel', 'Times New Roman', serif;
        }

        /* Gold Shimmer Sweep */
        @keyframes goldSweep {
          0% { background-position: 130% 0; }
          55%, 100% { background-position: -130% 0; }
        }
        .shimmer-text {
          background: linear-gradient(100deg, #A8845A 35%, #F5F0E6 50%, #C9A66B 65%);
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: goldSweep 7s 2.5s ease-in-out infinite;
        }

        /* Slow, Gentle & Elegant Tape Marquees (85s & 95s) */
        @keyframes marqueeLeftSeamless {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRightSeamless {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-tape-left {
          display: flex;
          width: max-content;
          animation: marqueeLeftSeamless 85s linear infinite;
        }
        .animate-tape-right {
          display: flex;
          width: max-content;
          animation: marqueeRightSeamless 95s linear infinite;
        }
        .animate-tape-left:hover, .animate-tape-right:hover {
          animation-play-state: paused;
        }

        /* Hazard stripe repeating pattern */
        .hazard-pattern {
          background: repeating-linear-gradient(
            -45deg,
            #080808,
            #080808 10px,
            #C9A66B 10px,
            #C9A66B 20px
          );
        }
      `}</style>

      <main className="relative h-screen h-[100svh] w-full overflow-hidden bg-[#080808] text-[#F4F4F4] font-cinzel select-none flex flex-col justify-between p-0">

        {/* ========================================================================= */}
        {/* PURE CLEAN BACKGROUND (Exact requested color & soft subtle gradients)     */}
        {/* ========================================================================= */}

        {/* 1. Radial Bronze Center Highlight */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 46%, rgba(168,132,90,0.12), transparent 70%), #080808'
          }}
        />

        {/* 2. Soft Edge Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 46%, transparent 40%, rgba(0,0,0,0.8) 100%)'
          }}
        />

        {/* 3. Subtle Tactile Film Grain */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />

        {/* ========================================================================= */}
        {/* HEADER                                                                    */}
        {/* ========================================================================= */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative z-30 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-5 sm:py-7 w-full"
        >
          {/* Actual Given Logo Image (/assets/logo.png) */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-8 sm:h-10 w-36 sm:w-44 flex items-center">
              <img
                src="/assets/logo.png"
                alt="SS Photo & Films"
                className="h-full w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>

          {/* Right Header Navigation & Location */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-medium tracking-[0.28em] text-[#F4F4F4]/60 uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#A8845A]" />
              <span className="hidden sm:inline">Chiplun, Maharashtra</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://www.instagram.com/ss_photography_official13"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#C9A66B]/50 flex items-center justify-center text-[#F4F4F4]/60 hover:text-[#F5F0E6] hover:-translate-y-0.5 transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/917741083155?text=Hello%20SS%20Photo%20Films%2C%20inquiry%20from%20website"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#25D366]/50 flex items-center justify-center text-[#F4F4F4]/60 hover:text-[#25D366] hover:-translate-y-0.5 transition-all"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.facebook.com/ssphotographyofficial13/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#C9A66B]/50 flex items-center justify-center text-[#F4F4F4]/60 hover:text-[#F5F0E6] hover:-translate-y-0.5 transition-all"
                aria-label="Facebook"
              >
                <FaFacebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.youtube.com/@ss_photography_official13"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#C9A66B]/50 flex items-center justify-center text-[#F4F4F4]/60 hover:text-[#F5F0E6] hover:-translate-y-0.5 transition-all"
                aria-label="YouTube"
              >
                <FaYoutube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.header>

        {/* ========================================================================= */}
        {/* MAIN HERO CONTENT                                                         */}
        {/* ========================================================================= */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
          {/* Eyebrow Kick */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-[9px] sm:text-xs font-semibold tracking-[0.45em] text-[#A8845A] uppercase mb-4 sm:mb-6"
          >
            A New Chapter in Cinematic Storytelling
          </motion.p>

          {/* Big Typography: COMING SOON */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="relative flex flex-col items-center justify-center leading-none"
          >
            {/* "COMING" in Ivory */}
            <span className="block text-[clamp(48px,min(13vw,17vh),180px)] font-extrabold tracking-[0.05em] text-[#F5F0E6] drop-shadow-[0_0_50px_rgba(245,240,230,0.12)]">
              COMING
            </span>

            {/* "SOON." in Bronze / Champagne Shimmer */}
            <span className="block font-normal text-[clamp(26px,min(6.2vw,8vh),88px)] tracking-[0.55em] pl-[0.55em] mt-[-0.15em] self-end sm:self-center">
              <i className="not-italic shimmer-text">
                SOON.
              </i>
            </span>
          </motion.h1>

          {/* Subtitle Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm font-normal tracking-[0.34em] text-[#F4F4F4]/80 uppercase"
          >
            Something Extraordinary is Arriving.
          </motion.p>

          {/* Location Badge Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="mt-4 flex items-center gap-2 text-[8px] sm:text-[10px] font-medium tracking-[0.4em] text-[#A8845A] uppercase"
          >
            <MapPin className="w-3 h-3 text-[#A8845A]" />
            <span>Chiplun, Maharashtra</span>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* SLOW, FOCUSED BARRICADE TAPES                                             */}
        {/* ========================================================================= */}
        <div className="relative z-25 w-full pointer-events-none select-none overflow-hidden h-32 sm:h-40 flex flex-col justify-center my-auto">

          {/* Tape 1: Golden Caution Tape (Tilted -2.2deg) */}
          <div
            style={{
              width: '160vw',
              marginLeft: '-30vw',
              transform: 'rotate(-2.2deg)',
            }}
            className="bg-[#C9A66B] text-[#080808] py-2 sm:py-2.5 shadow-[0_12px_45px_rgba(0,0,0,0.98),0_0_25px_rgba(201,166,107,0.3)] border-y border-[#080808]/50 overflow-hidden flex items-center"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] hazard-pattern opacity-60" />

            {/* Slow Smooth Marquee (85s) */}
            <div className="animate-tape-left whitespace-nowrap">
              <div className="flex shrink-0 items-center">
                {goldItemsRepeated.map((item, idx) => (
                  <span
                    key={`gold-track1-${idx}`}
                    className="inline-flex items-center text-[10px] sm:text-xs font-black tracking-[0.25em] font-cinzel uppercase px-5 sm:px-8"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 items-center" aria-hidden="true">
                {goldItemsRepeated.map((item, idx) => (
                  <span
                    key={`gold-track2-${idx}`}
                    className="inline-flex items-center text-[10px] sm:text-xs font-black tracking-[0.25em] font-cinzel uppercase px-5 sm:px-8"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[3px] hazard-pattern opacity-60" />
          </div>

          {/* Tape 2: Deep Carbon Black Closed-Set Barricade Tape (Tilted +1.8deg) */}
          <div
            style={{
              width: '160vw',
              marginLeft: '-30vw',
              transform: 'rotate(1.8deg)',
            }}
            className="-mt-3.5 sm:-mt-4 bg-[#0E0D0B]/95 backdrop-blur-md text-[#F5F0E6] py-1.5 sm:py-2 shadow-[0_14px_45px_rgba(0,0,0,0.98)] border-y border-[#C9A66B]/50 overflow-hidden flex items-center"
          >
            {/* Slow Smooth Marquee (95s) */}
            <div className="animate-tape-right whitespace-nowrap">
              <div className="flex shrink-0 items-center">
                {darkItemsRepeated.map((item, idx) => (
                  <span
                    key={`dark-track1-${idx}`}
                    className="inline-flex items-center text-[9px] sm:text-[11px] font-bold tracking-[0.3em] font-cinzel uppercase px-5 sm:px-8 text-[#C9A66B]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 items-center" aria-hidden="true">
                {darkItemsRepeated.map((item, idx) => (
                  <span
                    key={`dark-track2-${idx}`}
                    className="inline-flex items-center text-[9px] sm:text-[11px] font-bold tracking-[0.3em] font-cinzel uppercase px-5 sm:px-8 text-[#C9A66B]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* NOTIFY ME SUBSCRIPTION FORM                                               */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="relative z-30 pb-6 sm:pb-8 px-6 text-center w-full max-w-lg mx-auto"
        >
          <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.42em] text-[#F4F4F4]/70 uppercase mb-3">
            Be the First to Know.
          </p>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex w-full border border-[#F5F0E6]/30 hover:border-[#C9A66B] focus-within:border-[#C9A66B] transition-colors duration-300 bg-black/50 backdrop-blur-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  required
                  aria-label="Email address"
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none px-4 py-3 sm:py-3.5 text-xs tracking-[0.14em] text-[#F4F4F4] placeholder-[#F4F4F4]/40 font-cinzel"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="border-l border-[#F5F0E6]/30 bg-transparent hover:bg-[#F5F0E6] text-[#F5F0E6] hover:text-[#080808] px-5 sm:px-7 text-[10px] sm:text-xs font-bold tracking-[0.28em] font-cinzel uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? '...' : 'NOTIFY ME'}</span>
                  {!isSubmitting && <Send className="w-3 h-3 hidden sm:inline" />}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-[#C9A66B]/50 bg-[#C9A66B]/10 backdrop-blur-md text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1 text-[#F5F0E6] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">
                  <Check className="w-4 h-4 text-[#C9A66B]" />
                  <span>YOU'RE ON THE VIP LIST.</span>
                </div>
                <p className="text-[10px] tracking-[0.2em] text-[#F4F4F4]/70 uppercase">
                  We will notify you the moment the studio launches.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {errorMsg && (
            <p className="mt-2 text-[10px] font-medium tracking-[0.15em] text-[#D9A38F] uppercase">
              {errorMsg}
            </p>
          )}
        </motion.div>

      </main>
    </>
  );
}
