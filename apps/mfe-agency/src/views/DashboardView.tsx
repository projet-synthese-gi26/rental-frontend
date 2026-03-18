/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { 
  Car, Users, ArrowRight, Activity, 
  Building2, BarChart3, PieChart, TrendingUp, Wallet, CheckCircle
} from 'lucide-react';
import { statsService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';

export const DashboardView = ({ agencyData }: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agencyData?.id) {
      statsService.getAgencyDashboard(agencyData.id).then(res => {
        if (res.ok) setData(res.data);
        setLoading(false);
      });
    }
  }, [agencyData?.id]);

  if (loading || !data) return <div className="h-screen flex items-center justify-center"><Activity className="animate-spin text-[#0528d6]" size={32}/></div>;

  const { summary, revenueEvolution, rentalEvolution, vehicleStatusDistribution, rentalStatusDistribution } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-left">
      <div className="bg-white dark:bg-[#1a1d2d] p-10 rounded-[3rem] border-b-4 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-10 pointer-events-none"><Building2 size={150} className="text-[#0528d6]" /></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-[900] italic text-slate-900 dark:text-white tracking-tighter  leading-none">Console Opérationnelle</h1>
          <p className="text-slate-400 mt-2 italic text-sm font-medium">Agence : <span className="text-[#0528d6] font-black ">{agencyData?.name}</span></p>
        </div>
      </div>

      {/* KPI GRID (GlobalStatsDTO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Flotte Agence" value={summary.totalVehicles} icon={<Car />} />
        <StatCard label="Chauffeurs" value={summary.totalDrivers} icon={<Users />} />
        <StatCard label="Revenu Agence" value={`${summary.totalRevenue?.toLocaleString()} XAF`} icon={<Wallet className="text-[#0528d6]"/>} />
        <StatCard label="CA Mensuel" value={`${summary.monthlyRevenue?.toLocaleString()} XAF`} icon={<BarChart3 className="text-green-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EVOLUTION REVENUS (TimeSeries) */}
        <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-black  italic tracking-widest flex items-center gap-2 mb-8 text-slate-400"><TrendingUp size={14}/> Croissance CA</h3>
          <div className="flex items-end gap-1.5 h-32">
            {revenueEvolution.values.map((v: number, i: number) => (
              <div key={i} className="flex-1 bg-[#0528d6] rounded-t-md opacity-20 hover:opacity-100 transition-all cursor-help" style={{ height: `${(v / Math.max(...revenueEvolution.values)) * 100}%` }} title={`${v} XAF`} />
            ))}
          </div>
        </div>

        {/* EVOLUTION LOCATIONS (TimeSeries) */}
        <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-black  italic tracking-widest flex items-center gap-2 mb-8 text-slate-400"><Activity size={14}/> Flux Locations</h3>
          <div className="flex items-end gap-1.5 h-32">
            {rentalEvolution.values.map((v: number, i: number) => (
              <div key={i} className="flex-1 bg-orange-500 rounded-t-md opacity-20 hover:opacity-100 transition-all cursor-help" style={{ height: `${(v / Math.max(...rentalEvolution.values)) * 100}%` }} title={`${v} loc.`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DISTRIBUTIONS (DistributionDataDTO) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-10 grid md:grid-cols-2 gap-12">
            <div>
                <h3 className="font-black italic  tracking-tighter flex items-center gap-3 mb-8 text-[#0528d6]"><PieChart size={18} /> Disponibilité Parc</h3>
                <div className="space-y-5">
                    {Object.entries(vehicleStatusDistribution.distribution).map(([status, count]: any) => (
                        <div key={status} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-black  text-slate-500 italic">{status}</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-black italic  tracking-tighter flex items-center gap-3 mb-8 text-orange-500"><CheckCircle size={18} /> Statut des Dossiers</h3>
                <div className="space-y-5">
                    {Object.entries(rentalStatusDistribution.distribution).map(([status, count]: any) => (
                        <div key={status} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-black  text-slate-500 italic">{status}</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0528d6] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
             <h4 className="font-bold mb-4 italic  text-xs tracking-widest opacity-80">Indicateurs Temps Réel</h4>
             <div className="space-y-6">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black  opacity-60 mb-1">Locations Actives</p>
                    <p className="text-3xl font-black italic">{summary.activeRentals}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black  opacity-60 mb-1">Total Réservations</p>
                    <p className="text-3xl font-black italic">{summary.totalReservations}</p>
                </div>
             </div>
             <button className="mt-8 w-full flex items-center justify-center gap-2 text-[10px] font-black  tracking-tighter bg-white text-[#0528d6] py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all italic">
                Exporter le bilan mensuel <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};