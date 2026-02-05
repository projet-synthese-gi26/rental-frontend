/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Car, ArrowLeft, Loader2, Zap, ChevronRight } from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';

export const MyBookingsView = ({ userData, onBack, onSelectVehicle }: any) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await (orgService as any).getNotificationsByClient(userData.id);
        if (res.ok) setNotifications(res.data || []);
      } finally { setLoading(false); }
    };
    fetchHistory();
  }, [userData.id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#0f1323]">
      <Loader2 className="animate-spin text-[#0528d6]" size={48} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20 px-6 text-left">
      <div className="sticky top-20 z-[40] -mx-6 px-6 py-5 bg-[#f4f7fe]/95 dark:bg-[#0f1323]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase hover:text-[#0528d6] transition-all italic">
          <ArrowLeft size={14} /> Accueil
        </button>
      </div>

      <div className="space-y-8 mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">Mes locations</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Historique et contrats en cours</p>
          </div>
          <div className="flex gap-4">
             <StatMini label="Contrats" value={notifications.length} />
             <StatMini label="En cours" value="0" color="text-green-500" />
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1d2d] rounded-[3rem] p-20 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <Zap size={40} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white italic uppercase tracking-tight">Aucun contrat trouvé</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">Vos futures réservations apparaîtront ici dès validation par l&apos;agence.</p>
          </div>
        ) : (
          <div className="grid gap-6">
             {notifications.map((item: any) => (
               <div key={item.id} className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8 group">
                  <div className="size-20 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[#0528d6] shrink-0 border border-slate-100 dark:border-slate-800">
                    <Car size={32} />
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <span className="text-[10px] font-black uppercase text-[#0528d6] italic tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">ID #{item.id.substring(0,8)}</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 italic">Prévu le {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{item.reason || "Réservation de véhicule"}</h4>
                    <p className="text-xs text-slate-500 font-medium italic leading-relaxed">{item.details}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full text-[9px] font-black uppercase text-slate-500 border border-slate-100 dark:border-slate-700 italic tracking-widest">En attente</div>
                    <button 
                      onClick={() => item.vehicleId && onSelectVehicle(item.vehicleId)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase text-[#0528d6] group-hover:underline italic"
                    >
                      Détails <ChevronRight size={14} />
                    </button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatMini = ({ label, value, color = "text-[#0528d6]" }: any) => (
  <div className="bg-white dark:bg-[#1a1d2d] px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
    <span className="text-[9px] font-black uppercase text-slate-400 italic">{label}</span>
    <span className={`text-lg font-black ${color}`}>{value}</span>
  </div>
);