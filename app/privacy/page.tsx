"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, MessageSquare, FileText, Camera } from 'lucide-react';

const PrivacyPage = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const sections = [
    {
      title: "Data Collection",
      icon: <Eye className="text-gold" size={20} />,
      content: [
        {
          heading: "Information We Collect",
          items: [
            "Contact information (Name, Email, Phone Number, City).",
            "Event details (Date, Location, Category).",
            "Technical data (IP address, browser type) for site security.",
            "Face data (optional) if you use our 'Find My Photos' feature for automated selection."
          ]
        },
        {
          heading: "How We Use It",
          items: [
            "To manage your bookings and provide requested services.",
            "To communicate event updates and delivery timelines.",
            "To personalize your experience in our private client galleries.",
            "We do not sell or share your personal data with third-party marketers."
          ]
        }
      ]
    },
    {
      title: "Image Usage",
      icon: <Camera className="text-gold" size={20} />,
      content: [
        {
          heading: "Portfolio & Social Media",
          items: [
            "We reserve the right to display edited images/videos on our website and social media for promotional purposes.",
            "If you prefer to keep your event private, please inform us at the time of booking.",
            "We respect your privacy and will accommodate 'no-social-media' requests if discussed upfront."
          ]
        },
        {
          heading: "Client Galleries",
          items: [
            "Private galleries are secured via unique links or login credentials.",
            "Shared links should be managed carefully by the client.",
            "We are not responsible for unauthorized access resulting from shared credentials."
          ]
        }
      ]
    },
    {
      title: "Communication",
      icon: <MessageSquare className="text-gold" size={20} />,
      content: [
        {
          heading: "WhatsApp & Notifications",
          items: [
            "By booking, you consent to receive WhatsApp communications regarding your event.",
            "This includes booking confirmations, payment receipts, and delivery links.",
            "You can opt-out by informing us, though it may delay service updates."
          ]
        },
        {
          heading: "Email Policy",
          items: [
            "Occasional emails about new services or seasonal offers may be sent.",
            "Each email contains an unsubscribe link for your convenience."
          ]
        }
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="text-gold" size={20} />,
      content: [
        {
          heading: "Storage & Protection",
          items: [
            "Client data is stored securely using industry-standard encryption.",
            "Raw footage and high-res images are stored for a limited time post-delivery.",
            "We recommend downloading and backing up all deliverables immediately upon receipt."
          ]
        },
        {
          heading: "Your Rights",
          items: [
            "You have the right to request deletion of your personal data.",
            "You can request a copy of the information we hold about you.",
            "Contact us for any privacy-related concerns or data requests."
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
            <span>Privacy Policy</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-cinzel font-bold text-dark tracking-tight"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-xs font-bold max-w-2xl mx-auto leading-loose opacity-60 uppercase tracking-widest"
          >
            Your trust is our most valued asset. Here is how we protect and manage 
            your personal information and captured memories.
          </motion.p>
        </div>
      </section>

      {/* Privacy Content - Side by Side */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-20">
            
            {/* Sidebar Navigation */}
            <div className="space-y-4 h-fit lg:sticky lg:top-32">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/40 mb-8 ml-4">Privacy Topics</h3>
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
          <h2 className="text-2xl font-cinzel font-bold tracking-widest">Privacy Concerns?</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 leading-loose">
            Your privacy is our priority. For any questions regarding your data or 
            image rights, please reach out to us.
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

export default PrivacyPage;
