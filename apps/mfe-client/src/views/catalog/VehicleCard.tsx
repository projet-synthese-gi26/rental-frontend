/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Users, Gauge, Settings, ArrowRight, Clock, CalendarDays } from 'lucide-react';

interface VehicleCardProps {
  vehicle: any;
  categoryName: string;
  onViewDetails: (id: string) => void; // Prop strictement typée
}

export const VehicleCard = ({ vehicle, categoryName, onViewDetails }: VehicleCardProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="h-40 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        <img 
          src={vehicle.images?.[0] || '/car.png'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          alt="car" 
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-[8px] font-black text-[#0528d6]  italic shadow-sm">
          {vehicle.statut}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1 text-left">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight italic truncate">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-[8px] font-black text-slate-500 dark:text-slate-400  tracking-widest mt-1">
            {categoryName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
           <div className="text-left border-r border-slate-200 dark:border-slate-700">
              <p className="text-[7px] font-black text-slate-500 dark:text-slate-400  leading-none mb-1 flex items-center gap-1"><Clock size={8}/> Par heure</p>
              <p className="text-sm font-black text-[#0528d6]">{vehicle.pricing?.pricePerHour?.toLocaleString()} <span className="text-[8px]">XAF</span></p>
           </div>
           <div className="text-right pl-2">
              <p className="text-[7px] font-black text-slate-500 dark:text-slate-400  leading-none mb-1 flex items-center gap-1 justify-end"><CalendarDays size={8}/> Par jour</p>
              <p className="text-sm font-black text-[#0528d6]">{vehicle.pricing?.pricePerDay?.toLocaleString()} <span className="text-[8px]">XAF</span></p>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-1 py-3 border-t border-slate-50 dark:border-slate-800 mb-4">
          <div className="flex flex-col items-center"><Users size={12} className="text-slate-400 mb-1"/><span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{vehicle.places} pl.</span></div>
          <div className="flex flex-col items-center border-x border-slate-50 dark:border-slate-800"><Gauge size={12} className="text-slate-400 mb-1"/><span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{vehicle.transmission?.substring(0,3)}</span></div>
          <div className="flex flex-col items-center"><Settings size={12} className="text-slate-400 mb-1"/><span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{vehicle.engineDetails?.type?.substring(0,4)}</span></div>
        </div>

        <button 
          onClick={() => onViewDetails(vehicle.id)} 
          className="mt-auto w-full py-3 bg-slate-900 dark:bg-white dark:text-[#0528d6] text-white rounded-xl font-black text-[9px]  tracking-widest hover:bg-[#0528d6] hover:text-white transition-all flex items-center justify-center gap-2 italic shadow-md"
        >
          Voir détails <ArrowRight size={12}/>
        </button>
      </div>
    </div>
  );
};