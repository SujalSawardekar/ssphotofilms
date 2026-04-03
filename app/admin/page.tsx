"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { getBookings, getQueries, getTeamApplications } from '@/lib/db';
import { Booking, ClientQuery, TeamApplication } from '@prisma/client';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { User, Clock, CheckCircle2, MessageSquare, Users, Home } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [teamApps, setTeamApps] = useState<TeamApplication[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const [allBookings, allQueries, allTeamApps] = await Promise.all([
        getBookings(),
        getQueries(),
        getTeamApplications()
      ]);
      setBookings(allBookings);
      setQueries(allQueries);
      setTeamApps(allTeamApps);
    };
    fetchAdminData();
  }, []);

  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;
  const acceptedBookingsCount = bookings.filter(b => b.status === 'Confirmed').length;
  const openQueriesCount = queries.filter(q => q.status === 'Open').length;
  const teamAppsCount = teamApps.filter(a => a.status === 'Pending').length;

  const eventsDoneCount = bookings.filter(b => b.status === 'Confirmed' && new Date(b.eventDate) < new Date()).length;

  const recentBookings = bookings.slice(0, 3);
  const recentQueries = queries.slice(0, 3);

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <section className="bg-[#F2EFEB] py-14 text-center w-full border-b border-dark/5">
        <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-[#4A4A4A] tracking-wider mb-3">
          DASHBOARD
        </h1>
        <p className="text-[#646464] text-xs uppercase tracking-[0.2em] font-medium font-cinzel">
          WELCOME BACK, {user?.name?.toUpperCase() || 'SHREYAS SAWARDEKAR'}
        </p>
      </section>

      {/* 5-Column Stats */}
      <section className="bg-white px-8 py-10 border-b border-dark/5">
        <div className="flex items-center justify-between divide-x divide-dark/10">
          {[
            { label: "Total Bookings",    count: totalBookingsCount,    icon: User,          color: "text-[#B36F4E]" },
            { label: "Queries",           count: queries.length,        icon: MessageSquare, color: "text-[#20AEE5]" },
            { label: "Events Done",       count: eventsDoneCount,       icon: CheckCircle2,  color: "text-emerald-500" },
            { label: "Team Applications", count: teamAppsCount,         icon: Users,         color: "text-[#76277B]" }
          ].map((stat, idx) => (
            <div key={idx} className="flex-1 px-4 flex flex-col items-center text-center space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-dark">{stat.count}</span>
                <stat.icon size={24} className={stat.color} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-dark">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Feed */}
      <section className="flex-1 px-8 py-10 flex gap-8">
        {/* Recent Bookings */}
        <div className="w-1/2 bg-white rounded-xl border border-dark/10 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-cinzel text-dark">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-xs text-[#B36F4E] font-bold uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="space-y-6">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between">
                <div>
                  <p className="font-cinzel text-dark">{b.clientName}</p>
                  <p className="text-xs text-secondary mt-1">{b.eventDate?.split('at')[0]?.trim()} • {b.location?.split(',')[0]}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded ${
                  b.status === 'Pending' ? 'bg-[#FCF3D7] text-[#D89326]' :
                  b.status === 'Confirmed' ? 'bg-[#D2F4DE] text-[#24955F]' :
                  'bg-[#FCDED9] text-[#D0312D]'
                }`}>
                  {b.status === 'Confirmed' ? 'Accepted' : b.status}
                </span>
              </div>
            ))}
            {recentBookings.length === 0 && <p className="text-secondary/50 text-sm text-center py-8">No bookings yet.</p>}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="w-1/2 bg-white rounded-xl border border-dark/10 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-cinzel text-dark">Recent Queries</h3>
            <Link href="/admin/queries" className="text-xs text-[#B36F4E] font-bold uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="space-y-6">
            {recentQueries.map(q => (
              <div key={q.id} className="flex items-center justify-between">
                <div>
                  <p className="font-cinzel text-dark">{q.name}</p>
                  <p className="text-xs text-secondary mt-1">{q.date} • {q.email}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded ${
                  q.status === 'Open' ? 'bg-[#EAE5FA] text-[#7155C1]' : 'bg-[#E0E8FA] text-[#3462C6]'
                }`}>
                  {q.status}
                </span>
              </div>
            ))}
            {recentQueries.length === 0 && <p className="text-secondary/50 text-sm text-center py-8">No queries yet.</p>}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
