/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { User, Car, CheckCircle2, Phone, DollarSign, Info } from 'lucide-react';

export const BookingCard = ({ rental, onPay, onStart, onValidate, onView }: any) => {
  const isPaid = rental.status === 'PAID';
  const remaining = rental.totalAmount - rental.amountPaid;

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'PAID': return 'bg-green-50 text-green-700 border-green-100';
      case 'ONGOING': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'COMPLETED': return 'bg-slate-50 text-slate-500 border-slate-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-orange-50 text-orange-700 border-orange-100';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left flex flex-col h-full relative overflow-hidden group">
      <div className="flex justify-between items-start mb-8">
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(rental.status)}`}>
            {rental.status}
        </div>
        <button onClick={onView} className="size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0528d6] transition-all"><Info size={18}/></button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] shrink-0 border border-white">
            <User size={24} />
        </div>
        <div className="overflow-hidden">
          <h4 className="font-black text-slate-800 dark:text-white leading-tight truncate uppercase italic tracking-tighter">{rental.clientName || 'Walk-in'}</h4>
          <p className="flex items-center gap-2 mt-1 text-slate-400 font-bold text-[10px] uppercase italic"><Phone size={10} className="text-[#0528d6]"/> {rental.clientPhone}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 mb-8 grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-800">
        <div className="space-y-0.5"><p className="text-[9px] font-black text-slate-400 uppercase italic">Départ</p><p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{new Date(rental.startDate).toLocaleDateString()}</p></div>
        <div className="space-y-0.5"><p className="text-[9px] font-black text-slate-400 uppercase italic">Fin</p><p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{new Date(rental.endDate).toLocaleDateString()}</p></div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Montant Perçu</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[#0528d6]">{rental.amountPaid?.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-400">/ {rental.totalAmount?.toLocaleString()} XAF</span>
                </div>
            </div>
            {remaining > 0 && <div className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-[8px] font-black uppercase italic">Reste: {remaining.toLocaleString()}</div>}
        </div>

        <div className="flex gap-2">
            {onPay && !isPaid && (
                <button onClick={onPay} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all italic tracking-widest">
                    <DollarSign size={14}/> Encaisser
                </button>
            )}
            {onStart && isPaid && (
                <button onClick={onStart} className="flex-1 py-3 bg-[#0528d6] text-white rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all italic tracking-widest">
                    <Car size={16}/> Lancer départ
                </button>
            )}
            {onValidate && (
                <button onClick={onValidate} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all italic tracking-widest">
                    <CheckCircle2 size={16}/> Valider Retour
                </button>
            )}
        </div>
      </div>
    </div>
  );
};