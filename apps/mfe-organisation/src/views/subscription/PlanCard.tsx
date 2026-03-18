/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export const PlanCard = ({ plan, isCurrent, onSelect, loading }: any) => (
  <div className={`
    relative bg-white dark:bg-[#1a1d2d] p-8 rounded-2xl border-2 transition-all flex flex-col h-full
    ${isCurrent ? 'border-[#0528d6] shadow-lg scale-[1.02] z-10' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200'}
  `}>
    {isCurrent && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0528d6] text-white px-4 py-1 rounded-full text-[10px] font-bold  tracking-widest shadow-md">
        Plan actuel
      </div>
    )}

    <div className="mb-6">
      <h5 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{plan.name}</h5>
      <p className="text-xs text-slate-400 mt-1 italic">{plan.description}</p>
    </div>

    <div className="mb-8">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {plan.price.toLocaleString()} XAF
        </span>
        <span className="text-xs font-medium text-slate-400">/mois</span>
      </div>
    </div>

    <ul className="flex-1 space-y-4 mb-8">
      <FeatureItem label={`${plan.maxAgencies} Agences autorisées`} active={true} />
      <FeatureItem label={`${plan.maxVehicles} Véhicules dans la flotte`} active={true} />
      <FeatureItem label="Géofencing (Rayon de sécurité)" active={plan.hasGeofencing} />
      <FeatureItem label="Chat support intégré" active={plan.hasChat} />
    </ul>

    {!isCurrent ? (
      <button 
        onClick={() => onSelect(plan.name)}
        disabled={loading}
        className="w-full py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin size-4" /> : "Choisir ce plan"}
      </button>
    ) : (
      <div className="w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold text-sm text-center border border-slate-100 dark:border-slate-700 italic">
        Utilisation en cours
      </div>
    )}
  </div>
);

const FeatureItem = ({ label, active }: { label: string, active: boolean }) => (
  <li className={`flex items-center gap-3 text-xs font-medium ${active ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'}`}>
    <div className={`size-5 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-blue-50 text-[#0528d6]' : 'bg-slate-50 text-slate-300'}`}>
      {active ? <Check size={12} strokeWidth={3} /> : <div className="size-1 bg-slate-300 rounded-full" />}
    </div>
    <span className={active ? '' : 'line-through opacity-50'}>{label}</span>
  </li>
);