'use client';
import React, { useState } from 'react';
import { X, Loader2, Car, Hash, Info, Calendar } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const VehicleFormModal = ({ editingVehicle, agencies, categories, initialData, onSubmit, onClose, modalLoading }: any) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
              className="relative w-full max-w-3xl bg-white dark:bg-[#1a1d2d] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingVehicle ? "Modifier le véhicule" : "Ajouter à la flotte"}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 italic">Spécifications VehicleRequestDTO</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={22}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Marque" value={formData.brand} onChange={v => setFormData({...formData, brand: v})} required placeholder="ex: Toyota" />
              <Input label="Modèle" value={formData.model} onChange={v => setFormData({...formData, model: v})} required placeholder="ex: RAV4" />
              <Input label="Plaque d'immatriculation" value={formData.licencePlate} onChange={v => setFormData({...formData, licencePlate: v.toUpperCase()})} required placeholder="LT-000-AA" icon={<Hash size={16}/>} />
              <Input label="Numéro VIN (Châssis)" value={formData.vinNumber} onChange={v => setFormData({...formData, vinNumber: v})} placeholder="Optionnel" />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Kilométrage" type="number" value={formData.kilometrage} onChange={v => setFormData({...formData, kilometrage: v})} required />
                <Input label="Places" type="number" value={formData.places} onChange={v => setFormData({...formData, places: v})} required />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Transmission</label>
                <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]">
                  <option value="MANUAL">Manuelle</option>
                  <option value="AUTOMATIC">Automatique</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Agence d'affectation</label>
                <select required value={formData.agencyId} onChange={e => setFormData({...formData, agencyId: e.target.value})}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]">
                  <option value="">Choisir une agence...</option>
                  {agencies.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Catégorie de véhicule</label>
                <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]">
                  <option value="">Choisir une catégorie...</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Statut initial</label>
                <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]">
                  <option value="AVAILABLE">Disponible</option>
                  <option value="MAINTENANCE">En maintenance</option>
                  <option value="RENTED">En location</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600">Annuler</button>
            <button disabled={modalLoading} className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Enregistrer le véhicule"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const Input = ({ label, value, onChange, type = "text", required = false, icon, placeholder }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0528d6] transition-colors">{icon}</div>}
      <input type={type} required={required} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} 
             className={`w-full ${icon ? 'pl-10' : 'px-4'} p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all`} />
    </div>
  </div>
);