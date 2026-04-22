"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { 
    quote: "An amazing experience from start to finish! SS Studio covered our pre-wedding, engagement, wedding and album, and everything turned out better than we imagined. Shreyas was very patient, calm and made us feel at ease throughout, never awkward or rushed.", 
    name: "Mithilesh Shirke", 
    type: "Wedding & Album" 
  },
  { 
    quote: "We entrusted SS Photo and Films with our contract of marriage ceremony photoshoot, and we are extremely satisfied with their work. The team was professional, punctual, and very cooperative throughout the event.", 
    name: "Pratik Katdare", 
    type: "Wedding Ceremony" 
  },
  { 
    quote: "Excellent work with excellent studio. Shreyas was very patiently and calmly working for us, as we are having our baby's photoshoot. All the best.", 
    name: "Divyanee Gite", 
    type: "Baby Photoshoot" 
  },
  { 
    quote: "Shreyas is very talented, and his passion truly shows in his work. We had a great experience with our baby shoot at SS Photo Studio and are very happy with the results.", 
    name: "Kunal Baikar", 
    type: "Baby Shoot" 
  },
  { 
    quote: "Very nice photography and Videography. Captured important moment beautifully with great attention to detail and creativity.", 
    name: "Deepali Hiwalkar", 
    type: "Photography & Videography" 
  },
  { 
    quote: "Great studio from chiplun. Best studio from chiplun. Truly appreciate their dedication and would highly recommend SS Photo and Films.", 
    name: "Jagruti Surve", 
    type: "Studio Review" 
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  // Auto-play (optional, but nice)
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [index]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="bg-background py-24 px-6 md:px-12 border-t border-gold/10 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-dark tracking-tight">
            CLIENT TALES
          </h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[550px] md:min-h-[400px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = 10000;
                if (offset.x < -swipe || offset.x < -20) {
                  nextSlide();
                } else if (offset.x > swipe || offset.x > 20) {
                  prevSlide();
                }
              }}
              className="absolute w-full touch-pan-y"
            >
              <div className="bg-white p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-dark/5 rounded-2xl relative">
                <Quote className="text-gold/10 absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 md:w-20 md:h-20" strokeWidth={1} />
                
                <div className="space-y-6 md:space-y-10 relative z-10 text-center md:text-left">
                  <p className="text-secondary font-garamond italic text-xl md:text-3xl leading-snug">
                    "{testimonials[index].quote}"
                  </p>
                  
                  <div className="pt-6 md:pt-10 border-t border-gold/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-cinzel text-dark font-bold uppercase tracking-widest text-base md:text-lg">
                        {testimonials[index].name}
                      </h4>
                      <p className="text-gold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mt-1">
                        {testimonials[index].type}
                      </p>
                    </div>
                    
                    <div className="hidden md:flex space-x-4">
                      <button 
                        onClick={prevSlide}
                        className="p-3 border border-dark/10 rounded-full hover:bg-dark hover:text-white transition-all duration-300"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="p-3 border border-dark/10 rounded-full hover:bg-dark hover:text-white transition-all duration-300"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="mt-16 md:mt-12 flex justify-center items-center space-x-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-500 rounded-full ${
                i === index 
                ? "w-8 h-2 bg-gold" 
                : "w-2 h-2 bg-dark/10 hover:bg-gold/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Footer Link */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-20 text-center"
        >
          <a 
            href="https://maps.app.goo.gl/GTSoLLD2cZGRgLPy5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-4 text-[10px] uppercase tracking-[0.4em] font-black text-dark/40 hover:text-gold transition-all duration-500 group"
          >
            <span>VERIFIED GOOGLE REVIEWS</span>
            <div className="w-10 h-[1px] bg-dark/20 group-hover:bg-gold transition-colors" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

