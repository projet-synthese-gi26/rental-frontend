// FILE: apps/mfe-agency/src/views/bookings/BookingCard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { User, Car, CheckCircle2, Phone, X, DollarSign } from 'lucide-react';

export const BookingCard = ({ rental, onPay, onStart, onValidate, onCancel }: any) => {
  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'PAID': return 'bg-green-50 text-green-700 border-green-100';
      case 'ONGOING': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'RESERVED': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'COMPLETED': return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div className={`px-3 py-1 rounded-full text-[9px] font-black  tracking-widest border ${getStatusStyle(rental.status)}`}>{rental.status}</div>
        <span className="text-[10px] font-mono font-bold text-slate-300">#REF-{rental.id.substring(0,6).to()}</span>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] shrink-0 shadow-inner"><User size={24} /></div>
        <div className="overflow-hidden">
          <h4 className="font-bold text-slate-900 dark:text-white leading-tight truncate">{rental.clientName || 'Walk-in Client'}</h4>
          <div className="flex items-center gap-2 mt-1 text-slate-400 font-bold text-[10px]  italic"><Phone size={10} className="text-[#0528d6]"/> {rental.clientPhone}</div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 mb-8 grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-800">
        <div className="space-y-0.5"><p className="text-[9px] font-black text-slate-400  italic">Prise en charge</p><p className="text-xs font-bold truncate">{new Date(rental.startDate).toLocaleDateString()}</p></div>
        <div className="space-y-0.5"><p className="text-[9px] font-black text-slate-400  italic">Restitution</p><p className="text-xs font-bold truncate">{new Date(rental.endDate).toLocaleDateString()}</p></div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto">
        <div>
          <p className="text-[9px] font-black text-slate-400  italic mb-0.5">Montant</p>
          <p className="text-lg font-black text-[#0528d6] leading-none">{rental.totalAmount?.toLocaleString()} XAF</p>
        </div>
        <div className="flex gap-2">
          {onCancel && <button onClick={onCancel} title="Annuler" className="size-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all"><X size={20}/></button>}
          {onPay && <button onClick={onPay} title="Encaisser" className="size-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shadow-sm hover:bg-orange-500 hover:text-white transition-all"><DollarSign size={20}/></button>}
          {onStart && <button onClick={onStart} title="Valider Départ" className="size-12 bg-[#0528d6] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-all"><Car size={20}/></button>}
          {onValidate && <button onClick={onValidate} title="Valider Retour" className="size-12 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-all"><CheckCircle2 size={20}/></button>}
        </div>
      </div>
    </div>
  );
};