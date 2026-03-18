/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, CalendarRange, AlertTriangle, Clock, Banknote } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const QuickStatusModal = ({ vehicle, onSubmit, onClose, modalLoading }: any) => {
  const [formData, setFormData] = useState({
    globalStatus: vehicle.statut || 'AVAILABLE',
    pricePerHour: vehicle.pricing?.pricePerHour || 0,
    pricePerDay: vehicle.pricing?.pricePerDay || 0,
    schedule: {
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: 'MAINTENANCE',
      reason: ''
    }
  });

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 text-left">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(vehicle.id, formData); }} 
              className="relative w-full max-w-xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#0528d6] text-white">
            <div>
              <h3 className="text-xl font-black  italic tracking-tighter">Switch Opérationnel</h3>
              <p className="text-[10px] opacity-70 font-bold  italic">{vehicle.brand} {vehicle.model}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><X size={20}/></button>
          </div>

          <div className="p-10 space-y-8">
            {/* STATUT GLOBAL */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400  italic tracking-widest flex items-center gap-2"><AlertTriangle size={14}/> État de disponibilité immédiat</label>
              <div className="grid grid-cols-2 gap-3">
                {['AVAILABLE', 'MAINTENANCE'].map(s => (
                  <button key={s} type="button" onClick={() => setFormData({...formData, globalStatus: s})}
                          className={`p-4 rounded-2xl border-2 font-black text-xs  italic transition-all ${formData.globalStatus === s ? 'bg-[#0528d6] border-[#0528d6] text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    {s === 'AVAILABLE' ? 'DISPONIBLE' : 'MAINTENANCE'}
                  </button>
                ))}
              </div>
            </div>

            {/* PLANNING D'INDISPONIBILITÉ */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
              <label className="text-[10px] font-black text-[#0528d6]  italic tracking-widest flex items-center gap-2"><CalendarRange size={16}/> Planifier une période</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400  ml-1 italic">Date de début</span>
                  <input type="datetime-local" value={formData.schedule.startDate} onChange={e => setFormData({...formData, schedule: {...formData.schedule, startDate: e.target.value}})} className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400  ml-1 italic">Date de fin</span>
                  <input type="datetime-local" value={formData.schedule.endDate} onChange={e => setFormData({...formData, schedule: {...formData.schedule, endDate: e.target.value}})} className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold" />
                </div>
              </div>
              <input placeholder="Mentionner la raison technique (ex: Révision Moteur)..." value={formData.schedule.reason} onChange={e => setFormData({...formData, schedule: {...formData.schedule, reason: e.target.value}})}
                     className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold" />
            </div>

            {/* MISE À JOUR TARIFICATION RAPIDE */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400  italic flex items-center gap-2"><Clock size={14}/> Prix / Heure</label>
                    <input type="number" value={formData.pricePerHour} step="50" onChange={e => setFormData({...formData, pricePerHour: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-black text-sm text-[#0528d6]" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400  italic flex items-center gap-2"><Banknote size={14}/> Prix / Jour</label>
                    <input type="number" value={formData.pricePerDay} step="100" onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-black text-sm text-[#0528d6]" />
                </div>
            </div>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-black text-slate-400  italic">Annuler</button>
            <button disabled={modalLoading} className="flex-[2] py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs  shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 italic">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Appliquer la configuration"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};