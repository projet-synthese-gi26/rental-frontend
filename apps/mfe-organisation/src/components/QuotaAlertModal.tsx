/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { AlertTriangle, ArrowUpCircle, ShieldCheck } from 'lucide-react';
import { Portal } from './Portal';

export const QuotaAlertModal = ({ onClose, onUpgrade, type, limit }: any) => (
  <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay avec flou TOTAL sur toute l'interface */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-300 border border-white/20">
        <div className="size-20 bg-orange-50 dark:bg-orange-500/10 rounded-3xl flex items-center justify-center text-[#F76513] mx-auto mb-6 shadow-inner">
          <AlertTriangle size={40} />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          Limite atteinte
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
          Votre plan actuel est limité à <span className="font-bold text-slate-900 dark:text-white">{limit} {type}</span>. 
          Veuillez mettre à jour votre abonnement pour étendre votre réseau.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onUpgrade}
            className="w-full py-4 bg-[#0528d6] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <ArrowUpCircle size={18} /> Voir les plans premium
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 text-slate-400 font-bold text-xs  tracking-widest hover:text-slate-600 transition-colors"
          >
            Plus tard
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
           <ShieldCheck size={14} className="text-blue-500" />
           <span className="text-[10px] font-bold text-slate-400  tracking-tight">EasyRental Secure Billing</span>
        </div>
      </div>
    </div>
  </Portal>
);