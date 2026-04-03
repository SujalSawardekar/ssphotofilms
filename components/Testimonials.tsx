"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  { 
    quote: "Every frame felt like a painting. Shreyas captured our wedding beautifully.", 
    name: "Kaustubh & Sayali", 
    type: "Wedding" 
  },
  { 
    quote: "The maternity shoot was magical. We will treasure these forever.", 
    name: "Priya Mehta", 
    type: "Maternity" 
  },
  { 
    quote: "Professional, creative, and punctual. Perfect for our corporate event.", 
    name: "TechCorp HR", 
    type: "Corporate" 
  },
];

const Testimonials = () => {
  return (
    <section className="bg-background py-24 px-6 md:px-12 border-t border-gold/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-dark tracking-tight">
            CLIENT TESTIMONIALS
          </h2>
          <div className="w-24 h-[2px] bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-12 relative shadow-lg group hover:shadow-2xl transition-all duration-500 border-t-2 border-transparent hover:border-gold"
            >
              <Quote className="text-gold/20 group-hover:text-gold absolute top-8 right-8 transition-colors duration-500" size={48} />
              
              <div className="space-y-6 relative z-10">
                <p className="text-secondary font-garamond italic text-xl leading-relaxed">
                  "{t.quote}"
                </p>
                
                <div className="pt-8 border-t border-gold/10">
                  <h4 className="font-cinzel text-dark font-bold uppercase tracking-widest">{t.name}</h4>
                  <p className="text-gold text-xs uppercase tracking-[0.2em] mt-1 pr-4">{t.type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
