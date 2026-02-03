'use client';
import React from 'react';
import { ShieldCheck, Lock, Edit3, ChevronRight } from 'lucide-react';

export const RoleCard = ({ role, onEdit, isSystem }: any) => (
  <div className="bg-white dark:bg-[#1a1d2d] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
    {isSystem && (
      <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-xl text-[9px] font-bold uppercase tracking-wider italic z-10">
        Système
      </div>
    )}
    
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-4">
        <div className={`size-12 rounded-xl flex items-center justify-center ${isSystem ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-[#0528d6]'} shadow-inner`}>
          {isSystem ? <Lock size={20} /> : <ShieldCheck size={24} />}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{role.name}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 italic">
            {role.permissions?.length || 0} privilèges attribués
          </p>
        </div>
      </div>
      
      {!isSystem && (
        <button 
          onClick={() => onEdit(role)} 
          className="p-2 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit3 size={18} />
        </button>
      )}
    </div>

    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 italic leading-relaxed">
      {role.description}
    </p>

    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-50 dark:border-slate-800">
       {role.permissions?.slice(0, 3).map((p: any) => (
         <span key={p.id} className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-md text-[9px] font-bold text-slate-400 border border-slate-100 dark:border-slate-800">
            {p.name}
         </span>
       ))}
       {role.permissions?.length > 3 && (
         <span className="text-[10px] font-bold text-[#0528d6] self-center ml-1">
           +{role.permissions.length - 3}
         </span>
       )}
    </div>
  </div>
);