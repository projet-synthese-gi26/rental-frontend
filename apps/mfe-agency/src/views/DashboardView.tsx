/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { 
  Car, Key, Users, Calendar, 
  ArrowRight, AlertCircle, Clock, Building2
} from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const DashboardView = ({ userData, agencyData, stats }: any) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="bg-white dark:bg-[#1a1d2d] p-10 rounded-[2.5rem] border-b-4 border-slate-200 dark:border-slate-800 shadow-sm text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-10 pointer-events-none">
          <Building2 size={150} className="text-[#0528d6]" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Bonjour, {userData?.firstname}
          </h1>
          <p className="text-slate-400 mt-2 italic text-sm max-w-md">
            Console opérationnelle activée pour l&apos;agence <span className="text-[#0528d6] font-bold">{agencyData?.name}</span>. 
            Suivez vos véhicules et réservations en temps réel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Flotte Agence" value={stats.vehicles} icon={<Car />} />
        <StatCard label="Chauffeurs" value={stats.drivers} icon={<Users />} />
        <StatCard label="En cours" value="0" icon={<Key className="text-green-500" />} />
        <StatCard label="Alertes" value="0" icon={<AlertCircle className="text-orange-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2d] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 italic">
              <Calendar size={18} className="text-[#0528d6]" /> Réservations récentes
            </h3>
            <button className="text-[10px] font-bold text-[#0528d6] uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          <div className="p-12 text-center">
             <div className="size-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Clock size={32} />
             </div>
             <p className="text-slate-400 text-sm italic font-medium">Aucune activité enregistrée sur les dernières 24h.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0528d6] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
             <h4 className="font-bold mb-4 italic uppercase text-xs tracking-widest opacity-80">Rappel Sécurité</h4>
             <p className="text-sm font-medium leading-relaxed opacity-90">
               Vérifiez systématiquement l&apos;état des véhicules et la validité des documents avant chaque départ.
             </p>
             <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
                Check-list départ <ArrowRight size={14} />
             </button>
          </div>

          <div className="bg-white dark:bg-[#1a1d2d] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
             <h4 className="font-bold mb-6 text-slate-900 dark:text-white italic text-sm">Disponibilité Flotte</h4>
             <div className="space-y-5">
                <ProgressItem label="En service" percent={0} color="bg-[#0528d6]" />
                <ProgressItem label="Maintenance" percent={0} color="bg-orange-500" />
                <ProgressItem label="Disponible" percent={100} color="bg-green-500" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressItem = ({ label, percent, color }: any) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 italic">
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className="h-1.5 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
        </div>
    </div>
);