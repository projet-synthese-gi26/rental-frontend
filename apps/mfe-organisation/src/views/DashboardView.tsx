/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { 
  Store, Zap, BarChart3, Users, Car, Target, TrendingUp, 
  Activity, PieChart, CalendarCheck, Wallet, ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { statsService } from '@pwa-easy-rental/shared-services';
import { KpiCard } from '../components/KpiCard';

export const DashboardView = ({ orgData }: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgData?.id) {
      statsService.getOrgDashboard(orgData.id).then(res => {
        if (res.ok) setData(res.data);
        setLoading(false);
      });
    }
  }, [orgData?.id]);

  if (loading || !data) return <div className="h-96 flex items-center justify-center"><Activity className="animate-spin text-[#0528d6]" size={40}/></div>;

  const { summary, revenueEvolution, rentalEvolution, vehicleStatusDistribution, rentalStatusDistribution, agencyComparison } = data;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* 1. GLOBAL SUMMARY (GlobalStatsDTO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Agences" value={summary.totalAgencies} icon={<Store />} />
        <KpiCard label="Véhicules Fleet" value={summary.totalVehicles} icon={<Car />} />
        <KpiCard label="Chauffeurs" value={summary.totalDrivers} icon={<Users />} />
        <KpiCard label="Staff Total" value={summary.totalStaff} icon={<UserCheck className="text-orange-500" />} />
        
        <KpiCard label="CA Global" value={`${summary.totalRevenue?.toLocaleString()} XAF`} icon={<Wallet className="text-green-500" />} highlight />
        <KpiCard label="CA Mensuel" value={`${summary.monthlyRevenue?.toLocaleString()} XAF`} icon={<BarChart3 />} />
        <KpiCard label="Locations Totales" value={summary.totalRentals} growth={`${summary.totalReservations} réservations`} icon={<Zap />} />
        <KpiCard label="En Circulation" value={summary.activeRentals} icon={<Activity className="text-blue-500" />} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. REVENUE EVOLUTION (TimeSeriesDataDTO) */}
        <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black uppercase italic tracking-tighter flex items-center gap-2 mb-8"><TrendingUp size={16} className="text-[#0528d6]"/> Évolution des Revenus</h3>
          <div className="flex items-end gap-2 h-48">
            {revenueEvolution.values.map((v: number, i: number) => (
              <div key={i} className="flex-1 bg-[#0528d6]/10 hover:bg-[#0528d6] rounded-t-lg transition-all relative group" style={{ height: `${(v / Math.max(...revenueEvolution.values)) * 100}%` }}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{v.toLocaleString()} XAF</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[8px] font-black text-slate-400 uppercase italic">
            <span>{revenueEvolution.labels[0]}</span>
            <span>{revenueEvolution.labels[revenueEvolution.labels.length - 1]}</span>
          </div>
        </div>

        {/* 3. RENTAL EVOLUTION (TimeSeriesDataDTO) */}
        <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black uppercase italic tracking-tighter flex items-center gap-2 mb-8"><CalendarCheck size={16} className="text-[#0528d6]"/> Volume de Locations</h3>
          <div className="flex items-end gap-2 h-48">
            {rentalEvolution.values.map((v: number, i: number) => (
              <div key={i} className="flex-1 bg-orange-500/10 hover:bg-orange-500 rounded-t-lg transition-all relative group" style={{ height: `${(v / Math.max(...rentalEvolution.values)) * 100}%` }}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[8px] font-black text-slate-400 uppercase italic">
            <span>{rentalEvolution.labels[0]}</span>
            <span>{rentalEvolution.labels[rentalEvolution.labels.length - 1]}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* 4. DISTRIBUTIONS (DistributionDataDTO) */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-6"><PieChart size={14} className="text-[#0528d6]"/> État du Parc</h3>
                <div className="space-y-4">
                    {Object.entries(vehicleStatusDistribution.distribution).map(([key, val]: any) => (
                        <div key={key} className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-black uppercase italic text-slate-500"><span>{key}</span><span>{val}</span></div>
                            <div className="h-1.5 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800"><div className="h-full bg-[#0528d6]" style={{ width: `${(val / summary.totalVehicles) * 100}%` }}/></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-6"><Activity size={14} className="text-orange-500"/> Statuts Locations</h3>
                <div className="space-y-4">
                    {Object.entries(rentalStatusDistribution.distribution).map(([key, val]: any) => (
                        <div key={key} className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-black uppercase italic text-slate-500"><span>{key}</span><span>{val}</span></div>
                            <div className="h-1.5 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800"><div className="h-full bg-orange-500" style={{ width: `${(val / summary.totalRentals) * 100}%` }}/></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 5. AGENCY COMPARISON (AgencyComparisonDTO) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black uppercase italic tracking-tighter flex items-center gap-2 mb-10"><Target size={18} className="text-[#0528d6]"/> Performance Comparative des Agences</h3>
          <div className="space-y-8">
            {agencyComparison.map((agency: any, idx: number) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase italic">{agency.agencyName}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flotte: {agency.totalVehicles} — Activité: {agency.totalRentals} locations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#0528d6]">{agency.revenue?.toLocaleString()} XAF</p>
                    <div className="flex items-center justify-end gap-1 text-[8px] font-black text-green-500 uppercase italic"><ArrowUpRight size={10}/> Part de marché</div>
                  </div>
                </div>
                <div className="h-3 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800"><div className="h-full bg-[#0528d6] transition-all duration-1000" style={{ width: `${(agency.revenue / summary.totalRevenue) * 100}%` }}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};