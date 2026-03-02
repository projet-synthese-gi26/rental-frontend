/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { MapPin, Phone, Mail, Trash2, Edit3, Info } from 'lucide-react';

export const AgencyCard = ({ agency, onEdit, onDelete, onView }: any) => (
  <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col h-full text-left">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#0528d6] font-black text-xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-inner">
          {agency.logoUrl ? <img src={agency.logoUrl} alt="logo" className="w-full h-full object-cover"/> : agency.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-black text-slate-900 dark:text-white leading-tight uppercase italic tracking-tighter">{agency.name}</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-1 italic tracking-widest">
            <MapPin size={12} className="text-[#0528d6]"/> {agency.city}
          </span>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onView(agency.id)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"><Info size={16}/></button>
        <button onClick={() => onEdit(agency)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#0528d6] rounded-xl transition-all shadow-sm"><Edit3 size={16}/></button>
        <button onClick={() => onDelete(agency.id)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-sm"><Trash2 size={16}/></button>
      </div>
    </div>
    
    <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800 mt-auto">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 italic">
        <Mail size={14} className="text-[#0528d6]/60"/> {agency.email}
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 italic">
        <Phone size={14} className="text-[#0528d6]/60"/> {agency.phone}
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase italic tracking-tighter ${agency.is24Hours ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {agency.is24Hours ? 'Ouvert 24h/24' : agency.workingHours}
        </span>
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">#{agency.id.substring(0,8)}</span>
      </div>
    </div>
  </div>
);