'use client';
import React from 'react';

export const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-[#1a1d2d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm transition-shadow hover:shadow-md">
    <div className="size-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[#0528d6] shadow-inner">
      {React.cloneElement(icon as React.ReactElement, { size: 22 })}
    </div>
    <div>
      <p className="text-[11px] font-bold  text-slate-400 tracking-wider italic mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{value}</p>
    </div>
  </div>
);