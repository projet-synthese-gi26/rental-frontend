/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { X, Loader2, Clock, Globe } from 'lucide-react';
import { Portal } from '@/components/Portal';
import { LogoUpload } from '@/components/LogoUpload';

export const AgencyForm = ({ editingAgency, initialData, onSubmit, onClose, modalLoading }: any) => {
  const [formData, setFormData] = useState(initialData);
  const [startHour, setStartHour] = useState('08:00');
  const [endHour, setEndHour] = useState('18:00');

  useEffect(() => {
    if (initialData.workingHours && initialData.workingHours.includes('-')) {
      const [start, end] = initialData.workingHours.split('-');
      setStartHour(start);
      setEndHour(end);
    }
  }, [initialData.workingHours]);

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWorkingHours = formData.is24Hours ? "00:00-23:59" : `${startHour}-${endHour}`;
    onSubmit({ ...formData, workingHours: finalWorkingHours });
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={handleLocalSubmit} className="relative w-full max-w-4xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                {editingAgency ? "Édition Point de Vente" : "Nouvelle Infrastructure"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Configuration AgencyRequestDTO</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-red-500 transition-colors"><X size={22}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-10 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                <div className="md:col-span-1">
                    <LogoUpload 
                        value={formData.logoUrl} 
                        onUploadSuccess={(url) => setFormData({ ...formData, logoUrl: url })} 
                    />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Nom de l'agence" value={formData.name} onChange={(v: any) => setFormData({...formData, name: v})} required />
                    <FormInput label="Ville" value={formData.city} onChange={(v: any) => setFormData({...formData, city: v})} required />
                    <FormInput label="Email contact" type="email" value={formData.email} onChange={(v: any) => setFormData({...formData, email: v})} required />
                    <FormInput label="Téléphone" value={formData.phone} onChange={(v:any) => setFormData({...formData, phone: v.replace(/\D/g, '')})} required />
                </div>
            </div>

            <section className="space-y-6">
                <h4 className="text-[10px] font-black text-[#0528d6] uppercase italic border-b pb-2 flex items-center gap-2"><Globe size={14}/> Localisation & Opérations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <FormInput label="Adresse physique complète" value={formData.address} onChange={(v: any) => setFormData({...formData, address: v})} required />
                    </div>
                    <FormInput label="Caution (%)" type="number" value={formData.depositPercentage} onChange={(v: any) => setFormData({...formData, depositPercentage: v})} />
                    <FormInput label="Rayon Geofencing (KM)" type="number" value={formData.geofenceRadius} onChange={(v: any) => setFormData({...formData, geofenceRadius: v})} />
                </div>
            </section>

            <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-800 dark:text-white uppercase italic flex items-center gap-2"><Clock size={16}/> {"Horaires d'ouverture"}</h4>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.is24Hours} onChange={e => setFormData({...formData, is24Hours: e.target.checked})} className="size-5 rounded border-slate-300 text-[#0528d6] focus:ring-[#0528d6]" />
                        <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-[#0528d6] transition-colors">Service 24h/24</span>
                    </label>
                </div>
                <div className={`grid grid-cols-2 gap-6 transition-opacity ${formData.is24Hours ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <FormInput label="Heure d'ouverture" type="time" value={startHour} onChange={(v:any) => setStartHour(v)} />
                    <FormInput label="Heure de fermeture" type="time" value={endHour} onChange={(v:any) => setEndHour(v)} />
                </div>
            </section>
          </div>

          <div className="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-black text-slate-400 uppercase italic">Annuler</button>
            <button disabled={modalLoading} className="flex-[2] py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 italic">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Confirmer la configuration"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const FormInput = ({ label, value, onChange, type = "text", required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-slate-400 uppercase italic ml-1 tracking-widest">{label}</label>
    <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} 
           className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white transition-all shadow-sm" />
  </div>
);