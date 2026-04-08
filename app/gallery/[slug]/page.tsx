"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { galleryStories } from '@/lib/galleryData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

const StoryDetailPage = ({ params }: StoryPageProps) => {
  const { slug } = React.use(params);
  const story = galleryStories.find(s => s.slug === slug);

  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header for the Story */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={story.mainImage} 
            alt={story.title} 
            fill
            priority
            className="w-full h-full object-cover scale-105 blur-sm brightness-50"
            sizes="100vw"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/60 font-manrope text-xs md:text-sm uppercase tracking-[0.5em] mb-6"
          >
            {story.date} / {story.category}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-3xl md:text-5xl lg:text-6xl font-cinzel font-bold leading-tight uppercase mb-4 truncate whitespace-nowrap"
          >
            {story.names}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gold font-cinzel italic text-xl md:text-2xl tracking-widest opacity-80 truncate whitespace-nowrap"
          >
            {story.title}
          </motion.p>
        </div>
      </section>

      {/* Full Gallery Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1600px] mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {story.images.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden rounded-[15px] shadow-sm transform transition-all duration-500 hover:shadow-xl"
              >
                <Image 
                  src={image} 
                  alt={`${story.names} Gallery - ${idx + 1}`} 
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-dark/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            ))}
          </div>

          {/* Simple Back Navigation */}
          <div className="mt-32 pt-20 border-t border-dark/5 text-center">
            <h3 className="text-2xl font-cinzel font-bold text-dark mb-12 uppercase tracking-widest">
              DISCOVER MORE STORIES
            </h3>
            <Link 
              href="/gallery"
              className="inline-flex items-center space-x-6 group"
            >
              <div className="w-12 h-12 rounded-full border border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-all duration-500">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-5 h-5 rotate-180"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              <span className="text-xs font-manrope font-bold uppercase tracking-[0.4em] text-dark">
                Back to Gallery
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default StoryDetailPage;
