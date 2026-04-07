"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addQuery } from '@/lib/db';
import { useAuth } from '@/lib/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck } from 'lucide-react';

const pricingCategories = [
  'Wedding', 'Pre-Wedding', 'Baby-Shoot', 'Maternity', 'Engagement',
  'Birthday', 'Corporate', 'Other'
];

const ContactPage = () => {
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    eventType: '',
    email: '',
    date: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addQuery({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        userEmail: user?.email || formData.email,
        message: `[${formData.eventType || 'General'}] Date: ${formData.date || 'TBD'} | Phone: ${formData.phone} | ${formData.message}`
      });

      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Query error:", err);
      alert("There was an error sending your message. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F4F0] font-manrope text-dark">
      <Navbar transparentDarkText={true} />

      {/* Hero Split */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-40 pb-0 flex flex-col md:flex-row gap-0 min-h-[340px]">
        {/* Left: Brand Statement */}
        <div className="w-full md:w-1/2 flex flex-col justify-center py-16 md:py-24 pr-12 space-y-8">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-dark leading-none tracking-tight">
            LOVE.<br />
            FILMED.<br />
            FOREVER.
          </h1>
        </div>
        
        {/* Right: Story Copy */}
        <div className="w-full md:w-1/2 flex flex-col justify-center py-16 md:py-24 space-y-6 border-l border-dark/10 pl-12">
          <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-dark/60">YOUR STORY, OUR LENS</h3>
          <p className="text-sm leading-relaxed text-[#646464]">
            Everyone has a story worth telling and we'd love to capture yours. At SS Photo & Films, we believe in creating timeless visuals that reflect who you are.
          </p>
          <p className="text-sm leading-relaxed text-[#646464]">
            We're quick with our responses — the first step is confirming our availability. From there, we'll share a personalised selection of our work and schedule a consultation to understand your vision.
          </p>
          <p className="text-sm leading-relaxed text-[#646464]">
            So go ahead, share your details with us below. Not a fan of forms? Just give us a call or drop us a message on WhatsApp:
          </p>
          <p className="text-sm font-bold text-dark">
            Phone / WhatsApp: <span className="text-dark">+91 77410 83155</span>
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-dark text-center tracking-widest mb-16 uppercase">
                Get In Touch
              </h2>

              <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto">

                {/* Name Row */}
                <div>
                  <label className="block text-base md:text-lg font-bold text-dark mb-4">Name</label>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="First"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full border border-dark/20 bg-white px-4 py-3 text-base rounded outline-none focus:border-dark transition-colors"
                      />
                      <p className="text-xs md:text-sm text-secondary mt-2">First Name</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Last"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full border border-dark/20 bg-white px-4 py-3 text-base rounded outline-none focus:border-dark transition-colors"
                      />
                      <p className="text-xs md:text-sm text-secondary mt-2">Last Name</p>
                    </div>
                  </div>
                </div>

                {/* Phone + Event Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-base md:text-lg font-bold text-dark mb-4">Your Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-dark/20 bg-white px-4 py-3 text-base rounded outline-none focus:border-dark transition-colors"
                    />
                    <p className="text-xs md:text-sm text-secondary mt-2">We prefer Whatsapp!</p>
                  </div>
                  <div>
                    <label className="block text-base md:text-lg font-bold text-dark mb-4">Select Your Event</label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                      className="w-full border border-dark/20 bg-white px-4 py-3 text-base rounded outline-none focus:border-dark transition-colors"
                    >
                      <option value="">-- Select --</option>
                      {pricingCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email + Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-base md:text-lg font-bold text-dark mb-4">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-dark/20 bg-white px-4 py-3 text-base rounded outline-none focus:border-dark transition-colors"
                    />
                    <p className="text-xs md:text-sm text-secondary mt-2">Please check your spam folder, weirdly our email goes there sometimes..</p>
                  </div>
                  <div>
                    <label className="block text-base md:text-lg font-bold text-dark mb-4">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full border border-dark/20 bg-white px-4 py-3 text-base rounded outline-none focus:border-dark transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-base md:text-lg font-bold text-dark mb-4">Your Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe about all your concerns"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full border border-dark/20 bg-white px-4 py-3 text-base rounded outline-none focus:border-dark transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#3A3A3A] text-white px-12 py-5 rounded-xl text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden group shadow-2xl hover:bg-dark hover:scale-105"
                >
                  <span className="relative z-10">SUBMIT</span>
                  <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 space-y-8 max-w-xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center text-[#059669] mx-auto"
              >
                <CircleCheck size={40} />
              </motion.div>
              <h2 className="text-4xl font-cinzel font-bold text-dark uppercase">Message Sent!</h2>
              <p className="text-secondary text-sm leading-relaxed">
                Thank you for reaching out! We've received your query and will get back to you within 2 hours.
              </p>
              {user && (
                <p className="text-xs text-secondary">
                  You can also track your query in your <a href="/client" className="text-dark font-bold underline">Dashboard</a>.
                </p>
              )}
              <button
                onClick={() => { setIsSuccess(false); setFormData({ firstName: '', lastName: '', phone: '', eventType: '', email: '', date: '', message: '' }); }}
                className="text-xs uppercase font-bold text-dark border-b border-dark/30 pb-1 hover:border-dark transition-colors tracking-widest"
              >
                Send Another Message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
