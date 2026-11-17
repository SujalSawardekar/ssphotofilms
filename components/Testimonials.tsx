"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCms } from '@/lib/CmsContext';

const DEFAULT_TESTIMONIALS = [
  { 
    review: "Great studio from chiplun. Best studio from chiplun. Truly appreciate their dedication and would highly recommend SS Photo and Films.", 
    clientName: "Jagruti Surve", 
    eventType: "Studio Review" 
  },
  { 
    review: "An amazing experience from start to finish! SS Studio covered our pre-wedding, engagement, wedding and album, and everything turned out better than we imagined. Shreyas was very patient, calm and made us feel at ease throughout, never awkward or rushed.", 
    clientName: "Mithilesh Shirke", 
    eventType: "Wedding & Album" 
  },
  { 
    review: "We entrusted SS Photo and Films with our contract of marriage ceremony photoshoot, and we are extremely satisfied with their work. The team was professional, punctual, and very cooperative throughout the event.", 
    clientName: "Pratik Katdare", 
    eventType: "Wedding Ceremony" 
  },
  { 
    review: "Excellent work with excellent studio. Shreyas was very patiently and calmly working for us, as we are having our baby's photoshoot. All the best.", 
    clientName: "Divyanee Gite", 
    eventType: "Baby Photoshoot" 
  },
  { 
    review: "Shreyas is very talented, and his passion truly shows in his work. We had a great experience with our baby shoot at SS Photo Studio and are very happy with the results.", 
    clientName: "Kunal Baikar", 
    eventType: "Baby Shoot" 
  },
  { 
    review: "Very nice photography and Videography. Captured important moment beautifully with great attention to detail and creativity.", 
    clientName: "Deepali Hiwalkar", 
    eventType: "Photography & Videography" 
  },
];

