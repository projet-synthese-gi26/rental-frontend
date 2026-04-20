/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useMemo } from 'react';
import { X, Loader2, User, Phone, Calendar, Search, Car, CheckCircle2, Clock, Calculator, Shield, AlertCircle } from 'lucide-react';
import { Portal } from '../../components/Portal';

interface BookingFormModalProps {
  mode: 'RESERVATION' | 'RENTAL';
  vehicles: any[];
  drivers: any[];
  isDriverRequired: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  t: any;
}

export const BookingFormModal = ({ mode, vehicles, drivers, isDriverRequired, onClose, onSubmit, loading, t }: BookingFormModalProps) => {
  const [form, setForm] = useState({
    clientName: '', clientPhone: '', clientEmail: '', cniNumber: '',
    vehicleId: '', driverId: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    rentalType: 'DAILY' as 'DAILY' | 'HOURLY',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const calculation = useMemo(() => {
    const vehicle = vehicles.find((v: any) => v.id === form.vehicleId);
    if (!vehicle || !vehicle.pricing) return { total: 0, requested: 0, duration: 0 };
    const start = new Date(form.startDate).getTime();
    const end = new Date(form.endDate).getTime();
    const diffMs = Math.max(0, end - start);
    let total = 0, duration = 0;

    if (form.rentalType === 'HOURLY') {
        duration = Math.ceil(diffMs / (1000 * 60 * 60));
        total = duration * (vehicle.pricing.pricePerHour || 0);
    } else {
        duration = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        total = duration * (vehicle.pricing.pricePerDay || 0);
    }
    const requested = mode === 'RESERVATION' ? total * 0.6 : total;
    return { total, requested, duration };
  }, [form, vehicles, mode]);

  const canSubmit = useMemo(() => {
      const basic = form.vehicleId && form.clientName && form.clientPhone && calculation.total > 0;
      return isDriverRequired ? (basic && !!form.driverId) : basic;
  }, [form, calculation, isDriverRequired]);

  const filteredVehicles = useMemo(() => vehicles.filter((v: any) => 
    `${v.brand} ${v.model} ${v.licencePlate}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [vehicles, searchTerm]);

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
              className="relative w-full max-w-5xl bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className={`px-6 md:px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-white ${mode === 'RESERVATION' ? 'bg-[#0528d6]' : 'bg-blue-600'}`}>
            <div className="text-left">
                <h3 className="text-lg md:text-xl font-bold uppercase italic tracking-tighter">
                    {mode === 'RESERVATION' ? t.agencies.modal.titleAdd : t.agencies.modal.directRental || "Ouverture Location"}
                </h3>
                <p className="text-[10px] opacity-70 font-bold uppercase italic tracking-widest hidden sm:block">{t.agencies.modal.autoCalc || "Tarification dynamique"}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><X size={22}/></button>
          </div>

          <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar space-y-10 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                
                {/* PART 1 : RESOURCES */}
                <section className="space-y-6">
                    <h4 className="text-[11px] font-black text-[#0528d6] dark:text-blue-400 uppercase tracking-widest italic border-b dark:border-slate-800 pb-2 flex items-center gap-2"><Car size={14}/> 1. {t.vehicles.title || "Ressources"}</h4>
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        {(['DAILY', 'HOURLY'] as const).map(type => (
                            <button key={type} type="button" onClick={() => setForm({...form, rentalType: type})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all ${form.rentalType === type ? 'bg-[#0528d6] text-white shadow-md' : 'text-slate-400'}`}>
                                {type === 'DAILY' ? t.vehicles.modal.daily : t.vehicles.modal.hourly || type}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <input placeholder={t.vehicles.searchPlaceholder} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:border-[#0528d6] dark:text-white transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredVehicles.map((v: any) => (
                            <button key={v.id} type="button" onClick={() => setForm({...form, vehicleId: v.id})}
                                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${form.vehicleId === v.id ? 'border-[#0528d6] bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-50 dark:border-slate-800'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0"><img src={v.images?.[0]} className="w-full h-full object-cover" alt=""/></div>
                                    <div><p className="text-xs font-black uppercase italic text-slate-700 dark:text-white">{v.brand} {v.model}</p><p className="text-[9px] font-mono text-slate-400 uppercase">{v.licencePlate}</p></div>
                                </div>
                                <p className="text-[10px] font-black text-[#0528d6] dark:text-blue-400">{form.rentalType === 'DAILY' ? v.pricing?.pricePerDay : v.pricing?.pricePerHour} XAF</p>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1 flex justify-between">
                            <span>{t.staff.profile.agency || "Assignation Chauffeur"}</span>
                            {isDriverRequired && <span className="text-red-500 font-black">{t.kpi.action || "OBLIGATOIRE"}</span>}
                        </label>
                        <select value={form.driverId} onChange={e => setForm({...form, driverId: e.target.value})} 
                                className={`w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl font-bold text-sm outline-none transition-all dark:text-white ${isDriverRequired && !form.driverId ? 'border-red-200 dark:border-red-900' : 'border-slate-100 dark:border-slate-800'}`}>
                            <option value="">{isDriverRequired ? t.staff.modal.selectPlaceholder : t.staff.noDriver || "Sans chauffeur"}</option>
                            {drivers.map((d:any) => <option key={d.id} value={d.id}>{d.firstname} {d.lastname}</option>)}
                        </select>
                    </div>
                </section>

                {/* PART 2 : CLIENT DETAILS */}
                <section className="space-y-6">
                    <h4 className="text-[11px] font-black text-[#0528d6] dark:text-blue-400 uppercase tracking-widest italic border-b dark:border-slate-800 pb-2 flex items-center gap-2"><User size={14}/> 2. {t.table.customer || "Détails Dossier"}</h4>
                    <div className="space-y-4">
                        <Input label={t.agencies.modal.name || "Nom Client"} value={form.clientName} onChange={(v:any) => setForm({...form, clientName: v})} required icon={<User size={14}/>} t={t} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label={t.agencies.modal.phone} value={form.clientPhone} onChange={(v:any) => setForm({...form, clientPhone: v})} required icon={<Phone size={14}/>} t={t} />
                            <Input label={t.onboarding.form.legal} value={form.cniNumber} onChange={(v:any) => setForm({...form, cniNumber: v.toUpperCase()})} required icon={<Shield size={14}/>} t={t} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label={t.table.start} type="datetime-local" value={form.startDate} onChange={(v:any) => setForm({...form, startDate: v})} required t={t} />
                            <Input label={t.table.end} type="datetime-local" value={form.endDate} onChange={(v:any) => setForm({...form, endDate: v})} required t={t} />
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-4">
                            <div className="flex justify-between items-center text-slate-500">
                                <span className="text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2"><Clock size={12}/> {t.system.log || "Durée"}</span>
                                <span className="text-sm font-black italic">{calculation.duration} {form.rentalType === 'DAILY' ? t.vehicles.modal.days || "j" : t.vehicles.modal.hours || "h"}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-[#0528d6] rounded-2xl text-white shadow-xl shadow-blue-600/20">
                                <div>
                                    <p className="text-[9px] font-bold uppercase opacity-80 italic">{t.table.paid || "Acompte"} ({mode === 'RESERVATION' ? '60%' : '100%'})</p>
                                    <p className="text-2xl font-black italic leading-none mt-1">{calculation.requested.toLocaleString()} XAF</p>
                                </div>
                                <Calculator size={28} className="opacity-30" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
          </div>

          <div className="px-6 md:px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button type="button" onClick={onClose} className="w-full sm:w-auto py-4 px-8 text-sm font-black text-slate-400 uppercase italic hover:text-red-500 transition-colors">{t.agencies.modal.cancel}</button>
            <button disabled={loading || !canSubmit} 
                    className="w-full sm:w-auto py-4 px-10 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 italic tracking-widest disabled:opacity-30">
              {loading ? <Loader2 className="animate-spin size-4" /> : <><CheckCircle2 size={18}/> {t.agencies.modal.submit} {calculation.requested.toLocaleString()} XAF</>}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const Input = ({ label, value, onChange, type = "text", required = false, icon, placeholder, t }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0528d6] transition-colors">{icon}</div>}
      <input type={type} required={required} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} 
             className={`w-full ${icon ? 'pl-11' : 'px-4'} p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white transition-all`} />
    </div>
  </div>
);