/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, Lock, CheckSquare, Square, Check } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const RoleFormModal = ({ editingPoste, permissionsByModule, initialData, onSubmit, onClose, modalLoading }: any) => {
  const [formData, setFormData] = useState(initialData);

  const togglePermission = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id) 
        ? prev.permissionIds.filter((pid: string) => pid !== id) 
        : [...prev.permissionIds, id]
    }));
  };

  const toggleModuleGroup = (moduleName: string) => {
    const modulePermIds = permissionsByModule[moduleName].map((p: any) => p.id);
    const areAllSelected = modulePermIds.every((id: string) => formData.permissionIds.includes(id));
    
    setFormData((prev: any) => ({
      ...prev,
      permissionIds: areAllSelected 
        ? prev.permissionIds.filter((id: string) => !modulePermIds.includes(id))
        : Array.from(new Set([...prev.permissionIds, ...modulePermIds]))
    }));
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
              className="relative w-full max-w-4xl bg-white dark:bg-[#1a1d2d] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in border border-white/20">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingPoste ? "Modifier le poste" : "Créer un nouveau poste"}
              </h3>
              <p className="text-[10px] text-slate-400  font-bold tracking-widest mt-1 italic">Configuration des accès</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={22} className="text-slate-400" />
            </button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400  tracking-wider ml-1 italic">Nom du poste</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                       className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400  tracking-wider ml-1 italic">Description</label>
                <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                       className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-[#0528d6] flex items-center gap-2 border-b pb-2  tracking-tighter">
                <Lock size={16}/> Matrice des privilèges
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.keys(permissionsByModule).map((module) => {
                  const modulePermIds = permissionsByModule[module].map((p: any) => p.id);
                  const isAllSelected = modulePermIds.every((id: string) => formData.permissionIds.includes(id));

                  return (
                    <div key={module} className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold  text-slate-500 italic tracking-widest">{module}</span>
                        <button type="button" onClick={() => toggleModuleGroup(module)}
                                className={`flex items-center gap-2 text-[10px] font-bold  transition-colors ${isAllSelected ? 'text-[#F76513]' : 'text-[#0528d6]'}`}>
                          {isAllSelected ? <CheckSquare size={14} /> : <Square size={14} />} {isAllSelected ? 'Décocher' : 'Tout cocher'}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {permissionsByModule[module].map((perm: any) => (
                          <div key={perm.id} onClick={() => togglePermission(perm.id)}
                               className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer group ${formData.permissionIds.includes(perm.id) ? 'border-[#0528d6] bg-blue-50/30' : 'border-slate-100 dark:border-slate-800'}`}>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-700 dark:text-white">{perm.name}</p>
                              <p className="text-[10px] text-slate-400 italic leading-tight">{perm.description}</p>
                            </div>
                            <div className={`size-5 rounded-md border-2 flex items-center justify-center ml-3 ${formData.permissionIds.includes(perm.id) ? 'bg-[#0528d6] border-[#0528d6] text-white' : 'border-slate-200'}`}>
                              {formData.permissionIds.includes(perm.id) && <Check size={12} strokeWidth={4} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
            <button disabled={modalLoading}
                    className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Enregistrer le poste"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};