const Testimonials = () => {
  const { 
    editMode, 
    isPreview, 
    testimonials: cmsTestimonials,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    reorderTestimonials
  } = useCms();

  const testimonials = cmsTestimonials.length > 0 ? cmsTestimonials : DEFAULT_TESTIMONIALS;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Safeguard index if array size shrinks
  useEffect(() => {
    if (index >= testimonials.length) {
      setIndex(Math.max(0, testimonials.length - 1));
    }
  }, [testimonials.length, index]);

  const nextSlide = () => {
    if (testimonials.length <= 1) return;
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length <= 1) return;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  // Auto-play (only when not editing)
  useEffect(() => {
    if (editMode && !isPreview) return;
    if (testimonials.length <= 1) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [index, editMode, isPreview, testimonials.length]);

  const handleAddNew = () => {
    addTestimonial({
      clientName: "New Client Name",
      eventType: "Studio Review",
      review: "Write the client review here...",
      image: ""
    });
    setIndex(testimonials.length);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this client testimonial?")) {
      deleteTestimonial(index);
      setIndex(Math.max(0, index - 1));
    }
  };

  const handleMoveLeft = () => {
    if (index > 0) {
      reorderTestimonials(index, index - 1);
      setIndex(index - 1);
    }
  };

  const handleMoveRight = () => {
    if (index < testimonials.length - 1) {
      reorderTestimonials(index, index + 1);
      setIndex(index + 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 500 : -500,
      opacity: 0
    })
  };

  const current = testimonials[index] || testimonials[0];

  return (
    <section id="testimonials" className="bg-background py-20 md:py-28 px-6 md:px-12 border-t border-gold/10 overflow-hidden font-manrope">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header: CLIENT TALES with Gold Line */}
        <div className="text-center mb-12 sm:mb-16 space-y-3 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-dark tracking-wide uppercase">
            CLIENT TALES
          </h2>
          <div className="w-20 sm:w-24 h-[1.5px] bg-gold mx-auto" />
          
          {editMode && !isPreview && (
            <button 
              onClick={handleAddNew}
              className="bg-gold hover:bg-dark hover:text-white text-dark font-manrope font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-xl transition-all duration-300 shadow-md mt-4"
            >
              + Add Testimonial
            </button>
          )}
        </div>

        {/* Testimonial Card Carousel */}
        <div className="relative min-h-[380px] sm:min-h-[340px] md:min-h-[300px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 35 },
                opacity: { duration: 0.25 }
              }}
              drag={(!editMode || isPreview) ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset }) => {
                const swipe = 25;
                if (offset.x < -swipe) {
                  nextSlide();
                } else if (offset.x > swipe) {
                  prevSlide();
                }
              }}
              className="w-full touch-pan-y"
            >
              <div className="bg-white p-8 sm:p-12 md:p-14 shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-dark/[0.04] rounded-2xl md:rounded-[24px] relative">
                
                {/* Large stylized quote mark watermark in top-right */}
                <span className="absolute top-6 right-8 md:top-8 md:right-12 text-[#E8D5B0]/35 font-serif text-6xl md:text-8xl select-none pointer-events-none leading-none">
                  &rdquo;
                </span>
                
                {/* Admin controls in edit mode */}
                {editMode && !isPreview && (
                  <div className="absolute top-4 left-4 z-40 bg-dark/80 backdrop-blur-md rounded-xl p-1.5 flex items-center space-x-2 border border-white/10 shadow-lg text-white">
                    <button
                      disabled={index === 0}
                      onClick={handleMoveLeft}
                      className={`p-1 hover:text-gold transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                      title="Move Left"
                    >
                      ←
                    </button>
                    <button
                      disabled={index === testimonials.length - 1}
                      onClick={handleMoveRight}
                      className={`p-1 hover:text-gold transition-colors ${index === testimonials.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                      title="Move Right"
                    >
                      →
                    </button>
                    <div className="w-[1px] h-4 bg-white/20" />
                    <button
                      onClick={handleDelete}
                      className="text-red-400 p-1 hover:text-red-500 transition-colors"
                      title="Delete Testimonial"
                    >
                      🗑
                    </button>
                  </div>
                )}

                <div className="relative z-10">
                  {/* Quote Text */}
                  <div className="text-[#3A3A3A] font-garamond italic text-lg sm:text-xl md:text-2xl lg:text-[25px] leading-relaxed w-full pr-12 md:pr-16">
                    {editMode && !isPreview ? (
                      <textarea
                        value={current.review}
                        onChange={(e) => updateTestimonial(index, { review: e.target.value })}
                        className="w-full bg-dark/5 p-3 rounded font-manrope text-sm leading-relaxed outline-none border focus:border-gold border-dark/10 resize-none h-32 text-dark"
                      />
                    ) : (
                      `"${current.review}"`
                    )}
                  </div>
                  
                  {/* Thin divider line */}
                  <div className="border-t border-dark/[0.06] my-6 md:my-8" />

                  {/* Bottom Row: Author details on left, circular navigation on right */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-dark font-bold uppercase tracking-[0.2em] text-sm sm:text-base">
                        {editMode && !isPreview ? (
                          <input
                            type="text"
                            value={current.clientName}
                            onChange={(e) => updateTestimonial(index, { clientName: e.target.value })}
                            className="bg-dark/5 border border-dark/10 rounded px-2 py-1 text-sm outline-none focus:border-gold w-full text-dark font-manrope font-bold"
                          />
                        ) : (
                          current.clientName
                        )}
                      </h4>
                      <p className="text-gold text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold mt-1">
                        {editMode && !isPreview ? (
                          <input
                            type="text"
                            value={current.eventType}
                            onChange={(e) => updateTestimonial(index, { eventType: e.target.value })}
                            className="bg-dark/5 border border-dark/10 rounded px-2 py-1 text-[10px] outline-none focus:border-gold w-full text-dark font-manrope font-bold"
                          />
                        ) : (
                          current.eventType
                        )}
                      </p>
                    </div>
                    
                    {/* Navigation Arrows: Circular buttons matching Image 1 */}
                    <div className="flex items-center space-x-2.5">
                      <button 
                        onClick={prevSlide}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-dark/15 bg-white flex items-center justify-center text-dark/70 hover:bg-dark hover:text-white hover:border-dark transition-all duration-300 shadow-sm cursor-pointer"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-dark/15 bg-white flex items-center justify-center text-dark/70 hover:bg-dark hover:text-white hover:border-dark transition-all duration-300 shadow-sm cursor-pointer"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots (Active dot is elongated gold pill) */}
        <div className="mt-8 md:mt-10 flex justify-center items-center space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === index 
                ? "w-7 sm:w-8 h-1.5 bg-gold" 
                : "w-1.5 h-1.5 bg-dark/20 hover:bg-dark/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Direct Verified Google Reviews Link */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-14 text-center"
        >
          <a 
            href="https://maps.app.goo.gl/GTSoLLD2cZGRgLPy5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-4 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold text-dark/40 hover:text-gold transition-all duration-300 group"
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
