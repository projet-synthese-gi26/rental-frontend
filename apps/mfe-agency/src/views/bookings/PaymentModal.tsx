/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Loader2, DollarSign, Smartphone, CreditCard, Banknote, X, Info } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const PaymentModal = ({ rental, onClose, onSubmit, loading, t }: any) => {
  const suggestedAmount = rental.amountPaid === 0 ? rental.totalAmount * 0.6 : rental.totalAmount - rental.amountPaid;
  const [amount, setAmount] = useState(suggestedAmount);
  const [method, setMethod] = useState<'CASH' | 'MOMO' | 'OM' | 'CARD'>('CASH');

  return (
    <Portal>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] shadow-2xl p-8 md:p-10 text-center animate-in zoom-in border border-white/20">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:text-red-500 transition-colors"><X size={20}/></button>
          
          <div className="size-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-[#0528d6] mx-auto mb-6 shadow-inner">
            <DollarSign size={36} />
          </div>
          
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">{t.table.payment || "Transaction Client"}</h3>
          <p className="text-xs text-slate-400 italic mb-8 uppercase tracking-widest">Dossier #{rental.id.substring(0,8)}</p>

          <div className="space-y-6 text-left">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex gap-3 items-center">
                <Info size={18} className="text-[#0528d6] shrink-0"/>
                <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase leading-relaxed italic">
                    {rental.amountPaid === 0 
                      ? (t.table.depositHint || "Acompte 60% suggéré : ") + (rental.totalAmount * 0.6).toLocaleString() + " XAF"
                      : (t.table.balanceHint || "Solde restant : ") + (rental.totalAmount - rental.amountPaid).toLocaleString() + " XAF"}
                </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1">{t.table.amount || "Montant (XAF)"}</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                     className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-[#0528d6] rounded-2xl font-black text-2xl text-[#0528d6] outline-none shadow-inner" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'CASH', label: t.table.cash || 'Espèces', icon: <Banknote size={16}/> },
                { id: 'MOMO', label: 'MTN MoMo', icon: <Smartphone size={16}/> },
                { id: 'OM', label: 'Orange Money', icon: <Smartphone size={16}/> },
                { id: 'CARD', label: t.table.card || 'Carte', icon: <CreditCard size={16}/> },
              ].map(m => (
                <button key={m.id} type="button" onClick={() => setMethod(m.id as any)}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${method === m.id ? 'border-[#0528d6] bg-blue-50 dark:bg-blue-900/30 text-[#0528d6] dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                  {m.icon} <span className="text-[9px] font-black uppercase">{m.label}</span>
                </button>
              ))}
            </div>

            <button onClick={() => onSubmit(amount, method)} disabled={loading || amount <= 0}
                    className="w-full py-5 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 italic">
              {loading ? <Loader2 className="animate-spin size-5" /> : t.table.confirmPayment || "Confirmer l'encaissement"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};