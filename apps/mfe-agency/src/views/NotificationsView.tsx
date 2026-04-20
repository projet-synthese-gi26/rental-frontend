// FILE: apps/mfe-agency/src/views/NotificationsView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Bell, Check, Clock, Info, AlertTriangle, Loader2, Search } from 'lucide-react';
import { notifService } from '@pwa-easy-rental/shared-services';

export const NotificationsView = ({ agencyId }: { agencyId: string }) => {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'UNREAD' | 'ALERTS'>('ALL');

  const loadNotifs = async (silent = false) => {
    if (!agencyId) return;
    if (!silent) setLoading(true);
    try {
      const res = await notifService.getAgencyNotifications(agencyId);
      if (res.ok) setNotifs(res.data || []);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(() => {
      loadNotifs(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [agencyId]);

  const handleMarkRead = async (id: string) => {
    const res = await notifService.markAsRead(id);
    if (res.ok) {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  // Filtrage intelligent
  const filteredNotifs = useMemo(() => {
    return notifs.filter(n => {
      const matchesSearch = (n.details?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                           (n.reason?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = 
        filterType === 'ALL' ? true :
        filterType === 'UNREAD' ? !n.isRead :
        filterType === 'ALERTS' ? n.reason?.includes('ALERT') : true;

      return matchesSearch && matchesFilter;
    });
  }, [notifs, searchTerm, filterType]);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  if (loading && notifs.length === 0) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#0528d6]" size={40}/>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 text-left pb-20">
      
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
        <div>
          <h2 className="text-3xl font-[900] italic tracking-tighter uppercase text-slate-900 dark:text-white">Flux d&apos;agence</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
                <div className="size-2 bg-slate-400 rounded-full"/>
                <span className="text-[10px] font-black uppercase text-slate-500 italic">Total: {notifs.length}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2 bg-[#0528d6] rounded-full animate-pulse"/>
                <span className="text-[10px] font-black uppercase text-[#0528d6] italic">Non lues: {unreadCount}</span>
            </div>
          </div>
        </div>
        <button onClick={() => loadNotifs(false)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:text-[#0528d6] transition-all border border-slate-100 dark:border-slate-800">
          <Clock size={20}/>
        </button>
      </div>

      {/* CONTROL BAR */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full lg:w-auto shrink-0">
            {[
                { id: 'ALL', label: 'Toutes' },
                { id: 'UNREAD', label: 'Non lues' },
                { id: 'ALERTS', label: 'Alertes' }
            ].map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => setFilterType(tab.id as any)}
                    className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all ${filterType === tab.id ? 'bg-white dark:bg-slate-800 text-[#0528d6] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input 
            placeholder="Rechercher par dossier, véhicule ou motif..." 
            className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-black italic outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all dark:text-white" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* LIST */}
      {filteredNotifs.length === 0 ? (
        <div className="p-20 text-center bg-white dark:bg-[#1a1d2d] rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
          <Bell className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">Aucune notification pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifs.map((n) => (
            <div 
              key={n.id} 
              className={`p-6 rounded-[2.5rem] border transition-all flex items-start gap-5 ${
                n.isRead 
                ? 'bg-white/50 dark:bg-[#1a1d2d]/50 border-slate-100 dark:border-slate-800 opacity-60' 
                : 'bg-white dark:bg-[#1a1d2d] border-blue-100 dark:border-blue-900 shadow-md border-l-4 border-l-[#0528d6]'
              }`}
            >
              <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${
                n.reason?.includes('ALERT') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#0528d6]'
              }`}>
                {n.reason?.includes('ALERT') ? <AlertTriangle size={20}/> : <Info size={20}/>}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight italic">
                    {n.reason || 'Information système'}
                  </h4>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">{n.details}</p>
                
                <div className="flex items-center gap-6">
                  {!n.isRead && (
                    <button 
                      onClick={() => handleMarkRead(n.id)} 
                      className="text-[9px] font-black uppercase text-[#0528d6] flex items-center gap-1.5 hover:underline"
                    >
                      <Check size={12}/> Marquer lu
                    </button>
                  )}
                  {n.locationId && (
                    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-tighter italic">
                      Dossier: #{n.locationId.substring(0,8)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};