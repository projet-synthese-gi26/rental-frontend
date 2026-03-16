/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, User, Phone, Calendar } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const BookingFormModal = ({ vehicles, drivers, onClose, onSubmit, loading }: any) => {
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    vehicleId: '',
    driverId: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    rentalType: 'DAILY'
  });

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
              className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Client Walk-in</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 italic">Création directe en agence</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={22}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 text-left">
            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-[#0528d6] uppercase tracking-[0.2em] italic border-b pb-2">Identité Client</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nom Complet" value={form.clientName} onChange={(v:any) => setForm({...form, clientName: v})} required icon={<User size={16}/>} />
                <Input label="Téléphone" value={form.clientPhone} onChange={(v:any) => setForm({...form, clientPhone: v})} required icon={<Phone size={16}/>} />
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-[#0528d6] uppercase tracking-[0.2em] italic border-b pb-2">Ressources & Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Véhicule</label>
                  <select required value={form.vehicleId} onChange={e => setForm({...form, vehicleId: e.target.value})}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]">
                    <option value="">Choisir un véhicule...</option>
                    {vehicles.map((v:any) => <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.licencePlate})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Chauffeur (Optionnel)</label>
                  <select value={form.driverId} onChange={e => setForm({...form, driverId: e.target.value})}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]">
                    <option value="">Pas de chauffeur</option>
                    {drivers.map((d:any) => <option key={d.id} value={d.id}>{d.firstname} {d.lastname}</option>)}
                  </select>
                </div>
                <Input label="Date de départ" type="datetime-local" value={form.startDate} onChange={(v:any) => setForm({...form, startDate: v})} required icon={<Calendar size={16}/>} />
                <Input label="Date de retour" type="datetime-local" value={form.endDate} onChange={(v:any) => setForm({...form, endDate: v})} required icon={<Calendar size={16}/>} />
              </div>
            </section>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400">Annuler</button>
            <button disabled={loading} className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin size-4" /> : "Générer la réservation"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const Input = ({ label, value, onChange, type = "text", required = false, icon }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} 
             className={`w-full ${icon ? 'pl-10' : 'px-4'} p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all`} />
    </div>
  </div>
);