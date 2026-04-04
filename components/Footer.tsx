"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-dark py-20 px-6 md:px-12 w-full border-t border-dark/5 snap-start">
      <div className="max-w-7xl mx-auto px-6 md:px-4 lg:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 lg:gap-16 mb-20">
          
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img src="/assets/logo.png" alt="S S PHOTO & FILMS" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-dark/40 font-bold leading-loose">
              <span className="block whitespace-nowrap">Capturing Love Stories,</span>
              <span className="block whitespace-nowrap">Preserving Soulful Memories.</span>
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-dark">Navigations</h4>
            <ul className="space-y-4 text-xs uppercase tracking-[0.2em] font-bold text-dark/60">
              <li><Link href="/" className="hover:text-dark transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-dark transition-colors">Gallery</Link></li>
              <li><Link href="/about" className="hover:text-dark transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-dark transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-dark transition-colors">Get In Touch</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-dark">Categories</h4>
            <ul className="space-y-4 text-xs uppercase tracking-[0.2em] font-bold text-dark/60">
              <li><Link href="/gallery?category=wedding" className="hover:text-dark transition-colors">Wedding</Link></li>
              <li><Link href="/gallery?category=maternity" className="hover:text-dark transition-colors">Maternity</Link></li>
              <li><Link href="/gallery?category=kids" className="hover:text-dark transition-colors">Baby & Kids</Link></li>
              <li><Link href="/gallery?category=engagement" className="hover:text-dark transition-colors">Engagement</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-dark">Contact</h4>
            <div className="space-y-4 text-xs uppercase tracking-[0.2em] font-bold text-dark/60">
              <p>+91 7741083155</p>
              <p className="lowercase">ssphotographyofficial08@gmail.com</p>
              <div className="pt-4 flex space-x-6">
                <a href="#" className="hover:text-dark transition-colors">Instagram</a>
                <a href="#" className="hover:text-dark transition-colors">YouTube</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-dark/5 gap-6">
          <p className="text-xs uppercase tracking-[0.2em] text-dark/40 font-bold">
            © {currentYear} SS Photography & Films. All Rights Reserved.
          </p>
          <div className="flex space-x-8 text-xs uppercase tracking-[0.2em] text-dark/40 font-bold">
             <Link href="/privacy" className="hover:text-dark transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-dark transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
