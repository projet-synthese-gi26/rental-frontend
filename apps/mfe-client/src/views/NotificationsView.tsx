/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';

export const NotificationsView = ({ userData, onBack }: any) => {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await (orgService as any).getNotificationsByClient(userData.id);
      if (res.ok) setNotifs(res.data || []);
    } finally { setLoading(false); }
  };

  const handleMarkRead = async (id: string) => {
    const res = await (orgService as any).markNotificationAsRead(id);
    if (res.ok) loadNotifications();
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#0f1323]"><Loader2 className="animate-spin text-[#0528d6]" size={48} /></div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 pb-20 px-6 text-left">
      <div className="sticky top-20 z-[40] -mx-6 px-6 py-5 bg-[#f4f7fe]/95 dark:bg-[#0f1323]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase hover:text-[#0528d6] transition-all italic">
          <ArrowLeft size={14} /> Retour
        </button>
        <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] italic">Centre de messages</h4>
      </div>

      <div className="mt-20 space-y-8">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">Notifications</h2>

        <div className="space-y-4">
          {notifs.length > 0 ? notifs.map((n: any) => (
            <div 
              key={n.id} 
              className={`p-6 rounded-[2rem] border transition-all flex items-start gap-6 ${n.isRead ? 'bg-white/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-[#1a1d2d] border-[#0528d6]/20 shadow-lg shadow-blue-600/5'}`}
            >
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-slate-50 text-slate-300' : 'bg-blue-50 text-[#0528d6]'}`}>
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 italic tracking-widest">{new Date(n.createdAt).toLocaleString()}</span>
                  {!n.isRead && (
                    <button onClick={() => handleMarkRead(n.id)} className="text-[9px] font-black uppercase text-[#0528d6] hover:underline italic">Marquer comme lu</button>
                  )}
                </div>
                <h5 className={`font-bold text-sm ${n.isRead ? 'text-slate-500' : 'text-slate-800 dark:text-white'}`}>{n.reason}</h5>
                <p className="text-xs text-slate-400 mt-1 italic font-medium leading-relaxed">{n.details}</p>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center bg-white dark:bg-[#1a1d2d] rounded-[3rem] border border-slate-100">
               <CheckCircle2 size={40} className="mx-auto text-slate-100 mb-4" />
               <p className="text-slate-400 font-bold italic uppercase text-xs">Aucune notification pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};