"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBookingWithInstallments } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ShieldCheck, CreditCard, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (params.id) {
        try {
          const data = await getBookingWithInstallments(params.id as string);
          setBooking(data);
          setLoading(false);
        } catch (err) {
          console.error("Fetch error:", err);
        }
      }
    };
    fetchBooking();

    // Load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [params.id]);

  const handlePayment = async () => {
    if (!booking) return;
    setPaying(true);

    try {
      const resp = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: booking.amount,
          bookingId: booking.id
        }),
      });
      
      const order = await resp.json();
      
      if (!order.id) throw new Error(order.error || "Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SYEI1vEJHBLf2D',
        amount: order.amount,
        currency: order.currency,
        name: "SS PHOTO & FILMS",
        description: `${booking.eventType}: ${booking.packageType}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            setPaying(true);
            const verifyResp = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, bookingId: booking.id }),
            });

            if (verifyResp.ok) {
              router.push('/client'); // Or a success page
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            alert("Payment successful, but sync failed. Our team will contact you.");
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: booking.clientName,
          email: booking.email,
          contact: booking.phone
        },
        theme: { color: "#FF2D55" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (err: any) {
      alert(`Payment Error: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-cinzel">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-dark/10 border-t-gold rounded-full animate-spin" />
        <p className="text-xs font-bold tracking-[0.3em] text-dark/30 uppercase">Securing Session...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white font-manrope pt-[160px] pb-32">
      <Navbar transparentDarkText={true} />
      
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold text-[#4A4D4A] tracking-wider mb-2 uppercase text-center">
            Payment<span className="text-gold">.</span>
          </h1>
          <p className="text-[#646464] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] opacity-80">
            THAT WAS REALLY QUICK <span className="text-dark">YOUR PHOTOSHOOT IS JUST SOME BUCKS AWAY 😍</span>
          </p>
        </div>

        {/* Improved Summary Card (Wider & One-Page Focused) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-white rounded-[40px] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.08)] border border-dark/5 p-10 md:p-12 relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left Column: Shoot Details */}
            <div className="flex-1 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-xs md:text-sm font-black text-[#646464] uppercase tracking-widest leading-relaxed">
                    {booking.eventType} SHOOT AT {booking.location.split(',').pop()?.trim().toUpperCase()}, PLAN:
                  </h2>
                  <h3 className="text-6xl md:text-7xl font-cinzel font-bold text-dark leading-tight">
                    {booking.packageType}<span className="text-[#FF2D55]">.</span>
                  </h3>
               </div>

               <div className="space-y-6">
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest italic decoration-gold underline-offset-8 underline">Photography Only</p>
                  <ul className="space-y-3">
                    {booking.packageFeatures.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-1 h-1 bg-dark mt-2 rounded-full shrink-0" />
                        <span className="text-xs md:text-sm font-medium text-dark/70 leading-relaxed uppercase tracking-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] font-black text-dark/40 uppercase tracking-widest pt-4">1 Photographer with Prime lens and lights on Full Frame Camera</p>
               </div>
            </div>

            {/* Right Column: Pricing & Payment */}
            <div className="w-full lg:w-[350px] space-y-10 flex flex-col justify-between">
               <div className="space-y-8">
                  {/* Amount Section with Breakdown */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-dark/40 uppercase tracking-widest">Pricing Breakdown:</p>
                      <div className="flex justify-between items-center text-xs font-bold text-dark/60">
                        <span>Base Package</span>
                        <span>₹{(booking.amount - (booking.travelCharges || 0)).toLocaleString('en-IN')}</span>
                      </div>
                      {booking.travelCharges > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold text-[#FF2D55]">
                          <span>Traveling Charges</span>
                          <span>+ ₹{booking.travelCharges.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-dark/10 space-y-2">
                      <p className="text-xs font-black text-[#FF2D55] uppercase tracking-widest">Total Amount:</p>
                      <p className="text-6xl font-cinzel font-bold text-dark tracking-tighter">₹{booking.amount.toLocaleString('en-IN')}</p>
                    </div>

                    {booking.travelCharges > 0 && (
                      <p className="text-[9px] font-bold text-dark/30 uppercase tracking-widest italic">
                        * Traveling charges applied for shoot outside base location.
                      </p>
                    )}
                  </div>

                  {/* Shoot Info Summary */}
                  <div className="space-y-4 pt-8 border-t border-dark/5">
                    <p className="text-[10px] font-black text-[#646464] uppercase tracking-widest">Booking Info:</p>
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-dark uppercase">{booking.clientName}</p>
                      <p className="text-[11px] font-medium text-secondary truncate">{booking.email}</p>
                      <p className="text-[11px] font-bold text-dark uppercase mt-2">{new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p className="text-[10px] font-medium text-secondary/60 leading-relaxed uppercase">{booking.location}</p>
                    </div>
                  </div>
               </div>

               {/* Pay Now Button (Premium Shimmer) */}
               <div className="space-y-6">
                  <button 
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full bg-[#FF2D55] text-white py-6 rounded-xl text-[12px] font-black tracking-[0.4em] uppercase hover:bg-dark transition-all duration-500 relative overflow-hidden group shadow-2xl shadow-red-500/20 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {paying ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Pay Now</span>
                          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </span>
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 -left-full w-full h-full bg-white/10 skew-x-[45deg] group-hover:left-[200%] transition-all duration-1000 z-0" />
                  </button>

                  <div className="flex flex-col items-center gap-3 py-4 border-t border-dark/5 mt-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">100% Safe & Secure Payment</span>
                    </div>
                    <p className="text-[10px] text-dark/40 font-bold uppercase tracking-widest text-center leading-relaxed">
                      * All bookings are subject to final approval within 24 hours. <br/>
                      Full refund will be issued if the slot is not available or rejected.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
