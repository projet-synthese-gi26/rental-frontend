/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useRef } from 'react';
import { X, Loader2, Hash, Settings, Wind, ShieldCheck, Image as ImageIcon, Trash2, UploadCloud, Layers, Binary, Palette } from 'lucide-react';
import { Portal } from '../../components/Portal';
import { extraService } from '@pwa-easy-rental/shared-services';

export const VehicleFormModal = ({ editingVehicle, categories, initialData, onSubmit, onClose, modalLoading, error, t }: any) => {
  const [formData, setFormData] = useState(initialData);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append('file', file);
    try {
      const res = await extraService.uploadMedia(body);
      if (res.ok) {
        setFormData((prev: any) => ({ ...prev, images:[...prev.images, res.data.url] }));
      }
    } finally { setUploading(false); }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== index) }));
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
              className="relative w-full max-w-5xl bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-6 md:px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                {editingVehicle ? t.vehicles.modal.titleEdit : t.vehicles.modal.titleAdd}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 italic">{t.agencies.modal.submit}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={22}/></button>
          </div>

          <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar space-y-10 text-left">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase italic">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label={t.vehicles.modal.marque} value={formData.brand} onChange={(v:any) => setFormData({...formData, brand: v})} required placeholder="ex: Toyota" />
                <Input label={t.vehicles.modal.modele} value={formData.model} onChange={(v:any) => setFormData({...formData, model: v})} required placeholder="ex: RAV4" />
                <Input label={t.vehicles.modal.plate} value={formData.licencePlate} onChange={(v:any) => setFormData({...formData, licencePlate: v.toUpperCase()})} required icon={<Hash size={14}/>} />
                
                <Input label="VIN (Châssis)" value={formData.vinNumber} onChange={(v:any) => setFormData({...formData, vinNumber: v.toUpperCase()})} required icon={<Binary size={14}/>} placeholder="17 chars" />
                <Input label="Couleur" value={formData.color} onChange={(v:any) => setFormData({...formData, color: v})} icon={<Palette size={14}/>} />
                <Input label="Production" type="date" value={formData.yearProduction} onChange={(v:any) => setFormData({...formData, yearProduction: v})} />

                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase italic ml-1 flex items-center gap-2"><Layers size={12}/> {t.vehicles.modal.category}</label>
                    <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white transition-all">
                        <option value="">{t.staff.modal.selectPlaceholder}</option>
                        {categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <Input label={t.vehicles.modal.km} type="number" value={formData.kilometrage} onChange={(v:any) => setFormData({...formData, kilometrage: v})} />
                <Input label={t.vehicles.modal.places} type="number" value={formData.places} onChange={(v:any) => setFormData({...formData, places: v})} />
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center border-b dark:border-slate-800 pb-2">
                    <h4 className="text-[11px] font-black text-[#0528d6] dark:text-blue-400 uppercase italic flex items-center gap-2"><ImageIcon size={16}/> {t.table.viewAll || 'Galerie Photos'}</h4>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-[#0528d6] dark:text-blue-400 rounded-xl text-[9px] font-black uppercase italic border border-blue-100 dark:border-blue-800 hover:bg-[#0528d6] hover:text-white transition-all flex items-center gap-2">
                        {uploading ? <Loader2 size={12} className="animate-spin"/> : <UploadCloud size={12}/>} {t.side.addCta}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {formData.images.map((url: string, idx: number) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 group shadow-sm">
                            <img src={url} className="w-full h-full object-cover" alt="car" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                <Trash2 size={10}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="px-6 md:px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col sm:flex-row gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase italic hover:text-red-500 transition-colors">{t.vehicles.modal.cancel}</button>
            <button disabled={modalLoading || uploading} className="flex-[2] py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 italic tracking-widest">
              {modalLoading ? <Loader2 className="animate-spin size-4" /> : t.vehicles.modal.submit}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const Input = ({ label, value, onChange, type = "text", required = false, icon, placeholder, dark }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1 tracking-widest">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0528d6] transition-colors">{icon}</div>}
      <input type={type} required={required} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} 
             className={`w-full ${icon ? 'pl-10' : 'px-4'} p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-xs outline-none focus:border-[#0528d6] transition-all shadow-sm`} />
    </div>
  </div>
);