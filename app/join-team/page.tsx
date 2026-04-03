"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { addTeamApplication } from '@/lib/db';
import { Send, FileText, Globe, Camera, Video, User, CircleCheck, ArrowRight, ShieldCheck } from 'lucide-react';

const specializations = [
  "Wedding", "Cinematography", "Video Editing", "Photo Retouching", 
  "Color Grading", "Album Design", "Sound Design", "Drone Operation", 
  "Portrait", "Maternity", "Corporate", "Events", "Product", "Fashion"
];

const JoinTeamPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    specialization: [] as string[],
    portfolioUrl: '',
    about: ''
  });

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec) 
        ? prev.specialization.filter(s => s !== spec) 
        : [...prev.specialization, spec]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTeamApplication(formData);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col font-manrope">
      <Navbar transparentDarkText={true} />

      <section className="flex-1 flex flex-col lg:flex-row pt-32 lg:pt-40">
        {/* Left Pane: Why Join Us */}
        <div className="w-full lg:w-[40%] bg-[#FAF9F6] p-12 md:p-20 flex flex-col justify-center space-y-16 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
          <div className="space-y-6">
             <motion.h1 
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-dark font-cinzel text-4xl md:text-6xl font-bold uppercase tracking-tight"
             >
                Join the <br /> Creative <br /> <span className="text-gold italic">Legacy</span>
             </motion.h1>
             <div className="w-24 h-[1px] bg-gold" />
             <p className="text-secondary/80 text-sm md:text-base leading-relaxed tracking-widest uppercase">
                We're always looking for soulful storytellers to broaden our professional circle.
             </p>
          </div>

          <div className="grid grid-cols-1 gap-10">
             {[
               { icon: Camera, title: "Artistic Freedom", desc: "We value your unique perspective and creative eye." },
               { icon: Video, title: "Premium Gear", desc: "Access to state-of-the-art equipment and post-production tools." },
               { icon: Globe, title: "Global Events", desc: "Document stories across diverse landscapes and cultures." },
               { icon: User, title: "Mentorship", desc: "Grow alongside Lead Director Shreyas Sawardekar." },
             ].map((benefit, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 + (idx * 0.1) }}
                   className="flex items-start space-x-6 group"
                >
                   <div className="p-4 bg-gold/10 text-gold group-hover:bg-gold group-hover:text-dark transition-all duration-500 rounded-xl border border-gold/20 shadow-sm">
                      <benefit.icon size={24} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-sm font-bold text-dark uppercase tracking-widest">{benefit.title}</h4>
                      <p className="text-sm text-secondary/60 uppercase tracking-widest leading-relaxed">{benefit.desc}</p>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>

        {/* Right Pane: Application Form */}
        <div className="flex-1 py-20 px-6 md:px-16 lg:px-24 bg-background">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-2xl mx-auto space-y-12"
              >
                <div className="space-y-4">
                   <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-tight">Application Form</h2>
                   <p className="text-secondary text-xs uppercase font-bold tracking-[0.4em]">Reviewing responses within 48 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-gold/80 block">Full Name</label>
                        <input 
                           id="fullName"
                           type="text" 
                           placeholder="ANKIT VERMA"
                           required
                           suppressHydrationWarning
                           className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-dark transition-all placeholder:text-secondary/20"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                       <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gold/80 block">Email Address</label>
                          <input 
                             id="email"
                             type="email" 
                             placeholder="ankit@example.com"
                             required
                             suppressHydrationWarning
                             className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-dark transition-all placeholder:text-secondary/20"
                             value={formData.email}
                             onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <p className="text-[10px] text-secondary/60 uppercase tracking-widest leading-relaxed italic">
                           * The reply will be received on your email ID, so enter your email ID properly.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gold/80 block">Phone Number</label>
                        <input 
                           id="phone"
                           type="tel" 
                           placeholder="+91 00000 00000"
                           required
                           suppressHydrationWarning
                           className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-dark transition-all placeholder:text-secondary/20"
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                         <label htmlFor="experience" className="text-xs font-bold uppercase tracking-widest text-gold/80 block">Experience (Years)</label>
                         <input 
                           id="experience"
                           type="number" 
                           placeholder="0"
                           suppressHydrationWarning
                           className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-dark transition-all placeholder:text-secondary/20"
                           value={formData.experience}
                           onChange={(e) => setFormData({...formData, experience: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <label className="text-xs font-bold uppercase tracking-widest text-gold/80 block">Specialization (Choose Multiple)</label>
                      <div className="flex flex-wrap gap-4">
                         {specializations.map(spec => (
                           <button 
                             key={spec}
                             type="button"
                             suppressHydrationWarning
                             onClick={() => toggleSpecialization(spec)}
                             className={`px-5 py-2 text-xs uppercase font-bold tracking-widest border transition-all ${
                               formData.specialization.includes(spec) ? 'bg-gold text-dark border-gold' : 'border-gold/20 text-secondary hover:border-gold'
                             }`}
                           >
                              {spec}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label htmlFor="portfolio" className="text-xs font-bold uppercase tracking-widest text-gold/80 flex items-center space-x-2">
                         <Globe size={12} />
                         <span>Portfolio URL (Link to your work)</span>
                      </label>
                      <input 
                         id="portfolio"
                         type="url" 
                         placeholder="https://behance.net/..."
                         required
                         suppressHydrationWarning
                         className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-dark transition-all placeholder:text-secondary/20 font-bold tracking-widest text-xs"
                         value={formData.portfolioUrl}
                         onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label htmlFor="vision" className="text-xs font-bold uppercase tracking-widest text-gold/80 block">Tell us about your creative vision</label>
                      <textarea 
                        id="vision"
                        rows={4}
                        placeholder="I believe in frame quality and emotion..."
                        suppressHydrationWarning
                        className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 outline-none text-dark transition-all placeholder:text-secondary/20 resize-none font-medium text-xs leading-relaxed"
                        value={formData.about}
                        onChange={(e) => setFormData({...formData, about: e.target.value})}
                      />
                   </div>

                   <div className="pt-8">
                      <button 
                        type="submit" 
                        suppressHydrationWarning
                        className="w-full bg-dark text-gold font-bold uppercase tracking-[0.4em] text-sm py-6 rounded-xl shadow-2xl hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group"
                      >
                         <span className="relative z-10 flex items-center justify-center space-x-4">
                            <Send size={18} />
                            <span>Submit Application</span>
                         </span>
                         <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                      </button>
                   </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl mx-auto text-center space-y-12 py-32"
              >
                 <div className="flex justify-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-dark shadow-gold/20 shadow-2xl"
                    >
                       <CircleCheck size={48} />
                    </motion.div>
                 </div>
                 
                 <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-dark uppercase tracking-tight">Application Received!</h2>
                    <p className="text-secondary text-sm uppercase tracking-widest leading-loose">
                      Your creative portfolio has been registered in our professional database. 
                    </p>
                 </div>

                 <p className="text-dark font-manrope text-sm border-l-4 border-gold pl-6 py-2 italic text-left">
                    "Great things are not done by impulse, but by a series of small things brought together."
                 </p>

                 <p className="text-secondary text-sm uppercase tracking-widest">
                    We'll review your application and contact you within <span className="font-bold text-dark">3-5 business days</span> for further discussion.
                 </p>

                 <div className="pt-10">
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="inline-flex items-center space-x-4 text-xs font-bold text-dark bg-gold/10 px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group mx-auto tracking-[0.2em]"
                    >
                       <span className="relative z-10 flex items-center justify-center space-x-4"><span>Return to Careers</span><ArrowRight size={14} /></span><div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default JoinTeamPage;
