"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Horizontal Arrow Icon for Join Us button
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const teamRoles = [
  {
    title: 'Photographer',
    desc: 'Shoot with us, create memories',
    icon: '/assets/icon-photographer.svg',
    href: '/join-team#photographer'
  },
  {
    title: 'Videographer',
    desc: 'Capture life in motion with us',
    icon: '/assets/icon-videographer.svg',
    href: '/join-team#videographer'
  },
  {
    title: 'Editor',
    desc: 'Join us to edit stories',
    icon: '/assets/icon-videoeditor.svg',
    href: '/join-team#editor'
  },
  {
    title: 'Content Creator',
    desc: 'Turn ideas into impact with us',
    icon: '/assets/icon-graphicdesigner.svg',
    href: '/join-team#content-creator'
  }
];

const JoinTeamTeaser = () => {
  return (
    <section className="bg-background py-24 px-6 md:px-12 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-dark tracking-wide uppercase">
            JOIN OUR TEAM
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamRoles.map((role, idx) => (
            <JoinCard key={idx} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
};

const JoinCard = ({ role }: { role: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      className="bg-white p-10 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-dark/5 rounded-[15px] transition-all duration-300 h-full w-full"
    >
      <div className="w-16 h-16 mb-8">
        <img src={role.icon} alt={role.title} className="w-full h-full object-contain" />
      </div>
      
      <h3 className="text-xl font-cinzel font-bold text-dark mb-3 tracking-wide">{role.title}</h3>
      <p className="text-dark/40 text-sm uppercase tracking-[0.2em] font-bold mb-10 leading-relaxed">
        {role.desc}
      </p>
      
      <a 
        href={role.href} 
        className="mt-auto flex items-center justify-between min-w-[180px] bg-[#B8B4B0] text-white pl-8 pr-2 py-4 rounded-xl text-xs uppercase font-black tracking-[0.4em] transition-all duration-500 hover:bg-dark group relative overflow-hidden"
      >
        <span className="relative z-10">Join Us</span>
        {/* Shimmer Effect */}
        <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
        
        {/* Animated Arrow Circle */}
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden relative">
          <div className="relative w-4 h-4 overflow-hidden">
             {/* Primary Arrow (Slides Right) */}
             <ArrowIcon 
               className="w-full h-full absolute transition-all duration-300 text-dark group-hover:translate-x-10" 
             />
             {/* Secondary Arrow (Slides In from Left) */}
             <ArrowIcon 
               className="w-full h-full absolute -translate-x-10 transition-all duration-300 text-dark group-hover:translate-x-0" 
             />
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default JoinTeamTeaser;
