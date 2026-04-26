/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { X, Loader2, UploadCloud, CheckCircle2, User, Phone } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const DriverFormModal = ({ editingDriver, onSubmit, onClose, modalLoading, error, t }: any) => {
  const [form, setForm] = useState({
    firstname: editingDriver?.firstname || '',
    lastname: editingDriver?.lastname || '',
    tel: editingDriver?.tel || '',
    age: editingDriver?.age || '',
    gender: editingDriver?.gender || 0,
  });

  const [files, setFiles] = useState({ profil: null as File | null, cni: null as File | null, license: null as File | null });

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v.toString()));
    if (files.profil) formData.append('profil', files.profil);
    if (files.cni) formData.append('cni', files.cni);
    if (files.license) formData.append('license', files.license);
    onSubmit(formData);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 md:p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        <form onSubmit={handleLocalSubmit} 
              className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-6 md:px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div className="text-left">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                {editingDriver ? t.staff.modal.titleEdit : t.staff.addBtn}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 italic">{t.driverForm.docHint}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={22}/></button>
          </div>

          <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar space-y-8">
            {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase italic tracking-widest">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <Input label={t.auth.firstname} value={form.firstname} onChange={(v:any) => setForm({...form, firstname: v})} required icon={<User size={14}/>} />
              <Input label={t.auth.lastname} value={form.lastname} onChange={(v:any) => setForm({...form, lastname: v})} required icon={<User size={14}/>} />
              <Input label={t.agencies.modal.phone} type="tel" value={form.tel} onChange={(v:any) => setForm({...form, tel: v.replace(/\D/g, '')})} required icon={<Phone size={14}/>} />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t.driverForm.age} type="number" value={form.age} onChange={(v:any) => setForm({...form, age: v})} required />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1 tracking-widest">{t.driverForm.gender}</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white transition-all">
                    <option value={0}>{t.driverForm.male}</option>
                    <option value={1}>{t.driverForm.female}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800 text-left">
              <h4 className="text-[10px] font-black uppercase text-[#0528d6] tracking-[0.2em] italic mb-6">{t.driverForm.scanDocs}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileUpload label={t.driverForm.photoProfil} onFile={(f:any) => setFiles(p => ({...p, profil: f}))} hasFile={!!files.profil} />
                <FileUpload label={t.driverForm.scanCni} onFile={(f:any) => setFiles(p => ({...p, cni: f}))} hasFile={!!files.cni} />
                <FileUpload label={t.driverForm.scanLicense} onFile={(f:any) => setFiles(p => ({...p, license: f}))} hasFile={!!files.license} />
              </div>
            </div>
          </div>

          <div className="px-6 md:px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex flex-col sm:flex-row gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase italic hover:text-red-500 transition-colors">{t.staff.modal.cancel}</button>
            <button disabled={modalLoading || (!editingDriver && (!files.profil || !files.cni || !files.license))}
                    className="flex-[2] py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:grayscale disabled:opacity-50 italic tracking-widest">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : t.staff.modal.submit}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const FileUpload = ({ label, onFile, hasFile }: any) => (
  <div className="relative group flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl transition-all hover:border-[#0528d6] hover:bg-white dark:hover:bg-slate-800 cursor-pointer">
    {hasFile ? <CheckCircle2 className="text-green-500 mb-2" size={24} /> : <UploadCloud className="text-slate-300 mb-2 group-hover:text-[#0528d6]" size={24} />}
    <span className="text-[8px] font-black uppercase text-slate-500 text-center leading-tight tracking-widest">{label}</span>
    <input type="file" onChange={e => onFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
  </div>
);

const Input = ({ label, value, onChange, type = "text", required = false, icon }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1 tracking-widest">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0528d6] transition-colors">{icon}</div>}
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} 
             className={`w-full ${icon ? 'pl-11' : 'px-4'} p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white transition-all`} />
    </div>
  </div>
);