/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, Info } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const CategoryFormModal = ({ editingCat, initialData, onSubmit, onClose, modalLoading }: any) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
              className="relative w-full max-w-lg bg-white dark:bg-[#1a1d2d] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingCat ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 italic">Typologie de flotte</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={22}/></button>
          </div>

          <div className="p-10 space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 italic">Nom de la catégorie</label>
              <input 
                required value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="ex: Premium SUV"
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 italic">Description des critères</label>
              <textarea 
                rows={4} value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez les caractéristiques standards (ex: +400L de coffre, Cuir...)"
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all"
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 flex gap-3">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                Les catégories permettent aux clients de filtrer votre flotte par standing et utilité. Les standards Rental ne peuvent pas être modifiés.
              </p>
            </div>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600">Annuler</button>
            <button disabled={modalLoading}
                    className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Enregistrer la catégorie"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};