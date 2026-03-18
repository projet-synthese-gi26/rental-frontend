/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const DriverStatusPricingModal = ({ driver, onSubmit, onClose, modalLoading, error }: any) => {
  const [formData, setFormData] = useState({
    globalStatus: driver?.status || 'ACTIVE',
    pricePerHour: 0,
    pricePerDay: 0,
    schedule: {
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // +1 jour par défaut
      status: 'AVAILABLE',
      reason: ''
    }
  });

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construction du payload avec conversion forcée en Number
    const payload = {
      globalStatus: formData.globalStatus,
      pricePerHour: Number(formData.pricePerHour),
      pricePerDay: Number(formData.pricePerDay),
      schedule: {
        startDate: new Date(formData.schedule.startDate).toISOString(),
        endDate: new Date(formData.schedule.endDate).toISOString(),
        status: formData.schedule.status,
        reason: formData.schedule.reason
      }
    };
    
    onSubmit(driver.id, payload);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={handleLocalSubmit} 
              className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Opérations & Tarification</h3>
              <p className="text-[10px] text-slate-400  font-bold tracking-widest mt-1 italic">
                {driver.firstname} {driver.lastname}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={22}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 text-left">
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl text-red-600 text-xs font-bold  italic">
                {error}
              </div>
            )}

            <section className="space-y-4">
              <h4 className="text-[11px] font-black  text-[#0528d6] tracking-wider flex items-center gap-2">
                <AlertCircle size={14}/> Statut Global de l&apos;activité
              </h4>
              <select 
                value={formData.globalStatus} 
                onChange={e => setFormData({...formData, globalStatus: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all"
              >
                <option value="ACTIVE">Actif / Disponible pour missions</option>
                <option value="INACTIVE">Inactif / En pause</option>
                <option value="SUSPENDED">Suspendu / Dossier bloqué</option>
              </select>
            </section>

            <section className="space-y-4">
              <h4 className="text-[11px] font-black  text-[#0528d6] tracking-wider flex items-center gap-2">
                <DollarSign size={14}/> Grille Tarifaire (XAF)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400  ml-1">Prix par heure</label>
                  <input type="number" required value={formData.pricePerHour} onChange={e => setFormData({...formData, pricePerHour: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400  ml-1">Prix par jour</label>
                  <input type="number" required value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="text-[11px] font-black  text-[#0528d6] tracking-wider flex items-center gap-2">
                <Calendar size={14}/> Planning d&apos;indisponibilité
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400  ml-1 italic">Date de début</label>
                  <input type="datetime-local" value={formData.schedule.startDate} onChange={e => setFormData({...formData, schedule: {...formData.schedule, startDate: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400  ml-1 italic">Date de fin</label>
                  <input type="datetime-local" value={formData.schedule.endDate} onChange={e => setFormData({...formData, schedule: {...formData.schedule, endDate: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400  ml-1 italic">Motif du changement</label>
                  <input placeholder="ex: Repos hebdomadaire, Congés..." value={formData.schedule.reason} onChange={e => setFormData({...formData, schedule: {...formData.schedule, reason: e.target.value}})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
              </div>
            </section>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
            <button disabled={modalLoading}
                    className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Appliquer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};