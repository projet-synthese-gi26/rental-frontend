// FILE: apps/mfe-agency/src/views/NotificationsView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Bell, Check, Clock, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { notifService } from '@pwa-easy-rental/shared-services';

export const NotificationsView = ({ agencyId }: { agencyId: string }) => {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = async (silent = false) => {
    if (!agencyId) return;
    if (!silent) setLoading(true);
    try {
      const res = await notifService.getAgencyNotifications(agencyId);
      if (res.ok) setNotifs(res.data ||[]);
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

  if (loading && notifs.length === 0) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#0528d6]" size={40}/>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 text-left">
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h2 className="text-3xl font-[900] italic tracking-tighter uppercase text-slate-900 dark:text-white">Activité de l&apos;agence</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Alertes et événements opérationnels</p>
        </div>
        <button onClick={() => loadNotifs(false)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:text-[#0528d6] transition-all">
          <Clock size={20}/>
        </button>
      </div>

      {notifs.length === 0 ? (
        <div className="p-20 text-center bg-white dark:bg-[#1a1d2d] rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
          <Bell className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">Aucune notification pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifs.map((n) => (
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