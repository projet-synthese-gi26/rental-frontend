/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Phone, User, Trash2, Edit3, ShieldCheck, FileText, BadgeCheck } from 'lucide-react';

export const DriverCard = ({ driver, onEdit, onDelete }: any) => {
  return (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group text-left">
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <div className="size-16 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-slate-50 flex items-center justify-center">
            {driver.profilUrl ? (
              <img src={driver.profilUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <User size={30} className="text-slate-300" />
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white dark:border-[#1a1d2d] flex items-center justify-center ${
            driver.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <ShieldCheck size={10} className="text-white" />
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(driver)} className="p-2 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
          <button onClick={() => onDelete(driver.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-slate-900 dark:text-white leading-tight truncate">
          {driver.firstname} {driver.lastname}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          {driver.age} ans — {driver.gender === 0 ? 'Homme' : 'Femme'}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300 italic">
          <div className="size-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Phone size={14} className="text-[#0528d6]" />
          </div>
          {driver.tel}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300 italic">
          <div className="size-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <BadgeCheck size={14} className="text-[#0528d6]" />
          </div>
          Permis de conduire vérifié
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
        <a href={driver.drivingLicenseUrl} target="_blank" className="flex items-center justify-center gap-2 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-50 hover:text-[#0528d6] transition-all">
          <FileText size={12}/> Permis
        </a>
        <a href={driver.cniUrl} target="_blank" className="flex items-center justify-center gap-2 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-50 hover:text-[#0528d6] transition-all">
          <FileText size={12}/> CNI
        </a>
      </div>
    </div>
  );
};