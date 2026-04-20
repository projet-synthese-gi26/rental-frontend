// FILE: apps/mfe-agency/src/views/transactions/TransactionDetailsModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { X, Loader2, Hash, Banknote } from 'lucide-react';
import { transactionService } from '@pwa-easy-rental/shared-services';
import { Portal } from '../../components/Portal';

export const TransactionDetailsModal = ({ transactionId, onClose }: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService.getTransactionDetails(transactionId).then(res => {
      if (res.ok) setData(res.data);
      setLoading(false);
    });
  }, [transactionId]);

  if (loading) return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
        <Loader2 className="animate-spin text-white size-12" />
      </div>
    </Portal>
  );

  const isIncome = data.type === 'RENTAL_PAYMENT';
  const absAmount = Math.abs(data.amount || 0);
  const isSuccess = data.status === 'SUCCESS' || data.status === 'COMPLETED' || data.status === 'ACTIVE';

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 text-left">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
        <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/10 animate-in zoom-in">
          <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Détails Transaction</h3>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isSuccess ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{data.status}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">REF: {data.reference}</p>
            </div>
            <button onClick={onClose} className="size-12 bg-white dark:bg-slate-800 flex items-center justify-center rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X size={24}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
            <div className="flex items-center justify-center py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Montant de la transaction</p>
                    <p className={`text-4xl font-black italic tracking-tighter ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                        {isIncome ? '+' : '-'}{absAmount.toLocaleString()} XAF
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-[#0528d6] italic border-b pb-2 flex items-center gap-2"><Hash size={14}/> Informations</h4>
                    <DataRow label="Type" value={isIncome ? 'Revenu de Location' : 'Remboursement / Autre'} />
                    <DataRow label="Méthode" value={data.method || 'Automatique'} />
                    <DataRow label="Date" value={new Date(data.date).toLocaleString()} />
                </section>
                <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-[#0528d6] italic border-b pb-2 flex items-center gap-2"><Banknote size={14}/> Description</h4>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{data.description}</p>
                </section>
            </div>

            {data.rentalDetails && (
                <div className="p-6 bg-[#0528d6]/5 border-2 border-[#0528d6]/20 rounded-[2rem]">
                    <h4 className="text-xs font-black uppercase text-[#0528d6] italic mb-4">Liaison Location</h4>
                    <div className="space-y-2">
                        <DataRow label="Client" value={data.rentalDetails.rental?.clientName} dark />
                        <DataRow label="Dossier ID" value={data.rentalDetails.rental?.id} dark />
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

const DataRow = ({ label, value, dark }: any) => (
    <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">{label}</span>
        <span className={`text-sm font-black italic ${dark ? 'text-slate-800 dark:text-slate-200' : 'text-slate-800 dark:text-white'}`}>{value || '---'}</span>
    </div>
);