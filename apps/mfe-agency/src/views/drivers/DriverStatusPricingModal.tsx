/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, DollarSign, Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const DriverStatusPricingModal = ({ driver, onSubmit, onClose, modalLoading, error, t }: any) => {
  const [formData, setFormData] = useState({
    globalStatus: driver?.status || 'ACTIVE',
    pricePerHour: 0,
    pricePerDay: 0,
    schedule: {
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: 'AVAILABLE',
      reason: ''
    }
  });

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 md:p-4 text-left">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={handleLocalSubmit} 
              className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-8 md:px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#0528d6] text-white">
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">{t.staff.profile.editContract || "Operations & Tarification"}</h3>
              <p className="text-[10px] opacity-70 font-black uppercase tracking-widest mt-2 italic">{driver.firstname} {driver.lastname}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><X size={22}/></button>
          </div>

          <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar space-y-10">
            {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase italic tracking-widest">{error}</div>}

            <section className="space-y-6">
              <h4 className="text-[11px] font-black uppercase text-[#0528d6] dark:text-blue-400 tracking-widest flex items-center gap-2 italic"><AlertCircle size={14}/> Disponibilité & Statut</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['ACTIVE', 'INACTIVE'].map(s => (
                    <button key={s} type="button" onClick={() => setFormData({...formData, globalStatus: s})}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${formData.globalStatus === s ? 'border-[#0528d6] bg-blue-50/50 dark:bg-blue-900/20 text-[#0528d6] dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                        <span className="text-xs font-black uppercase italic">{s === 'ACTIVE' ? t.staff.modal.statusActive : t.staff.modal.statusSuspended}</span>
                        {formData.globalStatus === s && <CheckCircle size={16}/>}
                    </button>
                  ))}
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-[11px] font-black uppercase text-[#0528d6] dark:text-blue-400 tracking-widest flex items-center gap-2 italic"><DollarSign size={14}/> {t.agencies.modal.deposit || "Grille Tarifaire"}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1 tracking-widest">Prix / Heure</label>
                  <input type="number" required value={formData.pricePerHour} onChange={e => setFormData({...formData, pricePerHour: Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-black text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all shadow-inner" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1 tracking-widest">Prix / Jour</label>
                  <input type="number" required value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-black text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all shadow-inner" />
                </div>
              </div>
            </section>

            <section className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-inner">
              <h4 className="text-[11px] font-black uppercase text-[#0528d6] dark:text-blue-400 tracking-widest flex items-center gap-2 italic"><Calendar size={14}/> {t.onboarding.step3Title || "Planning"}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase italic ml-1">{t.table.start}</label>
                  <input type="datetime-local" value={formData.schedule.startDate} onChange={e => setFormData({...formData, schedule: {...formData.schedule, startDate: e.target.value}})} className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-xs dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase italic ml-1">{t.table.end}</label>
                  <input type="datetime-local" value={formData.schedule.endDate} onChange={e => setFormData({...formData, schedule: {...formData.schedule, endDate: e.target.value}})} className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-xs dark:text-white" />
                </div>
              </div>
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase italic ml-1">Motif (Optionnel)</label>
                  <input placeholder="ex: Repos, Congés..." value={formData.schedule.reason} onChange={e => setFormData({...formData, schedule: {...formData.schedule, reason: e.target.value}})} className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-xs dark:text-white" />
              </div>
            </section>
          </div>

          <div className="px-8 md:px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex flex-col sm:flex-row gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase italic hover:text-red-500 transition-colors">{t.staff.modal.cancel}</button>
            <button disabled={modalLoading} className="flex-[2] py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 italic tracking-widest">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : t.agencies.modal.submit || "Appliquer"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};