'use client';
import React, { useState } from 'react';
import { X, Loader2, Mail, User, Store, Shield, UserCheck } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const StaffFormModal = ({ editingStaff, agencies, postes, initialData, onSubmit, onClose, modalLoading }: any) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
              className="relative w-full max-w-xl bg-white dark:bg-[#1a1d2d] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingStaff ? "Mettre à jour le contrat" : "Recruter un membre"}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 italic">Gestion des accès staff</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={22}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" value={formData.firstname} onChange={v => setFormData({...formData, firstname: v})} required icon={<User size={16}/>} />
              <Input label="Nom" value={formData.lastname} onChange={v => setFormData({...formData, lastname: v})} required icon={<User size={16}/>} />
            </div>

            {/* Email uniquement à la création selon StaffRequestDTO */}
            {!editingStaff && (
              <Input label="Email de l'utilisateur" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} required icon={<Mail size={16}/>} />
            )}

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                  <Store size={14} className="text-[#0528d6]"/> Affectation agence
                </label>
                <select 
                  required value={formData.agencyId} 
                  onChange={e => setFormData({...formData, agencyId: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all"
                >
                  <option value="">Sélectionner une agence...</option>
                  {agencies.map((a: any) => <option key={a.id} value={a.id}>{a.name} ({a.city})</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                  <Shield size={14} className="text-[#0528d6]"/> Poste & Permissions
                </label>
                <select 
                  required value={formData.posteId} 
                  onChange={e => setFormData({...formData, posteId: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all"
                >
                  <option value="">Attribuer un rôle...</option>
                  {postes.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {editingStaff && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                    <UserCheck size={14} className="text-[#0528d6]"/> Statut du compte
                  </label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all"
                  >
                    <option value="ACTIVE">Actif (Accès autorisé)</option>
                    <option value="SUSPENDED">Suspendu (Accès bloqué)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
            <button disabled={modalLoading}
                    className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : editingStaff ? "Mettre à jour" : "Confirmer le recrutement"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const Input = ({ label, value, onChange, type = "text", required = false, icon }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0528d6] transition-colors">{icon}</div>}
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} 
             className={`w-full ${icon ? 'pl-10' : 'px-4'} p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all`} />
    </div>
  </div>
);