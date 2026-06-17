"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { useCms } from '@/lib/CmsContext';

const DEFAULT_TESTIMONIALS = [
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
  { 
    review: "Great studio from chiplun. Best studio from chiplun. Truly appreciate their dedication and would highly recommend SS Photo and Films.", 
    clientName: "Jagruti Surve", 
    eventType: "Studio Review" 
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
      eventType: "Event Type",
      review: "Write the client review here...",
      image: ""
    });
    setIndex(testimonials.length); // go to new slide
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
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (testimonials.length === 0) {
    return (
      <section className="bg-background py-24 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-cinzel text-dark mb-4">CLIENT TALES</h2>
        <div className="py-10 border border-dashed border-dark/10 rounded-2xl max-w-xl mx-auto flex flex-col items-center">
          <p className="text-secondary/60 text-sm mb-4">No testimonials yet.</p>
          {editMode && !isPreview && (
            <button onClick={handleAddNew} className="bg-gold text-dark px-6 py-2.5 rounded font-bold text-xs uppercase tracking-widest shadow">
              + Add Testimonial
            </button>
          )}
        </div>
      </section>
    );
  }

  const current = testimonials[index] || testimonials[0];

  return (
    <section className="bg-background py-24 px-6 md:px-12 border-t border-gold/10 overflow-hidden font-manrope">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-dark tracking-tight uppercase">
            CLIENT TALES
          </h2>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
          
          {editMode && !isPreview && (
            <button 
              onClick={handleAddNew}
              className="bg-gold hover:bg-dark hover:text-white text-dark font-manrope font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-xl transition-all duration-300 shadow-md mt-4"
            >
              + Add Testimonial
            </button>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[480px] md:min-h-[400px] flex items-center justify-center">
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
              drag={(!editMode || isPreview) ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset }) => {
                const swipe = 20;
                if (offset.x < -swipe) {
                  nextSlide();
                } else if (offset.x > swipe) {
                  prevSlide();
                }
              }}
              className="absolute w-full touch-pan-y"
            >
              <div className="bg-white p-6 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-dark/5 rounded-2xl relative">
                <Quote className="text-gold/10 absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 md:w-20 md:h-20" strokeWidth={1} />
                
                {/* Admin testimonials menu in edit mode */}
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

                <div className="space-y-6 md:space-y-10 relative z-10 text-center md:text-left">
                  <div className="text-secondary font-garamond italic text-xl md:text-3xl leading-snug w-full">
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
                  
                  <div className="pt-6 md:pt-10 border-t border-gold/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="w-full md:w-auto">
                      <h4 className="font-cinzel text-dark font-bold uppercase tracking-widest text-base md:text-lg">
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
                      <p className="text-gold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mt-1">
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
                    
                    <div className="hidden md:flex space-x-4 shrink-0">
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
        <div className="mt-10 md:mt-12 flex justify-center items-center space-x-3">
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
