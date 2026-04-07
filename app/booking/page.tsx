"use client";

import React, { useState, Suspense, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter, useSearchParams } from 'next/navigation';
import { pricingCategories } from '@/lib/mockData';
import { addBooking } from '@/lib/db';
import { isValidFutureDate } from '@/lib/utils';
import { useAuth } from '@/lib/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { indianCities, City } from '@/lib/indianCities';
import { Search, MapPin, ChevronDown, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const preselectedEvent = searchParams.get('event') || 'Wedding';
  const preselectedPackageTitle = searchParams.get('package') || 'BASIC SHOOT';

  // Find the matching package data
  const categoryData = pricingCategories.find(c => c.label.toLowerCase() === preselectedEvent.toLowerCase()) || pricingCategories[0];
  const packageData = categoryData.packages.find(p => p.title.toLowerCase() === preselectedPackageTitle.toLowerCase()) || categoryData.packages[0];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    datetime: '',
    city: '',
    location: ''
  });

  // City Dropdown States
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  
  // Pricing Logic States
  const [isPriceChecked, setIsPriceChecked] = useState(false);
  const [surcharge, setSurcharge] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSidebarSearching, setIsSidebarSearching] = useState(false);
  const [showWhySs, setShowWhySs] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<{id: number, message: string, type: 'success' | 'error'}[]>([]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  useEffect(() => {
    // Load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter cities as user types
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCities(indianCities.slice(0, 10)); // Show major ones initially
    } else {
      const filtered = indianCities.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.state.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 15);
      setFilteredCities(filtered);
    }
  }, [searchTerm]);

  const handleCitySelect = (city: City) => {
    setFormData({ ...formData, city: city.name });
    setSearchTerm(city.name);
    setIsOpen(false);
    setIsPriceChecked(false); 
    setIsSidebarSearching(false);
    
    // Auto-calculate surcharge immediately (no forcing)
    if (city.state !== "Maharashtra") {
       setSurcharge(5000); // Out-of-state surcharge
    } else {
       setSurcharge(0);
    }
  };

  const handleCheckPrice = () => {
    if (!formData.city) return;
    setLoading(true);
    // Fake delay for 'premium' verification feel
    setTimeout(() => {
      setIsPriceChecked(true);
      setLoading(false);
    }, 1000);
  };

  const currentTotal = packageData.discountPrice + surcharge;

  const handleProceedToPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please log in to complete your booking.", "error");
      return;
    }

    if (formData.datetime && !isValidFutureDate(formData.datetime)) {
      showNotification("Please select a future date and time for your shoot", "error");
      return;
    }

    if (!formData.city) {
      showNotification("Please select your city to continue.", "error");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Create the pending booking entry in the database
      const newBooking: any = {
        clientName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: user.email,
        phone: formData.phone,
        eventType: categoryData.label,
        eventDate: formData.datetime || "TBD",
        location: `${formData.location}, ${formData.city}`,
        hours: 4,
        status: "Pending", // Start as pending
        amount: currentTotal,
        travelCharges: surcharge,
        packageType: packageData.title,
        packageFeatures: packageData.features,
        message: `City: ${formData.city}`,
        paymentMethod: "Razorpay"
      };

      const savedBooking = await addBooking(newBooking);

      // 2. Redirect to the new Checkout Summary page
      router.push(`/checkout/${savedBooking.id}`);
      
    } catch (err: any) {
      console.error("Booking creation error:", err);
      showNotification(`Error saving booking: ${err.message}`, "error");
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-white min-h-screen pt-[160px]">
      <div className="max-w-6xl w-full px-6 pb-24">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-16"
            >
              {/* Main Booking Header (Centred) */}
              <div className="text-center mb-12">
                 <h1 className="text-4xl md:text-7xl lg:text-8xl font-cinzel font-bold text-[#4A4D4A] tracking-wider mb-6 uppercase">BOOKING</h1>
                 <p className="text-[#646464] text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
                   SUBMIT YOUR INFO AND SECURE YOUR SLOT <span className="text-dark">FAST AND HASSLE-FREE</span>
                 </p>
              </div>

              {/* Two Column Layout: Card & Form */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-16 items-start">
                
                {/* Left Card: Package Summary */}
                <div className="lg:sticky lg:top-40 space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-dark/5 p-10 md:p-12 space-y-8"
                  >
                    <div className="space-y-2">
                       <h3 className="text-lg font-bold text-dark uppercase tracking-tight">{categoryData.label} PLAN:</h3>
                       <h2 className="text-4xl font-cinzel font-bold text-dark">{packageData.title}<span className="text-gold">.</span></h2>
                    </div>

                    <div className="space-y-4">
                       <p className="text-xs font-bold text-secondary uppercase tracking-widest italic decoration-gold underline-offset-4 underline">Photography Only</p>
                       <ul className="space-y-3">
                          {packageData.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-4">
                               <div className="w-1 h-1 bg-dark mt-2 rounded-full shrink-0" />
                               <span className="text-sm font-medium text-dark/70 leading-relaxed">{f}</span>
                            </li>
                          ))}
                       </ul>
                     </div>

                    <div className="pt-6 border-t border-dark/5 space-y-1">
                       <p className="text-xs font-bold text-[#FF2D55] uppercase tracking-widest">Starts at:</p>
                       <div className="flex items-baseline space-x-3">
                          <span className="text-2xl font-cinzel font-bold text-dark/20 line-through Decoration-dark/10">₹{packageData.originalPrice}/-</span>
                          <span className="text-4xl font-cinzel font-bold text-dark">₹{currentTotal}/-</span>
                       </div>
                    </div>


                    {/* Check Price Element (Dashed Box) - NOW SUPPORTS DIRECT SELECTION */}
                    <div className="relative">
                      {!isSidebarSearching ? (
                        <button 
                          type="button"
                          onClick={() => {
                            if (!formData.city) {
                              setIsSidebarSearching(true);
                            } else {
                              handleCheckPrice();
                            }
                          }}
                          disabled={loading}
                          className={`w-full py-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 group ${
                            isPriceChecked ? 'border-emerald-500/30 bg-emerald-50/50' : 'border-[#4A90E2]/30 hover:border-gold hover:bg-gold/5'
                          }`}
                        >
                           {loading ? (
                             <div className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
                           ) : isPriceChecked ? (
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verification Complete ✓</span>
                           ) : (
                             <span className="text-[10px] font-black uppercase tracking-widest text-[#4A90E2] group-hover:text-dark transition-colors text-center px-4">
                               {formData.city ? `Check price for ${formData.city}` : "* Select your city to check price"}
                             </span>
                           )}
                        </button>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full space-y-2"
                        >
                          <div className="relative">
                            <input 
                              autoFocus
                              type="text" 
                              placeholder="Search city..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gold/30 focus:border-gold outline-none bg-white text-dark text-xs font-bold uppercase tracking-widest"
                            />
                            <button onClick={() => setIsSidebarSearching(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark">×</button>
                          </div>
                          
                          <div className="absolute z-50 w-full bg-white shadow-2xl border border-dark/5 mt-1 max-h-40 overflow-y-auto rounded-xl">
                             {filteredCities.map((city, i) => (
                               <button 
                                 key={i} 
                                 type="button" 
                                 onClick={() => handleCitySelect(city)} 
                                 className="w-full text-left px-4 py-3 hover:bg-gold/5 border-b border-dark/5 transition-colors flex flex-col gap-0.5"
                               >
                                  <p className="text-[11px] font-cinzel font-bold text-dark">{city.name}</p>
                                  <p className="text-[8px] font-black text-secondary/40 uppercase tracking-widest">{city.state}</p>
                               </button>
                             ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {surcharge > 0 && (
                       <p className="text-[9px] font-black text-[#FF2D55] uppercase tracking-[0.2em] text-center pt-6">Traveling Charges Included (+₹{surcharge})</p>
                    )}
                  </motion.div>
                </div>

                {/* Right Column: Detailed Form */}
                <form onSubmit={handleProceedToPay} className="space-y-12">
                   <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-gold italic">TELL US ABOUT YOU AND YOUR PLAN 😉</p>
                      <h3 className="text-4xl font-cinzel font-bold text-dark tracking-tight">Personal Information<span className="text-gold">.</span></h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Name Row */}
                      <div className="md:col-span-2 space-y-4">
                         <label className="text-2xl font-cinzel font-bold text-dark">Name</label>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-6 py-4.5 rounded-xl border border-dark/10 focus:border-dark outline-none bg-[#FAF9F6] text-dark font-medium transition-all" placeholder="First" />
                               <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest ml-1 text-left">First Name</p>
                            </div>
                            <div className="space-y-2">
                               <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-6 py-4.5 rounded-xl border border-dark/10 focus:border-dark outline-none bg-[#FAF9F6] text-dark font-medium transition-all" placeholder="Last" />
                               <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest ml-1 text-left">Last Name</p>
                            </div>
                         </div>
                      </div>

                      {/* Phone & Date Row */}
                      <div className="space-y-4">
                         <label className="text-2xl font-cinzel font-bold text-dark">Your Phone Number</label>
                         <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4.5 rounded-xl border border-dark/10 focus:border-dark outline-none bg-[#FAF9F6] text-dark font-medium transition-all" placeholder="+91 XXXXX XXXXX" />
                         <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest ml-1">We prefer Whatsapp !</p>
                      </div>
                      <div className="space-y-4">
                         <label className="text-2xl font-cinzel font-bold text-dark">Time For Shoot</label>
                         <input required type="datetime-local" value={formData.datetime} onChange={(e) => setFormData({...formData, datetime: e.target.value})} className="w-full px-6 py-4.5 rounded-xl border border-dark/10 focus:border-dark outline-none bg-[#FAF9F6] text-dark font-medium transition-all" />
                         <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest ml-1">Pick your exact date and time</p>
                      </div>

                      {/* City & Location Row */}
                      <div className="space-y-4 relative" ref={dropdownRef}>
                         <label className="text-2xl font-cinzel font-bold text-dark">City</label>
                         <div className="relative">
                            <input 
                              required 
                              type="text" 
                              value={searchTerm} 
                              onFocus={() => setIsOpen(true)}
                              onChange={(e) => {setSearchTerm(e.target.value); setIsOpen(true); if(formData.city) {setFormData({...formData, city:''});}}}
                              className="w-full px-6 py-4.5 rounded-xl border border-dark/10 focus:border-dark outline-none bg-[#FAF9F6] text-dark font-medium transition-all pr-12" 
                              placeholder="Select your city" 
                            />
                            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-dark/20 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
                         </div>
                         
                         <AnimatePresence>
                           {isOpen && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-50 w-full bg-white shadow-2xl border border-dark/5 mt-2 max-h-56 overflow-y-auto rounded-xl">
                                {filteredCities.map((city, i) => (
                                  <button key={i} type="button" onClick={() => handleCitySelect(city)} className="w-full text-left px-6 py-4 hover:bg-gold/5 border-b border-dark/5 transition-colors flex flex-col gap-0.5">
                                     <p className="text-sm font-cinzel font-bold text-dark">{city.name}</p>
                                     <p className="text-[8px] font-black text-secondary/40 uppercase tracking-widest">{city.state}</p>
                                  </button>
                                ))}
                             </motion.div>
                           )}
                         </AnimatePresence>
                         <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest ml-1">Choose your city, prices may vary !</p>
                      </div>
                      <div className="space-y-4">
                         <label className="text-2xl font-cinzel font-bold text-dark">Location</label>
                         <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-6 py-4.5 rounded-xl border border-dark/10 focus:border-dark outline-none bg-[#FAF9F6] text-dark font-medium transition-all" placeholder="Hotel/Apartment/Street" />
                         <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest ml-1">Select your meeting location</p>
                      </div>
                   </div>

                   {/* Footer Info & Button */}
                   <div className="pt-10 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
                      <div className="space-y-4 opacity-80 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                         <p>• Booking depends on availability.</p>
                         <p>
                           * By proceeding, you agree to <button type="button" onClick={() => setShowTerms(true)} className="text-gold border-b border-gold/30 hover:border-gold transition-colors">Terms and Conditions</button> of this booking.
                         </p>
                         <p>
                           * You also agree to SS Photo & Films <button type="button" onClick={() => setShowPrivacy(true)} className="text-gold border-b border-gold/30 hover:border-gold transition-colors">Privacy Policy</button> and provide consent to recieve Whatsapp communications.
                         </p>
                         <button 
                             type="button" 
                             onClick={() => setShowWhySs(true)}
                             className="flex items-center gap-1 hover:text-gold transition-all duration-300 group"
                         >
                            <span>• Why SS?</span>
                            <span className="text-gold tracking-normal lowercase ml-1 group-hover:scale-110 transition-transform">😊</span>
                         </button>
                         <p>• After payment, your booking will be under review (updated within 24 hrs).</p>
                         <p>• If the booking is rejected by our team, your money will be refunded to your source account.</p>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full max-w-sm py-6 bg-[#4A4D4A] text-white text-[12px] font-black tracking-[0.4em] uppercase rounded-xl hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group shadow-xl shadow-dark/10 disabled:opacity-50"
                      >
                         <span className="relative z-10 flex items-center justify-center">{loading ? "PROCESSING..." : "PROCEED TO PAY"}</span>
                          {/* Shimmer Effect */}
                          <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                      </button>
                   </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" className="text-center space-y-12 py-24 bg-[#f8f8f8] rounded-3xl border border-dark/5 p-16 shadow-2xl">
               <div className="flex justify-center">
                  <div className="w-24 h-24 bg-dark text-gold rounded-full flex items-center justify-center shadow-2xl shadow-dark/20">
                     <CheckCircle2 size={56} />
                  </div>
               </div>
               <h2 className="text-6xl font-cinzel font-bold text-dark uppercase tracking-tight">Booking confirmed !</h2>
               <p className="font-manrope text-[#646464] text-xs font-bold uppercase tracking-[0.3em]">We will reach out to you within 24 hours.</p>
               <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                  <button onClick={() => router.push('/client')} className="w-full md:w-auto px-12 py-5 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-dark transition-all duration-500 relative overflow-hidden group shadow-xl"><span className="relative z-10">My Dashboard</span><div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" /></button>
                  <button onClick={() => router.push('/')} className="w-full md:w-auto px-12 py-5 border-2 border-dark text-dark rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-dark hover:text-white transition-all duration-500 relative overflow-hidden group"><span className="relative z-10">Home</span><div className="absolute top-0 -left-full w-full h-full bg-dark/5 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" /></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terms Modal */}
        <AnimatePresence>
          {showTerms && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTerms(false)} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                <div className="p-8 md:p-12 overflow-y-auto">
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-tight">Terms & Conditions</h2>
                      <button onClick={() => setShowTerms(false)} className="text-dark/20 hover:text-dark transition-colors text-3xl font-light">×</button>
                   </div>
                   <div className="space-y-8 text-sm text-secondary/80 leading-relaxed font-manrope">
                      <p className="font-bold text-dark">Effective Date: April 01, 2026</p>
                      <p>Welcome to SS Photo & Films. By booking our services or using our website/platform, you agree to the following terms and conditions. If you do not agree, do not proceed with our services.</p>
                      
                      <div className="space-y-6">
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">1. Services</h4>
                          <p>SS Photo & Films provides photography and videography services including pre-wedding shoots, weddings, events, and cinematic storytelling. We commit to delivering high-quality visual content and professional conduct.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">2. Booking & Payment</h4>
                          <p>A non-refundable booking amount (advance) is required to confirm your slot. The remaining amount must be paid before the shoot or as per the agreed schedule. ⚠️ No full payment = No final delivery.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">3. Cancellation & Rescheduling</h4>
                          <p>Cancellation by client: Advance is non-refundable. Rescheduling is allowed only if informed at least 48 hours prior and is subject to availability.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">4. Delivery & Turnaround</h4>
                          <p>Only selected & edited photos/videos will be delivered. Raw files are not included by default and are available at extra cost if agreed.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">5. Copyright & Usage</h4>
                          <p>All content is owned by SS Photo & Films. Client receives a personal usage license only. You cannot sell or modify content without permission.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">6. Promotional Usage</h4>
                          <p>SS Photo & Films reserves the right to use photos/videos for portfolio, website, and social media promotions. If you don’t want this, you must inform before the shoot.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">7. Liability</h4>
                          <p>We are not responsible for weather issues, location restrictions, or client delays. In case of technical failure, liability is limited to a refund of amount paid.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">8. Client Responsibility</h4>
                          <p>You are responsible for venue permissions and safety of the team at the location. Any damage caused by client/guests is the client's liability.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">9. External Payments</h4>
                          <p>No direct payments to team members. All payments must go through official SS Photo & Films channels. Violation counts as a breach of agreement.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">10. Force Majeure</h4>
                          <p>We are not liable for delays or cancellations due to natural disasters, government restrictions, or uncontrollable accidents.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">11. Communication</h4>
                          <p>Official communication happens via WhatsApp, Call, or Email. Clients must stay reachable.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">12. Governing Law</h4>
                          <p>These terms are governed by the laws of India (Maharashtra jurisdiction).</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">13. Acceptance</h4>
                          <p>By booking our services, you confirm that you have read, understood, and agreed to all terms.</p>
                        </section>
                      </div>
                   </div>
                   <div className="mt-12 pt-8 border-t border-dark/5 flex justify-center">
                      <button onClick={() => setShowTerms(false)} className="px-10 py-4 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-dark transition-all duration-500">I UNDERSTAND</button>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Privacy Modal */}
        <AnimatePresence>
          {showPrivacy && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPrivacy(false)} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                <div className="p-8 md:p-12 overflow-y-auto">
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-cinzel font-bold text-dark uppercase tracking-tight">Privacy Policy</h2>
                      <button onClick={() => setShowPrivacy(false)} className="text-dark/20 hover:text-dark transition-colors text-3xl font-light">×</button>
                   </div>
                   <div className="space-y-8 text-sm text-secondary/80 leading-relaxed font-manrope">
                      <p>At SS Photo & Films, your privacy matters. This policy explains what information we collect, how we use it, and how we protect it.</p>
                      
                      <div className="space-y-6">
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">1. Information We Collect</h4>
                          <p>Personal info (Name, Phone, Email, Location) and Project info (Event details, preferences). We also store the media content captured during shoots.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">2. How We Use It</h4>
                          <p>To manage bookings, communicate, deliver content, and improve our services.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">3. Communication</h4>
                          <p>We may contact you via WhatsApp, Phone, or Email regarding your project.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">4. Media Usage</h4>
                          <p>Photos/videos may be used for portfolio/social media. If you don't want this, inform us before the shoot.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">5. Data Protection</h4>
                          <p>We take reasonable steps to protect data, but we are not liable for external breaches beyond our control.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">6. Sharing</h4>
                          <p>We do not sell your data. Shared only with necessary team members or delivery platforms for project completion.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">7. Data Storage</h4>
                          <p>We store media digitally but do not guarantee permanent storage. Client must back up delivered files.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">8. Cookies</h4>
                          <p>Basic cookies may be used for website functionality.</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">9. Your Rights</h4>
                          <p>You can request access, correction, or deletion (subject to project completion).</p>
                        </section>
                        <section>
                          <h4 className="font-bold text-dark uppercase tracking-widest text-[10px] mb-2">10. Updates</h4>
                          <p>We may update this policy. Continued use equals acceptance.</p>
                        </section>
                      </div>
                   </div>
                   <div className="mt-12 pt-8 border-t border-dark/5 flex justify-center">
                      <button onClick={() => setShowPrivacy(false)} className="px-10 py-4 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-dark transition-all duration-500">I UNDERSTAND</button>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Why SS Modal */}
        <AnimatePresence>
          {showWhySs && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowWhySs(false)}
                className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              >
                <div className="p-8 md:p-12 overflow-y-auto">
                   <div className="flex items-center justify-between mb-10">
                      <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-dark uppercase tracking-tight">Why SS? <span className="text-gold italic">😊</span></h2>
                      <button onClick={() => setShowWhySs(false)} className="text-dark/20 hover:text-dark transition-colors text-3xl font-light">×</button>
                   </div>

                   <div className="space-y-10">
                      {[
                        { 
                          title: "Candid Sanskruti Moments", 
                          desc: "We also bring the spirit of Candid Sanskruti into our shoots, capturing precious, trending, and relatable moments that resonate beyond the frame." 
                        },
                        { 
                          title: "Signature-Style Experience", 
                          desc: "A signature-style photoshoot delivering 10–15 artistically crafted images and a high-impact reel, designed for standout social media presence and captured with a refined documentary aesthetic." 
                        },
                        { 
                          title: "Artist-Level Creativity", 
                          desc: "Each image is created with intentional composition, premium styling direction, and a focus on visual storytelling rather than basic posing." 
                        },
                        { 
                          title: "High-Impact Social Media Presence", 
                          desc: "Your reel is crafted to instantly capture attention, boost engagement, and present your personality or brand with a cinematic feel." 
                        },
                        { 
                          title: "Refined Documentary Approach", 
                          desc: "We focus on genuine emotions, natural interactions, and unscripted moments—resulting in visuals that feel authentic, elegant, and timeless." 
                        },
                        { 
                          title: "Premium Editing & Finishing", 
                          desc: "Every delivered image receives high-quality artistic editing that enhances mood, colors, and details without looking artificial." 
                        },
                        { 
                          title: "Tailored Shooting Experience", 
                          desc: "The session is customized to your style, comfort level, and the mood you want, ensuring results that feel personal and premium." 
                        }
                      ].map((item, i) => (
                        <div key={i} className="group">
                           <h4 className="text-sm font-bold text-dark uppercase tracking-widest mb-3 flex items-center gap-4">
                              <span className="text-gold tracking-normal">0{i+1}</span>
                              {item.title}
                           </h4>
                           <p className="text-sm text-secondary/70 leading-relaxed font-manrope font-medium">{item.desc}</p>
                        </div>
                      ))}
                   </div>

                   <div className="mt-12 pt-8 border-t border-dark/5 flex justify-center">
                      <button 
                        onClick={() => setShowWhySs(false)}
                        className="px-10 py-4 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-dark transition-all duration-500"
                      >
                        CLOSE
                      </button>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notifications */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col space-y-3 pointer-events-none">
           <AnimatePresence>
              {notifications.map(n => (
                 <motion.div key={n.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className={`flex items-center space-x-3 px-6 py-4 rounded-full shadow-2xl pointer-events-auto border ${n.type === 'success' ? 'bg-[#D1FAE5] text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                    {n.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-rose-500" />}
                    <span className="text-[11px] font-black uppercase tracking-widest">{n.message}</span>
                 </motion.div>
              ))}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-white font-manrope overflow-x-hidden">
      <Navbar transparentDarkText={true} />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-cinzel text-xl text-dark">Initialing Premium Booking Engine...</div>}>
        <BookingFormContent />
      </Suspense>
      <Footer />
    </main>
  );
}
