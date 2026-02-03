'use client';
import React from 'react';
import { Mail, Store, Shield, Edit3, Trash2, User } from 'lucide-react';

export const StaffCard = ({ staff, agencies, onEdit, onDelete, onView }: any) => {
  const agencyName = agencies.find((a: any) => a.id === staff.agencyId)?.name || 'Non assignée';
  
  return (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] font-bold text-xl border border-slate-100 dark:border-slate-700">
            {staff.firstname.charAt(0)}{staff.lastname.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
              {staff.firstname} {staff.lastname}
            </h4>
            <div className="flex items-center gap-1.5 mt-1 text-[#0528d6]">
              <Shield size={12} />
              <span className="text-[10px] font-bold uppercase tracking-tight italic">
                {staff.poste?.name || 'Sans poste'}
              </span>
            </div>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
          staff.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {staff.status}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 italic">
          <Mail size={14} className="text-slate-300" /> {staff.email}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 italic">
          <Store size={14} className="text-slate-300" /> {agencyName}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
        <button 
          onClick={() => onView(staff)}
          className="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase hover:bg-[#0528d6] hover:text-white transition-all"
        >
          Détails
        </button>
        <button onClick={() => onEdit(staff)} className="p-2 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16}/></button>
        <button onClick={() => onDelete(staff.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
      </div>
    </div>
  );
};