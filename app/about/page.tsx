"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6F4F0] text-dark overflow-x-hidden">
      <Navbar />

      {/* Hero Section — Full viewport height */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/prewedding/Pre wedding 1/ssp02832.jpg"
            alt="About SS Photo & Films"
            fill
            priority
            className="w-full h-full object-cover brightness-[0.5]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/20 to-dark/10" />
        </div>

        <div className="relative z-10 text-center px-4">
          <p className="text-white/60 text-xs uppercase tracking-[0.5em] font-manrope mb-5">
            THE STORY OF SS PHOTO & FILMS
          </p>
          <h1 className="text-6xl md:text-8xl font-cinzel font-normal text-white tracking-widest">
            ABOUT US
          </h1>
        </div>
      </section>

      {/* Section 2 — Philosophy Split */}
      <section className="w-full flex flex-col md:flex-row border-b border-dark/5">
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-20 bg-[#F2EFEB]">
          <div className="max-w-sm">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel font-normal text-dark leading-snug tracking-wide">
              FOR THE LOVE OF ART AND TIMELESS MEMORIES
            </h2>
            <span className="block text-[#A17A5D] text-sm mt-6 tracking-[0.3em] font-cinzel uppercase">
              Stories that live forever
            </span>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-10 md:p-20 bg-[#F6F4F0] space-y-5">
          <p style={{ fontFamily: 'Elsie, serif' }} className="text-sm md:text-base leading-relaxed text-[#646464]">
            SS Studio is the passion project of Shreyas Sawardekar & Team. What began as a simple love for creativity and design soon transformed into a journey of capturing emotions, celebrations, and life's most treasured moments. From experimenting with design and visuals to telling stories through the lens, We discovered that every frame could hold not just an image but a memory.
          </p>
          <p style={{ fontFamily: 'Elsie, serif' }} className="text-sm md:text-base leading-relaxed text-[#646464]">
            At SS Studio, the idea is simple: create visual stories that blend artistry with authenticity. With a documentary and creative storytelling style, SS Studio captures the joy, the beauty, and those fleeting moments-in-between that truly define a celebration.
          </p>
          <p className="uppercase tracking-widest text-xs font-bold text-dark/60 font-cinzel">
            Crafting stories, creating legacies since the very first frame!
          </p>
        </div>
      </section>

      {/* Section 3 — Brown Banner */}
      <section className="w-full bg-[#A17A5D]">
        <div className="max-w-6xl mx-auto px-6 py-0">
          <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-14">
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 py-8">
              <h2 className="text-lg md:text-xl lg:text-2xl font-cinzel font-normal text-[#F6F4F0] leading-snug tracking-wide">
                Every wedding tells a story, at SS Photo & Films we feel blessed to make storytelling our profession!
              </h2>
            </div>
            <div className="w-full md:w-1/2 overflow-hidden rounded shadow-xl" style={{ minHeight: '280px' }}>
              <Image
                src="/assets/gallery-1.jpg"
                alt="Indian Wedding Story"
                width={800}
                height={600}
                className="w-full h-full object-cover object-center"
                style={{ minHeight: '280px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Meet Shreyas */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="w-full md:w-5/12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="aspect-[3/4] w-full bg-dark/10 rounded overflow-hidden shadow-xl"
          >
            <Image
              src="/assets/about-photo.jpg"
              alt="Shreyas Sawardekar"
              width={600}
              height={800}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col space-y-5">
          <h2 className="text-3xl md:text-5xl font-cinzel font-normal text-dark tracking-wider">
            MEET SHREYAS
          </h2>
          <p style={{ fontFamily: 'Elsie, serif' }} className="text-lg md:text-xl text-[#A17A5D] leading-snug">
            Dreamer, visual storyteller, and the heart behind SS Photo & Films.
          </p>

          <div className="space-y-4" style={{ fontFamily: 'Elsie, serif' }}>
            <p className="text-base md:text-lg leading-relaxed text-[#646464]">
              Originally a tech enthusiast, Shreyas found his true calling behind the lens, where moments turn into timeless memories. From chasing creativity in classrooms to capturing love stories through his camera, he's a believer that passion makes work feel like play!
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#646464]">
              When he's not filming weddings, you'll find him sketching ideas, exploring new art forms, or finding inspiration in everyday life. For Shreyas, photography isn't just a career — it's a canvas of emotions, colors, and stories waiting to be told.
            </p>
          </div>

          <p className="font-cinzel text-xl md:text-2xl font-normal text-dark tracking-wide pt-1 italic">
            Shreyas Sawardekar
          </p>
        </div>
      </section>

      {/* Section 5 — Our Studio */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-14">
          {/* Left: title + text, centred vertically */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 py-8">
            <h2 className="text-3xl md:text-4xl font-cinzel font-normal text-dark tracking-wider">
              OUR STUDIO
            </h2>
            <div className="space-y-4" style={{ fontFamily: 'Elsie, serif' }}>
              <p className="text-base md:text-lg leading-relaxed text-[#646464]">
                SS Studio is more than four walls — it's a creative sanctuary where ideas turn into stories and passion meets art. With vibrant workstations, cozy brainstorming corners, and a shooting space filled with natural light, every detail is designed to spark inspiration.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#646464]">
                Here, coffee fuels conversations, creativity flows freely, and every project feels like a celebration.
              </p>
            </div>
          </div>
          {/* Right: image matching full height of left column */}
          <div className="w-full md:w-1/2 overflow-hidden rounded shadow-xl" style={{ minHeight: '280px' }}>
            <Image
              src="/assets/studio.jpg"
              alt="SS Studio"
              width={800}
              height={600}
              className="w-full h-full object-cover"
              style={{ minHeight: '280px' }}
            />
          </div>
        </div>
      </section>


      {/* Section 7 — Our Process */}
      <section className="relative w-full py-20 px-6 text-center overflow-hidden">
        {/* Full bleed background image */}
        <Image
          src="/assets/wedding/1ssp01096-copy.jpg"
          alt="Our Process Background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center"
          sizes="100vw"
        />
        {/* Brown overlay */}
        <div className="absolute inset-0 bg-[#A17A5D]/80" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-cinzel font-normal text-[#F6F4F0] mb-7 tracking-widest">
            OUR PROCESS
          </h2>
          <p className="max-w-3xl mx-auto text-[#F6F4F0]/90 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'Elsie, serif' }}>
            We're not your usual photography team — we work with people who care about meaningful storytelling and quality over convenience. Since we take on limited projects, every shoot gets the time, attention, and direction it deserves. Based on your package, your project will be led by our lead creator or a senior director. If that sounds like the right fit, reach out and we'll schedule a consultation.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
