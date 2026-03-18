// FILE: apps/mfe-organisation/src/views/agencies/AgencyCard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { MapPin, Phone, Mail, Trash2, Edit3, Info, Clock } from 'lucide-react';

export const AgencyCard = ({ agency, onEdit, onDelete, onView }: any) => (
  <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col h-full text-left">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0528d6] text-white flex items-center justify-center font-black text-2xl italic shadow-lg shadow-blue-600/20 shrink-0 overflow-hidden border-2 border-slate-100 dark:border-slate-700">
          {agency.logoUrl ? <img src={agency.logoUrl} alt="logo" className="w-full h-full object-cover"/> : agency.name.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight  italic tracking-tighter truncate" title={agency.name}>
            {agency.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-[#0528d6]">
            <MapPin size={12} className="shrink-0" />
            <span className="text-[10px] font-black  tracking-widest italic truncate">
              {agency.city}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0 items-end">
        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black  tracking-widest italic border flex items-center gap-1 ${agency.is24Hours ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
          <Clock size={10} /> {agency.is24Hours ? '24H/24' : 'LIMITÉ'}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(agency)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#0528d6] rounded-xl transition-all shadow-sm"><Edit3 size={14}/></button>
            <button onClick={() => onDelete(agency.id)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-sm"><Trash2 size={14}/></button>
        </div>
      </div>
    </div>
    
    <div className="space-y-3 mb-8 pt-4 border-t border-slate-50 dark:border-slate-800">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 italic overflow-hidden">
        <Mail size={14} className="text-slate-300 shrink-0" /> 
        <span className="truncate">{agency.email}</span>
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 italic overflow-hidden">
        <Phone size={14} className="text-slate-300 shrink-0" /> 
        <span className="truncate">{agency.phone}</span>
      </div>
    </div>

    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
      <button onClick={() => onView(agency.id)} className="w-full py-3 bg-slate-900 text-white dark:bg-white dark:text-[#0528d6] rounded-xl text-[10px] font-black  italic tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-md">
          <Info size={16}/> Détails & Opérations
      </button>
    </div>
  </div>
);