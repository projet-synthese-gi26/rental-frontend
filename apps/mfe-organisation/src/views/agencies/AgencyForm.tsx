'use client';
import React, { useState, useEffect } from 'react';
import { X, Loader2, Clock } from 'lucide-react';
import { Portal } from '@/components/Portal';

export const AgencyForm = ({ editingAgency, initialData, onSubmit, onClose, modalLoading }: any) => {
  const [formData, setFormData] = useState(initialData);
  
  // États locaux pour les horaires (Backend attend "08:00-18:00")
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
    // On concatène les heures avant d'envoyer au parent
    const finalWorkingHours = formData.is24Hours ? "00:00-23:59" : `${startHour}-${endHour}`;
    onSubmit({ ...formData, workingHours: finalWorkingHours });
  };

  const handlePhoneChange = (val: string) => {
    // Accepte uniquement les chiffres
    const numericValue = val.replace(/\D/g, '');
    setFormData({ ...formData, phone: numericValue });
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay avec z-index supérieur au Header */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <form 
        onSubmit={handleLocalSubmit} 
        className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white dark:border-slate-800"
      >
        {/* Header du Modal fixe */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingAgency ? "Modifier l'agence" : "Nouvelle agence"}
            </h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Configuration AgencyRequestDTO</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Corps du Modal Scrollable */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Nom de l'agence" value={formData.name} onChange={v => setFormData({...formData, name: v})} required />
            <FormInput label="Ville" value={formData.city} onChange={v => setFormData({...formData, city: v})} required />
            
            {/* Téléphone restrictif */}
            <FormInput 
              label="Téléphone (Chiffres uniquement)" 
              value={formData.phone} 
              onChange={handlePhoneChange} 
              type="tel"
              required 
            />
            
            <FormInput label="Email de contact" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} required />
            
            <div className="md:col-span-2">
              <FormInput label="Adresse physique complète" value={formData.address} onChange={v => setFormData({...formData, address: v})} required />
            </div>

            <FormInput label="Caution (%)" type="number" value={formData.depositPercentage} onChange={v => setFormData({...formData, depositPercentage: v})} />
            <FormInput label="Rayon Geofencing (km)" type="number" value={formData.geofenceRadius} onChange={v => setFormData({...formData, geofenceRadius: v})} />

            {/* Section Horaires */}
            <div className="md:col-span-2 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#0528d6]">
                  <Clock size={18} />
                  <span className="text-xs font-bold uppercase tracking-tight">Horaires d'ouverture</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is24Hours} 
                    onChange={e => setFormData({...formData, is24Hours: e.target.checked})}
                    className="size-5 rounded border-slate-300 text-[#0528d6] focus:ring-[#0528d6]"
                  />
                  <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-[#0528d6] transition-colors">Ouvert 24h/24</span>
                </label>
              </div>

              <div className={`grid grid-cols-2 gap-4 transition-opacity ${formData.is24Hours ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Heure d'ouverture</label>
                  <input type="time" value={startHour} onChange={e => setStartHour(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Heure de fermeture</label>
                  <input type="time" value={endHour} onChange={e => setEndHour(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer du Modal fixe */}
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
          <button 
            disabled={modalLoading}
            className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
    </Portal>
  );
};

const FormInput = ({ label, value, onChange, type = "text", required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      required={required} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" 
    />
  </div>
);