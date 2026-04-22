"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, Camera, Heart, Baby, Users } from 'lucide-react';

const TermsPage = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const sections = [
    {
      title: "Pre-Wedding",
      icon: <Camera className="text-gold" size={20} />,
      content: [
        {
          heading: "1. Booking Confirmation",
          items: [
            "Booking confirmation is final once these terms are accepted.",
            "A non-refundable booking fee may be required to secure the date.",
            "Entry fees, location permissions, and related charges are not included in any package; the client must cover these for themselves and the photographers.",
            "We reserve the right to place our logo on edited work and to upload photos/videos on social platforms for portfolio and promotional purposes. Clients who are uncomfortable with this must discuss it at the time of booking."
          ]
        },
        {
          heading: "2. Payment",
          items: [
            "The full balance must be cleared on the same day after the shoot, before any raw data is shared for selection.",
            "No refunds are provided for any reason. If the client cancels the shoot, the advance will only be adjusted toward their next shoot with us.",
            "If the shoot location is outside Chiplun (more than 20 km), additional charges for travel (diesel + tolls), accommodation (if required), and food will apply.",
            "We do not provide food, outfits, makeup artists, or makeup facilities in any package."
          ]
        },
        {
          heading: "3. Cancellation & Rescheduling",
          items: [
            "If the client cancels the booking, the booking fee is non-refundable.",
            "In the case of unforeseen circumstances, the photographer will make every reasonable effort to reschedule the shoot.",
            "The client may request a one-time reschedule, subject to the photographer's availability.",
            "The new date must be confirmed at least 15 days prior to the original shoot date."
          ]
        }
      ]
    },
    {
      title: "Wedding Event",
      icon: <Users className="text-gold" size={20} />,
      content: [
        {
          heading: "1. Payment Terms",
          items: [
            "50% advance is required to book the date.",
            "40% payment is due immediately after the wedding.",
            "10% payment must be cleared before album printing.",
            "Packages cover one single day; additional functions are charged extra."
          ]
        },
        {
          heading: "2. Travel & Restrictions",
          items: [
            "Drone will not be used in indoor wedding locations or Army/NDA areas.",
            "For weddings outside Chiplun, travel, stay, and food charges apply for the team."
          ]
        },
        {
          heading: "3. Delivery Timeline",
          items: [
            "Raw images: 1–2 days post-event.",
            "Edited images: 1–2 weeks after client selection.",
            "Photo book: 40–50 days after photo selection.",
            "Once a video song is selected, it cannot be changed."
          ]
        }
      ]
    },
    {
      title: "Maternity",
      icon: <Heart className="text-gold" size={20} />,
      content: [
        {
          heading: "Booking & Payments",
          items: [
            "50% advance required to confirm the booking. Remaining 50% payable on shoot day.",
            "No cancellation. Advance amount is non-refundable under any circumstances.",
            "One-time rescheduling allowed (subject to availability). Not allowed on weekends or public holidays.",
            "Advance valid for 1 month only."
          ]
        },
        {
          heading: "Studio Rules",
          items: [
            "Maximum 4 people allowed in the studio (including the mother-to-be).",
            "Any damage to studio property, outfits, or equipment will be charged to the client.",
            "Reference images / concepts must be shared 2–3 days prior to the shoot.",
            "Editing includes basic color correction and skin retouching only. No adding or removing people/objects."
          ]
        }
      ]
    },
    {
      title: "Baby Shoot",
      icon: <Baby className="text-gold" size={20} />,
      content: [
        {
          heading: "Booking & Studio",
          items: [
            "50% advance to confirm booking. Remaining 50% on shoot day.",
            "Max 4 people allowed in studio (including baby).",
            "Baby's comfort first. No forcing poses or smiles.",
            "Editing time: 5–7 working days. Urgent editing incurs extra charges."
          ]
        },
        {
          heading: "Standard Terms",
          items: [
            "No cancellation. Advance is non-refundable.",
            "Rescheduling allowed once, subject to availability (Excluding weekends/holidays).",
            "Watermark will be added to final deliverables. Removal requires extra charges.",
            "Only one revision allowed per selected image."
          ]
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F6F4F0] font-manrope">
      <Navbar transparentDarkText={true} />

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 border-b border-dark/5 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 px-4 py-2 bg-dark/5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-secondary"
          >
            <Shield size={12} className="text-gold" />
            <span>Legal & Terms</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-cinzel font-bold text-dark tracking-tight"
          >
            Terms of Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-xs font-bold max-w-2xl mx-auto leading-loose opacity-60 uppercase tracking-widest"
          >
            Clear communication is the foundation of every beautiful memory we capture. 
            Please select a category to review specific terms.
          </motion.p>
        </div>
      </section>

      {/* Terms Content - Side by Side */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-20">
            
            {/* Sidebar Navigation */}
            <div className="space-y-4 h-fit lg:sticky lg:top-32">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/40 mb-8 ml-4">Service Categories</h3>
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-4 no-scrollbar">
                {sections.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center space-x-4 px-6 py-5 rounded-none border transition-all duration-300 min-w-[200px] lg:min-w-0 text-left ${
                      activeTab === idx 
                        ? 'bg-white border-gold shadow-xl translate-x-2' 
                        : 'bg-white/50 border-dark/5 hover:bg-white hover:border-dark/10'
                    }`}
                  >
                    <div className={`p-2 rounded-none transition-colors ${activeTab === idx ? 'bg-gold/10' : 'bg-dark/5'}`}>
                      {React.cloneElement(section.icon as React.ReactElement<any>, { 
                        size: 18,
                        className: activeTab === idx ? 'text-gold' : 'text-dark/40'
                      })}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${
                      activeTab === idx ? 'text-dark' : 'text-dark/40'
                    }`}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white p-8 md:p-16 shadow-2xl border border-dark/5 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-16"
                >
                  <div className="space-y-4">
                    <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-widest">
                      {sections[activeTab].title}
                    </h2>
                    <div className="w-20 h-[2px] bg-gold"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {sections[activeTab].content.map((block, bIdx) => (
                      <div key={bIdx} className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold flex items-center">
                          <span className="w-8 h-[1px] bg-gold/30 mr-3"></span>
                          {block.heading}
                        </h3>
                        <ul className="space-y-4">
                          {block.items.map((item, iIdx) => (
                            <li key={iIdx} className="text-[11px] font-bold text-dark/60 uppercase tracking-widest leading-relaxed flex items-start">
                              <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-gold/30 rounded-full shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Note */}
      <section className="py-20 px-6 bg-dark text-white text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <FileText className="mx-auto text-gold" size={48} />
          <h2 className="text-2xl font-cinzel font-bold tracking-widest">Questions Regarding Terms?</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 leading-loose">
            By booking a session with SS Photo & Films, you acknowledge and agree to the terms mentioned above. 
            For any clarifications, please contact us.
          </p>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="space-y-2">
               <span className="block text-[8px] uppercase tracking-widest text-gold/60 font-black">Email</span>
               <span className="block text-xs font-bold tracking-widest uppercase">ssphotographyofficial13@gmail.com</span>
            </div>
            <div className="space-y-2">
               <span className="block text-[8px] uppercase tracking-widest text-gold/60 font-black">WhatsApp</span>
               <span className="block text-xs font-bold tracking-widest uppercase">+91 77410 83155</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsPage;

