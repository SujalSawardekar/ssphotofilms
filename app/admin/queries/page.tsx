"use client";

import React, { useEffect, useState } from 'react';
import { getQueries, addQueryMessage, updateQueryStatus, markQueryMessagesAsSeen } from '@/lib/db';
import { ClientQuery, ClientQueryMessage } from '@prisma/client';
import Footer from '@/components/Footer';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Clock, 
  User, 
  CheckCheck,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type QueryWithMessages = ClientQuery & { messages: ClientQueryMessage[] };

export default function QueriesManagement() {
  const [queries, setQueries] = useState<QueryWithMessages[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<QueryWithMessages | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const data = await getQueries();
      setQueries(data);
      if (selectedQuery) {
        const updated = data.find(q => q.id === selectedQuery.id);
        if (updated) {
          setSelectedQuery(updated);
          // Mark as seen if there are client messages
          if (updated.messages.some((m: ClientQueryMessage) => m.sender === 'client' && m.status === 'sent')) {
            markQueryMessagesAsSeen(updated.id, 'admin').then(() => fetchQueries());
          }
        }
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedQuery) return;

    const text = replyText.trim();
    setReplyText('');

    try {
       await addQueryMessage(selectedQuery.id, text, 'admin');
       await fetchQueries();
    } catch (err) {
       console.error("Send failed:", err);
       alert("Failed to send message.");
    }
  };

  const filteredQueries = queries.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#E5DDD5]">
      {/* Header */}
      <section className="bg-white py-8 px-8 border-b border-dark/5 flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-cinzel font-bold text-dark tracking-tight">MESSAGE CENTER</h1>
            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Active Client Consultations</p>
         </div>
         <div className="flex items-center space-x-6">
            <div className="text-right">
               <p className="text-xs font-bold text-dark uppercase tracking-widest">Global Status</p>
               <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center justify-end">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                  All Systems Operational
               </p>
            </div>
         </div>
      </section>

      <div className="flex-1 flex overflow-hidden max-h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-dark/10 flex flex-col">
           <div className="p-4 bg-[#F0F2F5]">
              <div className="relative">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                 <input 
                    type="text" 
                    placeholder="Search messages..."
                    className="w-full bg-white rounded-lg py-2 pl-10 pr-4 text-xs font-medium outline-none border-none ring-1 ring-dark/5"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto divide-y divide-dark/5">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                   <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                </div>
              ) : filteredQueries.length === 0 ? (
                <div className="text-center p-12 space-y-4 opacity-40">
                   <MessageSquare className="mx-auto" size={32} />
                   <p className="text-[10px] font-bold uppercase tracking-widest">No Conversations</p>
                </div>
              ) : (
                filteredQueries.map(q => (
                  <button 
                    key={q.id}
                    onClick={() => setSelectedQuery(q)}
                    className={`w-full text-left p-4 flex items-start space-x-4 transition-all hover:bg-[#F5F6F6] ${
                      selectedQuery?.id === q.id ? 'bg-[#EBEBEB]' : ''
                    }`}
                  >
                     <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center rounded-full shrink-0 font-bold font-cinzel">
                        {q.name.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                           <h3 className="font-bold text-dark text-sm truncate uppercase tracking-wider">{q.name}</h3>
                           <span className="text-[10px] text-secondary font-medium">{q.date}</span>
                        </div>
                        <p className="text-xs text-secondary truncate">
                           {q.messages.length > 0 ? q.messages[q.messages.length-1].text : q.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                           <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                             q.status === 'Open' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                           }`}>
                              {q.status}
                           </span>
                           {q.status === 'Answered' && <CheckCheck size={14} className="text-blue-500" />}
                        </div>
                     </div>
                  </button>
                ))
              )}
           </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col relative">
           <AnimatePresence mode="wait">
             {selectedQuery ? (
               <motion.div 
                 key={selectedQuery.id}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex-1 flex flex-col h-full bg-[#E5DDD5] relative"
                 style={{ backgroundImage: 'url("https://w7.pngwing.com/pngs/422/126/png-transparent-whatsapp-background-thumbnail.png")', backgroundRepeat: 'repeat', backgroundSize: '400px', backgroundBlendMode: 'overlay', opacity: 0.9 }}
               >
                  {/* Chat Header */}
                  <div className="bg-[#F0F2F5] px-6 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gold text-dark flex items-center justify-center rounded-full font-bold font-cinzel shadow-sm">
                           {selectedQuery.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="font-bold text-sm uppercase tracking-wider text-dark">{selectedQuery.name}</h3>
                           <p className="text-[10px] text-secondary font-medium truncate max-w-[200px]">{selectedQuery.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-6 text-secondary">
                        <MoreVertical size={20} className="cursor-pointer hover:text-dark transition-colors" />
                     </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                     <div className="max-w-[85%] mx-auto text-center mb-6">
                        <span className="bg-[#D9F1FD] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-dark shadow-sm rounded-md">
                           Inquiry Initiated: {selectedQuery.date}
                        </span>
                     </div>

                     {/* First Message (The Inquiry) */}
                     <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[70%] relative group">
                           <p className="text-sm text-dark leading-relaxed font-manrope">{selectedQuery.message}</p>
                           <div className="text-right mt-1">
                              <span className="text-[9px] text-secondary/60 font-medium uppercase">{selectedQuery.date}</span>
                           </div>
                        </div>
                     </div>

                     {/* Threaded Messages */}
                     {selectedQuery.messages.map((msg: ClientQueryMessage) => (
                       <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-lg shadow-sm max-w-[70%] relative group ${
                            msg.sender === 'admin' ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'
                          }`}>
                             <p className="text-sm text-dark font-manrope leading-relaxed">{msg.text}</p>
                             <div className="flex items-center justify-end space-x-1 mt-1">
                                <span className="text-[9px] text-secondary/60 font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {msg.sender === 'admin' && (
                                  <div className="flex items-center ml-1">
                                     {msg.status === 'seen' ? (
                                       <CheckCheck size={14} className="text-[#34B7F1]" />
                                     ) : (
                                       <CheckCheck size={14} className="text-secondary/40" />
                                     )}
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Message Input */}
                  <div className="bg-[#F0F2F5] p-4 z-10">
                     <form onSubmit={handleSendMessage} className="flex items-center space-x-4 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                           <input 
                              type="text" 
                              placeholder="Type a message..."
                              className="w-full bg-white rounded-full py-3 px-6 text-sm font-medium outline-none border-none shadow-sm focus:ring-1 focus:ring-emerald-500 transition-all"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                           />
                        </div>
                        <button 
                           type="submit"
                           disabled={!replyText.trim()}
                           className="w-12 h-12 bg-[#20AEE5] hover:bg-[#1A8DBA] text-white flex items-center justify-center rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                           <Send size={20} />
                        </button>
                     </form>
                  </div>
               </motion.div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-8 bg-[#F8F9FA] opacity-60">
                  <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center">
                     <MessageSquare size={64} className="text-gold" />
                  </div>
                  <div className="space-y-4 max-w-xs">
                     <h2 className="text-2xl font-cinzel font-bold text-dark uppercase tracking-tight">Select a Chat</h2>
                     <p className="text-secondary text-xs font-bold uppercase tracking-widest leading-loose">
                        Choose a client conversation from the list to begin or continue the story.
                     </p>
                  </div>
                  <div className="pt-10 flex items-center text-[10px] text-secondary/50 font-bold uppercase tracking-[0.4em]">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
                     Secure Admin Portal
                  </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

