/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle2, Loader2, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { rentalService, driverService } from '@pwa-easy-rental/shared-services';
import { Portal } from '../../components/Portal';
import DriverDetailView from '../driver/DriverDetailsView';

export const BookingWizardModal = ({ vehicle, userData, isDriverRequired, initialRentalType, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [initRes, setInitRes] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [driverDetails, setDriverDetails] = useState<any>(null);

  const localISO = (date: Date) => {
    const tzOffset: number = date.getTimezoneOffset() * 60_000;
    const localDate: Date = new Date(date.getTime() - tzOffset);
    return localDate.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    vehicleId: vehicle.id,
    driverId: '',
    clientPhone: userData?.phone || '',
    startDate: localISO(new Date(Date.now() + 60 * 60 * 1000)),
    endDate: localISO(new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000)),
    rentalType: initialRentalType || 'DAILY'
  });

  const [method, setMethod] = useState<'MOMO' | 'OM' | 'CARD'>('MOMO');

  useEffect(() => {
    const fetchAvailableDrivers = async () => {
      const res = await driverService.getAvailableDrivers(vehicle.agencyId, form.startDate, form.endDate);
      if (res.ok) setDrivers(res.data || []);
    };
    fetchAvailableDrivers();
  }, [form.startDate, form.endDate, vehicle.agencyId]);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      const res = await driverService.getDriverDetails(form.driverId);
      if (res.ok) setDriverDetails(res.data || []);
    };
    fetchDriverDetails();
    console.log("Selected driverId:", form.driverId);
  }, [form.driverId]);

  const handleCalculate = async () => {
    if (!form.clientPhone) return setError("Téléphone requis pour valider le trajet.");
    if (isDriverRequired && !form.driverId) return setError("La sélection d'un chauffeur est obligatoire pour ce véhicule.");
    
    setLoading(true);
    setError(null);
    try {
      const res = await rentalService.initiateRental(form);
      if (res.ok && res.data.isAllowed) {
        setInitRes(res.data);
        setStep(3);
      } else {
        setError(res.data?.message || "Désolé, ce créneau n'est plus disponible.");
      }
    } catch {
      setError("Le service de calcul est momentanément indisponible.");

    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!initRes?.rentalId) return;
    setLoading(true);
    setError(null);
    try {
      console.log("Processing payment with rentalId:", initRes.rentalId, "amount:", initRes.totalAmount, "method:", method);
      const res = await rentalService.payRental(initRes.rentalId, {
        amount: initRes.totalAmount,
        method
      });
      if (res.ok) {
        setStep(4);
      } else {
        setError("La transaction a été refusée par l'opérateur.");
      }
    } catch {
      setError("Erreur lors du traitement du paiement.");
    } finally {
      setLoading(false);
    }
  };

  const getDurationLabel = () => {
    const start = new Date(form.startDate).getTime();
    const end = new Date(form.endDate).getTime();
    const diffMs = end - start;
    if (form.rentalType === 'DAILY') return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24))) + " Jour(s)";
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60))) + " Heure(s)";
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 max-h-screen">
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1d2d] rounded-lg shadow-xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 py-2 ">
          <div className="px-10 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#0528d6] w-12' : 'bg-slate-200 dark:bg-slate-700 w-4'}`} />)}
            </div>
            <button onClick={onClose} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:text-red-500 transition-colors"><X size={20}/></button>
          </div>

          <div className="px-10 py-5 text-left">
            {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-[10px] font-black  italic"><AlertCircle size={18}/> {error}</div>}

            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <h3 className="text-3xl font-[900] italic tracking-tighter  text-[#0528d6] leading-none">Configuration</h3>
                <div className="space-y-5">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-800 dark:text-slate-400  italic ml-1">N° Téléphone de Contact</label><input value={form.clientPhone} onChange={e => setForm({...form, clientPhone: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-sm outline-none focus:border-[#0528d6] dark:text-white" placeholder="699 00 00 00" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-800 dark:text-slate-400  italic ml-1">Départ</label><input type="datetime-local" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-800 dark:text-slate-400  italic ml-1">Retour</label><input type="datetime-local" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-xs outline-none focus:border-[#0528d6] dark:text-white" /></div>
                  </div>
                </div>
                <button onClick={() => form.clientPhone ? setStep(2) : setError("Un numéro de téléphone est requis.")} className="w-full py-5 bg-[#0528d6] text-white rounded-[2rem] font-black text-xs  shadow-xl flex items-center justify-center gap-2 italic transition-all hover:bg-blue-700">Continuer <ChevronRight size={18}/></button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-[900] italic tracking-tighter leading-none text-[#0528d6]">Chauffeur</h3>
                    <span className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black  italic tracking-widest">{getDurationLabel()}</span>
                </div>
                <div className='flex gap-6'>
                <div className="flex-1 grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {drivers.map(d => (
                    <div key={d.id} onClick={() => setForm({...form, driverId: d.id})} 
                         className={`p-5 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center gap-4 ${form.driverId === d.id ? 'border-[#0528d6] bg-blue-50/10 shadow-md' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200'}`}>
                       <div className="size-14 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                         <img src={d.profilUrl || `https://ui-avatars.com/api/?name=${d.firstname}&background=0528d6&color=fff`} className="w-full h-full object-cover" alt="driver" />
                       </div>
                       <div className="overflow-hidden">
                          <h4 className="font-bold text-sm truncate leading-none text-slate-900 dark:text-white">{d.firstname} {d.lastname}</h4>
                          <p className="text-[10px] font-black text-[#0528d6]  mt-2">
                             +{form.rentalType === 'DAILY' ? d.pricing?.pricePerDay?.toLocaleString() : d.pricing?.pricePerHour?.toLocaleString()} XAF / {form.rentalType === 'DAILY' ? 'j' : 'h'}
                          </p>
                       </div>
                    </div>
                  ))}
                </div>
                <hr className='rotate-90'/>
                <div className='flex-[2]'>
                  {form.driverId && driverDetails?(
                     
                    <DriverDetailView data = {driverDetails}/>
                  )
                : (
                  <p> Selectionne un chauffeur parmi ceux de la colonne de gauche</p>
                )}

                </div>
                  
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs  italic transition-colors">Retour</button>
                  <button onClick={handleCalculate} disabled={loading || (isDriverRequired && !form.driverId)} className="flex-[2] py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs  tracking-widest shadow-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin size-4" /> : "Calculer mon devis"} <ChevronRight size={18}/>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && initRes && (
              <div className="space-y-2 animate-in slide-in-from-right-4">
                <h3 className="text-xl font-[900] italic tracking-tighter uppercase text-[#0528d6]">Facturation</h3>
                <div className="bg-[#0528d6] rounded-[1.5rem] p-5 text-white relative overflow-hidden shadow-xl">
                  <ShieldCheck size={200} className="absolute -bottom-3 -right-10 text-white/5 rotate-12" />
                  <div className="relative z-10 text-center">
                    <p className="text-[10px] font-bold  opacity-60 mb-1 tracking-widest italic">Devis Global Certifié</p>
                    <h4 className="text-xl font-black italic tracking-tighter leading-none">{initRes.totalAmount?.toLocaleString()} <span className="text-2xl">XAF</span></h4>
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-6 text-[10px] font-black  italic">
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 shadow-inner"><p className="opacity-60 mb-1">Caution Gérée</p><p>{initRes.depositAmount?.toLocaleString()} XAF</p></div>
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 shadow-inner"><p className="opacity-60 mb-1">Commission</p><p>{initRes.commissionAmount?.toLocaleString()} XAF</p></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['MOMO', 'OM', 'CARD'].map(m => (
                    <button key={m} onClick={() => setMethod(m as any)} className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all ${method === m ? 'border-[#0528d6] bg-blue-50/10 shadow-md' : 'border-slate-100 dark:border-slate-800 text-slate-300'}`}>
                       <CreditCard size={24} className={method === m ? 'text-[#0528d6]' : 'text-slate-300'} />
                       <span className="text-[9px] font-black  tracking-tighter">{m}</span>
                    </button>
                  ))}
                </div>
                <button onClick={handlePay} disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-[2rem] font-black text-xs  tracking-widest shadow-xl hover:bg-green-700 italic flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin size-4" /> : "Payer & Valider la Réservation"}
                </button>
                <button onClick={() => setStep(2)} className="w-full text-xs font-black text-slate-400  hover:text-[#0528d6] transition-colors text-center">Modifier mes options</button>
              </div>
            )}

            {step === 4 && (
              <div className="py-12 text-center space-y-10 animate-in zoom-in">
                <div className="size-28 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100 dark:border-green-800 shadow-inner"><CheckCircle2 size={56} /></div>
                <div>
                   <h3 className="text-4xl font-[900] italic tracking-tighter  text-slate-900 dark:text-white leading-tight">Voyage <br/><span className="text-[#0528d6]">Confirmé !</span></h3>
                   <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold italic text-sm max-w-xs mx-auto">Votre dossier est transmis à l&apos;agence. Retrouvez vos détails dans <strong>Mes Réservations</strong>.</p>
                </div>
                <button onClick={onClose} className="w-full py-5 bg-slate-900 dark:bg-white dark:text-[#0528d6] text-white rounded-[2rem] font-black text-xs  italic tracking-widest">Retour au parc</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};