"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6F4F0] text-dark overflow-x-hidden font-manrope">
      <Navbar />

      {/* Hero Section — Full viewport height */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <EditableImage
            cmsKey="about.hero.bg"
            defaultVal="/assets/about-hero-bg.jpg"
            alt="About SS Photo & Films"
            fill
            priority
            className="w-full h-full object-cover brightness-[0.5]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/20 to-dark/10 z-10" />
        </div>

        <div className="relative z-20 text-center px-4">
          <p className="text-white/60 text-xs uppercase tracking-[0.5em] font-manrope mb-5">
            <EditableText cmsKey="about.hero.subtitle" defaultVal="THE STORY OF SS PHOTO & FILMS" />
          </p>
          <h1 className="text-6xl md:text-8xl font-cinzel font-normal text-white tracking-widest uppercase">
            <EditableText cmsKey="about.hero.title" defaultVal="ABOUT US" />
          </h1>
        </div>
      </section>

      {/* Section 2 — Philosophy Split */}
      <section className="w-full flex flex-col md:flex-row border-b border-dark/5">
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-20 bg-[#F2EFEB]">
          <div className="max-w-sm">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel font-normal text-dark leading-snug tracking-wide uppercase">
              <EditableText cmsKey="about.philosophy.title" defaultVal="FOR THE LOVE OF ART AND TIMELESS MEMORIES" />
            </h2>
            <span className="block text-[#A17A5D] text-sm mt-6 tracking-[0.3em] font-cinzel uppercase">
              <EditableText cmsKey="about.philosophy.subtitle" defaultVal="Stories that live forever" />
            </span>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-10 md:p-20 bg-[#F6F4F0] space-y-5">
          <div style={{ fontFamily: 'Elsie, serif' }} className="text-sm md:text-base leading-relaxed text-[#646464] space-y-5">
            <p>
              <EditableText cmsKey="about.philosophy.p1" defaultVal="SS Studio is the passion project of Shreyas Sawardekar & Team. What began as a simple love for creativity and design soon transformed into a journey of capturing emotions, celebrations, and life's most treasured moments. From experimenting with design and visuals to telling stories through the lens, We discovered that every frame could hold not just an image but a memory." />
            </p>
            <p>
              <EditableText cmsKey="about.philosophy.p2" defaultVal="At SS Studio, the idea is simple: create visual stories that blend artistry with authenticity. With a documentary and creative storytelling style, SS Studio captures the joy, the beauty, and those fleeting moments-in-between that truly define a celebration." />
            </p>
          </div>
          <p className="uppercase tracking-widest text-xs font-bold text-dark/60 font-cinzel pt-2">
            <EditableText cmsKey="about.philosophy.subquote" defaultVal="Crafting stories, creating legacies since the very first frame!" />
          </p>
        </div>
      </section>

      {/* Section 3 — Brown Banner */}
      <section className="w-full bg-[#A17A5D] py-10 md:py-0">
        <div className="max-w-6xl mx-auto px-6 py-0">
          <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-14">
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 py-8">
              <h2 className="text-lg md:text-xl lg:text-2xl font-cinzel font-normal text-[#F6F4F0] leading-snug tracking-wide">
                <EditableText cmsKey="about.banner.quote" defaultVal="Every wedding tells a story, at SS Photo & Films we feel blessed to make storytelling our profession!" />
              </h2>
            </div>
            <div className="w-full md:w-1/2 overflow-hidden rounded shadow-xl relative" style={{ minHeight: '280px' }}>
              <EditableImage
                cmsKey="about.banner.image"
                defaultVal="/assets/gallery-1.jpg"
                alt="Indian Wedding Story"
                fill
                className="w-full h-full object-cover object-center"
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
            <EditableImage
              cmsKey="about.meet.image"
              defaultVal="/assets/about-photo.jpg"
              alt="Shreyas Sawardekar"
              fill
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col space-y-5">
          <h2 className="text-3xl md:text-5xl font-cinzel font-normal text-dark tracking-wider uppercase">
            <EditableText cmsKey="about.meet.title" defaultVal="MEET SHREYAS" />
          </h2>
          <p style={{ fontFamily: 'Elsie, serif' }} className="text-lg md:text-xl text-[#A17A5D] leading-snug">
            <EditableText cmsKey="about.meet.subtitle" defaultVal="Dreamer, visual storyteller, and the heart behind SS Photo & Films." />
          </p>

          <div className="space-y-4" style={{ fontFamily: 'Elsie, serif' }}>
            <p className="text-base md:text-lg leading-relaxed text-[#646464]">
              <EditableText cmsKey="about.meet.p1" defaultVal="Originally a tech enthusiast, Shreyas found his true calling behind the lens, where moments turn into timeless memories. From chasing creativity in classrooms to capturing love stories through his camera, he's a believer that passion makes work feel like play!" />
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#646464]">
              <EditableText cmsKey="about.meet.p2" defaultVal="When he's not filming weddings, you'll find him sketching ideas, exploring new art forms, or finding inspiration in everyday life. For Shreyas, photography isn't just a career — it's a canvas of emotions, colors, and stories waiting to be told." />
            </p>
          </div>

          <p className="font-cinzel text-xl md:text-2xl font-normal text-dark tracking-wide pt-1 italic">
            <EditableText cmsKey="about.meet.signature" defaultVal="Shreyas Sawardekar" />
          </p>
        </div>
      </section>

      {/* Section 5 — Our Studio */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-14">
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 py-8">
            <h2 className="text-3xl md:text-4xl font-cinzel font-normal text-dark tracking-wider uppercase">
              <EditableText cmsKey="about.studio.title" defaultVal="OUR STUDIO" />
            </h2>
            <div className="space-y-4" style={{ fontFamily: 'Elsie, serif' }}>
              <p className="text-base md:text-lg leading-relaxed text-[#646464]">
                <EditableText cmsKey="about.studio.p1" defaultVal="SS Studio is more than four walls — it's a creative sanctuary where ideas turn into stories and passion meets art. With vibrant workstations, cozy brainstorming corners, and a shooting space filled with natural light, every detail is designed to spark inspiration." />
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#646464]">
                <EditableText cmsKey="about.studio.p2" defaultVal="Here, coffee fuels conversations, creativity flows freely, and every project feels like a celebration." />
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 overflow-hidden rounded shadow-xl relative" style={{ minHeight: '280px' }}>
            <EditableImage
              cmsKey="about.studio.image"
              defaultVal="/assets/studio.jpg"
              alt="SS Studio"
              fill
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 7 — Our Process */}
      <section className="relative w-full py-20 px-6 text-center overflow-hidden">
        <EditableImage
          cmsKey="about.process.image"
          defaultVal="/assets/wedding/1ssp01096-copy.jpg"
          alt="Our Process Background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center"
          sizes="100vw"
        />
        {/* Brown overlay */}
        <div className="absolute inset-0 bg-[#A17A5D]/80 z-10" />
        <div className="relative z-20">
          <h2 className="text-2xl md:text-3xl font-cinzel font-normal text-[#F6F4F0] mb-7 tracking-widest uppercase">
            <EditableText cmsKey="about.process.title" defaultVal="OUR PROCESS" />
          </h2>
          <p className="max-w-3xl mx-auto text-[#F6F4F0]/90 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'Elsie, serif' }}>
            <EditableText cmsKey="about.process.description" defaultVal="We're not your usual photography team — we work with people who care about meaningful storytelling and quality over convenience. Since we take on limited projects, every shoot gets the time, attention, and direction it deserves. Based on your package, your project will be led by our lead creator or a senior director. If that sounds like the right fit, reach out and we'll schedule a consultation." />
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
