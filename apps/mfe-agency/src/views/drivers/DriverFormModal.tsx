/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const DriverFormModal = ({ editingDriver, onSubmit, onClose, modalLoading, error }: any) => {
  const [form, setForm] = useState({
    firstname: editingDriver?.firstname || '',
    lastname: editingDriver?.lastname || '',
    tel: editingDriver?.tel || '',
    age: editingDriver?.age || '',
    gender: editingDriver?.gender || 0,
  });

  const [files, setFiles] = useState({
    profil: null as File | null,
    cni: null as File | null,
    license: null as File | null
  });

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstname', form.firstname);
    formData.append('lastname', form.lastname);
    formData.append('tel', form.tel);
    formData.append('age', form.age.toString());
    formData.append('gender', form.gender.toString());
    
    if (files.profil) formData.append('profil', files.profil);
    if (files.cni) formData.append('cni', files.cni);
    if (files.license) formData.append('license', files.license);

    onSubmit(formData);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <form onSubmit={handleLocalSubmit} 
              className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingDriver ? "Modifier le chauffeur" : "Nouveau chauffeur"}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 italic">Enregistrement DriverRequest (Multipart)</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={22}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
            {error && <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase italic">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Prénom</label>
                <input required value={form.firstname} onChange={e => setForm({...form, firstname: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Nom</label>
                <input required value={form.lastname} onChange={e => setForm({...form, lastname: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Téléphone</label>
                <input required type="tel" value={form.tel} onChange={e => setForm({...form, tel: e.target.value.replace(/\D/g, '')})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Âge</label>
                  <input required type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 italic">Genre</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6]">
                    <option value={0}>Homme</option>
                    <option value={1}>Femme</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800 text-left">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest italic mb-4">Documents requis</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileUpload label="Photo Profil" onFile={(f:any) => handleFileChange('profil', f)} hasFile={!!files.profil} />
                <FileUpload label="Scan CNI" onFile={(f:any) => handleFileChange('cni', f)} hasFile={!!files.cni} />
                <FileUpload label="Scan Permis" onFile={(f:any) => handleFileChange('license', f)} hasFile={!!files.license} />
              </div>
            </div>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
            <button disabled={modalLoading || (!editingDriver && (!files.profil || !files.cni || !files.license))}
                    className="flex-[2] py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:grayscale disabled:opacity-50">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : "Valider le dossier"}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const FileUpload = ({ label, onFile, hasFile }: any) => (
  <div className="relative group flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:border-[#0528d6]">
    {hasFile ? <CheckCircle2 className="text-green-500 mb-1" size={20} /> : <UploadCloud className="text-slate-300 mb-1" size={20} />}
    <span className="text-[9px] font-bold uppercase text-slate-500 text-center leading-tight">{label}</span>
    <input type="file" onChange={e => onFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
  </div>
);