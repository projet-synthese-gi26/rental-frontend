/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useMemo } from 'react';
import { X, Loader2, User, Phone, Calendar, Search, Car, CheckCircle2, Clock, Calculator, Shield, AlertCircle } from 'lucide-react';
import { Portal } from '../../components/Portal';

interface BookingFormModalProps {
  mode: 'RESERVATION' | 'RENTAL';
  vehicles: any[];
  drivers: any[];
  isDriverRequired: boolean; // Vient de orgData.isDriverBookingRequired
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const BookingFormModal = ({ mode, vehicles, drivers, isDriverRequired, onClose, onSubmit, loading }: BookingFormModalProps) => {
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    cniNumber: '',
    vehicleId: '',
    driverId: '',
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
    let total = 0;
    let duration = 0;

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
      if (isDriverRequired) return basic && form.driverId !== '';
      return basic;
  }, [form, calculation, isDriverRequired]);

  const filteredVehicles = useMemo(() => vehicles.filter((v: any) => 
    `${v.brand} ${v.model} ${v.licencePlate}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [vehicles, searchTerm]);

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
              className="relative w-full max-w-5xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className={`px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-white ${mode === 'RESERVATION' ? 'bg-[#0528d6]' : 'bg-blue-600'}`}>
            <div>
                <h3 className="text-xl font-bold uppercase italic tracking-tighter">
                    {mode === 'RESERVATION' ? 'Initialisation Réservation' : 'Ouverture Location Directe'}
                </h3>
                <p className="text-[10px] opacity-70 font-bold uppercase italic tracking-widest">Calcul automatique des tarifs agence</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><X size={22}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-10 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="space-y-6">
                    <h4 className="text-[11px] font-black text-[#0528d6] uppercase tracking-widest italic border-b pb-2 flex items-center gap-2"><Car size={14}/> 1. Ressources</h4>
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        <button type="button" onClick={() => setForm({...form, rentalType: 'DAILY'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all ${form.rentalType === 'DAILY' ? 'bg-[#0528d6] text-white shadow-md' : 'text-slate-400'}`}>Par Jour</button>
                        <button type="button" onClick={() => setForm({...form, rentalType: 'HOURLY'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all ${form.rentalType === 'HOURLY' ? 'bg-[#0528d6] text-white shadow-md' : 'text-slate-400'}`}>Par Heure</button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <input placeholder="Filtrer par plaque ou modèle..." className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:border-[#0528d6]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredVehicles.map((v: any) => (
                            <button key={v.id} type="button" onClick={() => setForm({...form, vehicleId: v.id})}
                                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${form.vehicleId === v.id ? 'border-[#0528d6] bg-blue-50/50' : 'border-slate-50 dark:border-slate-800'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-slate-200 rounded-lg overflow-hidden shrink-0"><img src={v.images?.[0]} className="w-full h-full object-cover" alt=""/></div>
                                    <div><p className="text-xs font-black uppercase italic text-slate-700 dark:text-white">{v.brand} {v.model}</p><p className="text-[9px] font-mono text-slate-400 uppercase">{v.licencePlate}</p></div>
                                </div>
                                <p className="text-[10px] font-black text-[#0528d6]">{form.rentalType === 'DAILY' ? v.pricing?.pricePerDay : v.pricing?.pricePerHour} XAF</p>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1 flex justify-between">
                            <span>Assignation Chauffeur</span>
                            {isDriverRequired && <span className="text-red-500">Obligatoire</span>}
                        </label>
                        <select value={form.driverId} onChange={e => setForm({...form, driverId: e.target.value})} 
                                className={`w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl font-bold text-sm outline-none transition-all ${isDriverRequired && !form.driverId ? 'border-red-200' : 'border-slate-100 dark:border-slate-800'}`}>
                            <option value="">{isDriverRequired ? "Sélectionner un chauffeur..." : "Pas de chauffeur (Client conducteur)"}</option>
                            {drivers.map((d:any) => <option key={d.id} value={d.id}>{d.firstname} {d.lastname}</option>)}
                        </select>
                        {isDriverRequired && (
                            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <AlertCircle size={14} className="text-orange-500"/>
                                <p className="text-[9px] font-bold text-orange-600 uppercase">La politique de l&apos;organisation impose un chauffeur.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="text-[11px] font-black text-[#0528d6] uppercase tracking-widest italic border-b pb-2 flex items-center gap-2"><User size={14}/> 2. Détails Dossier</h4>
                    <div className="space-y-4">
                        <Input label="Nom du Client" value={form.clientName} onChange={(v:any) => setForm({...form, clientName: v})} required icon={<User size={14}/>} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Téléphone" value={form.clientPhone} onChange={(v:any) => setForm({...form, clientPhone: v})} required icon={<Phone size={14}/>} />
                            <Input label="N° CNI" value={form.cniNumber} onChange={(v:any) => setForm({...form, cniNumber: v.toUpperCase()})} required icon={<Shield size={14}/>} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Date Début" type="datetime-local" value={form.startDate} onChange={(v:any) => setForm({...form, startDate: v})} required />
                            <Input label="Date Retour" type="datetime-local" value={form.endDate} onChange={(v:any) => setForm({...form, endDate: v})} required />
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-4">
                            <div className="flex justify-between items-center text-slate-500">
                                <span className="text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2"><Clock size={12}/> Durée</span>
                                <span className="text-sm font-black italic">{calculation.duration} {form.rentalType === 'DAILY' ? 'jour(s)' : 'heure(s)'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                <span className="text-[10px] font-black uppercase text-slate-500 italic tracking-widest">Valeur du contrat</span>
                                <span className="text-lg font-black text-slate-700 dark:text-white">{calculation.total.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-[#0528d6] rounded-2xl text-white shadow-xl shadow-blue-600/20">
                                <div>
                                    <p className="text-[9px] font-bold uppercase opacity-80 italic">Acompte à valider ({mode === 'RESERVATION' ? '60%' : '100%'})</p>
                                    <p className="text-2xl font-black italic leading-none mt-1">{calculation.requested.toLocaleString()} XAF</p>
                                </div>
                                <Calculator size={28} className="opacity-30" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
          </div>

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex items-center justify-between">
            <button type="button" onClick={onClose} className="py-4 px-8 text-sm font-black text-slate-400 uppercase italic">Annuler</button>
            <button disabled={loading || !canSubmit} 
                    className="py-4 px-10 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-3 italic tracking-widest disabled:opacity-30">
              {loading ? <Loader2 className="animate-spin size-4" /> : <><CheckCircle2 size={18}/> Valider {mode === 'RESERVATION' ? 'la Réservation' : 'le Départ immédiat'}</>}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

const Input = ({ label, value, onChange, type = "text", required = false, icon, placeholder }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase italic ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0528d6] transition-colors">{icon}</div>}
      <input type={type} required={required} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} 
             className={`w-full ${icon ? 'pl-11' : 'px-4'} p-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white transition-all`} />
    </div>
  </div>
);