/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { X, Loader2, MapPin, Clock, ShieldCheck, Globe, Target, BarChart3, Zap } from 'lucide-react';
import { Portal } from '../../components/Portal';
import { agencyService, statsService } from '@pwa-easy-rental/shared-services';

export const AgencyDetailsModal = ({ agencyId, onClose }: any) => {
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await agencyService.getAgencyDetails(agencyId);
      const statRes = await statsService.getAgencyDetailedReport(agencyId);
      if (res.ok) setData(res.data);
      if (statRes.ok) setStats(statRes.data);
      setLoading(false);
    };
    fetch();
  }, [agencyId]);

  if (loading) return <Portal><div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md"><Loader2 className="animate-spin text-white size-12" /></div></Portal>;

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 text-left">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
        <div className="relative w-full max-w-5xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/10 animate-in zoom-in">
          <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#0528d6] text-white">
            <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden shrink-0 shadow-xl">
                    <img src={data.logoUrl || `https://ui-avatars.com/api/?name=${data.name}&background=fff&color=0528d6`} className="w-full h-full object-cover" alt="logo"/>
                </div>
                <div>
                    <h3 className="text-3xl font-[900] italic tracking-tighter  leading-none">{data.name}</h3>
                    <p className="text-xs font-bold opacity-70  tracking-[0.2em] mt-2 italic flex items-center gap-2"><MapPin size={12}/> {data.city}, {data.region}</p>
                </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatBox label="Revenu Agence" value={`${stats?.totalRevenue?.toLocaleString() || 0} XAF`} icon={<BarChart3 className="text-green-500"/>} />
                <StatBox label="Locations Totales" value={stats?.totalRentals || 0} icon={<Zap className="text-orange-500"/>} />
                <StatBox label="Locations Actives" value={stats?.activeRentals || 0} icon={<Clock className="text-blue-500"/>} />
                <StatBox label="Taux Annulation" value={stats?.cancelledRentals || 0} icon={<X className="text-red-500"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black  text-[#0528d6] italic mb-8 flex items-center gap-3 border-b pb-4"><Globe size={18}/> Contact & Coordonnées</h4>
                    <div className="space-y-6">
                        <DataRow label="Adresse" value={data.address} />
                        <DataRow label="E-mail" value={data.email} />
                        <DataRow label="Téléphone" value={data.phone} />
                        <div className="pt-6 grid grid-cols-2 gap-4">
                            <DataRow label="Latitude" value={data.latitude} mono />
                            <DataRow label="Longitude" value={data.longitude} mono />
                        </div>
                    </div>
                </section>

                <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black  text-[#0528d6] italic mb-8 flex items-center gap-3 border-b pb-4"><Target size={18}/> Configuration Opérationnelle</h4>
                    <div className="space-y-6">
                        <DataRow label="Horaires" value={data.is24Hours ? "Ouvert 24h/24" : data.workingHours} />
                        <DataRow label="Rayon Geofencing" value={`${data.geofenceRadius} KM`} />
                        <DataRow label="Taux de Caution" value={`${data.depositPercentage} %`} />
                        <div className="pt-6 flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <ShieldCheck className="text-green-500" size={24}/>
                            <p className="text-[10px] font-black  text-slate-800 dark:text-white italic">Réservation en ligne autorisée</p>
                        </div>
                    </div>
                </section>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const StatBox = ({ label, value, icon }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">{icon}</div>
        <p className="text-[9px] font-black text-slate-400  italic tracking-widest">{label}</p>
        <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{value}</p>
    </div>
);

const DataRow = ({ label, value, mono }: any) => (
    <div className="flex justify-between items-center group">
        <span className="text-[10px] font-black text-slate-400  italic">{label}</span>
        <span className={`text-sm font-black text-slate-800 dark:text-slate-100 italic ${mono ? 'font-mono' : ''}`}>{value || '---'}</span>
    </div>
);