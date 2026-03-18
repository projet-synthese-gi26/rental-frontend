/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { X, Loader2, Calendar, ShieldCheck, HardDrive, Wind, Star, Settings, CheckCircle2 } from 'lucide-react';
import { Portal } from '../../components/Portal';
import { vehicleService } from '@pwa-easy-rental/shared-services';

export const VehicleDetailsModal = ({ vehicleId, onClose }: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService.getVehicleDetails(vehicleId).then(res => {
      if (res.ok) setData(res.data);
      setLoading(false);
    });
  }, [vehicleId]);

  if (loading) return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <Loader2 className="animate-spin text-white size-12" />
      </div>
    </Portal>
  );

  const { vehicle, pricing, schedule, rating, isDriverBookingRequired } = data;

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 text-left">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
        
        <div className="relative w-full max-w-5xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/10 animate-in zoom-in">
          <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1a1d2d]">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white  italic tracking-tighter">
                Fiche Technique <span className="text-[#0528d6]">#FL-{vehicle.id.substring(0,8).to()}</span>
              </h3>
              <p className="text-[10px] text-slate-400  font-black tracking-widest mt-1 italic">Consultation exhaustive des spécifications</p>
            </div>
            <button onClick={onClose} className="size-12 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={24}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-6">
                <div className="aspect-square rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                    <img src={vehicle.images?.[0]} className="w-full h-full object-cover" alt="car"/>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black  text-slate-400 italic">Score Avis</span>
                        <div className="flex items-center gap-1 text-orange-500 font-black italic"><Star size={16} fill="currentColor"/> {rating?.toFixed(1)}</div>
                    </div>
                    <div className="space-y-3">
                        <PriceRow label="Prix / Heure" value={pricing?.pricePerHour} />
                        <PriceRow label="Prix / Jour" value={pricing?.pricePerDay} />
                    </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <section>
                    <SectionTitle icon={<Settings />} title="Identité & Châssis" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                        <DataField label="Marque" value={vehicle.brand} />
                        <DataField label="Modèle" value={vehicle.model} />
                        <DataField label="Immatriculation" value={vehicle.licencePlate} mono />
                        <DataField label="VIN (Châssis)" value={vehicle.vinNumber} mono />
                        <DataField label="Année" value={new Date(vehicle.yearProduction).getFullYear()} />
                        <DataField label="Kilométrage" value={`${vehicle.kilometrage} KM`} />
                    </div>
                </section>

                <section>
                    <SectionTitle icon={<HardDrive />} title="Moteur & Efficacité" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                        <DataField label="Moteur" value={vehicle.engineDetails?.type} />
                        <DataField label="Puissance" value={`${vehicle.engineDetails?.horsepower} HP`} />
                        <DataField label="Conso. Ville" value={vehicle.fuelEfficiency?.city} />
                        <DataField label="Conso. Route" value={vehicle.fuelEfficiency?.highway} />
                        <DataField label="Transmission" value={vehicle.transmission} />
                    </div>
                </section>

                <section>
                    <SectionTitle icon={<Wind />} title="Équipements & Confort" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {Object.entries(vehicle.functionalities).map(([key, val]: any) => (
                            <div key={key} className={`flex items-center gap-2 p-2 rounded-xl border ${val ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100 opacity-50'}`}>
                                <CheckCircle2 size={12}/>
                                <span className="text-[9px] font-black  italic truncate">{key.replace('_', ' ')}</span>
                            </div>
                        ))}
                    </div>
                </section>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <SectionTitle icon={<Calendar />} title="Planning d'indisponibilité" />
                    <div className="space-y-3 mt-6">
                        {schedule?.length > 0 ? schedule.map((s: any) => (
                            <div key={s.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-black text-slate-800 dark:text-white  italic">{s.reason}</p>
                                    <p className="text-[10px] text-slate-400 font-bold italic">Du {new Date(s.startDate).toLocaleDateString()} au {new Date(s.endDate).toLocaleDateString()}</p>
                                </div>
                                <span className="text-[9px] font-black  px-2 py-1 bg-orange-50 text-orange-600 rounded-lg">{s.status}</span>
                            </div>
                        )) : <p className="text-sm italic text-slate-400 text-center py-4">Aucune indisponibilité enregistrée.</p>}
                    </div>
                </section>

                <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <SectionTitle icon={<ShieldCheck />} title="Assurance & Légal" />
                    <div className="space-y-4 mt-6">
                        <DataField label="Compagnie" value={vehicle.insuranceDetails?.provider} />
                        <DataField label="Numéro Police" value={vehicle.insuranceDetails?.policy_number} mono />
                        <DataField label="Date Expiration" value={new Date(vehicle.insuranceDetails?.expiry).toLocaleDateString()} />
                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                            <DataField label="Chauffeur requis" value={isDriverBookingRequired ? "OUI (Obligatoire)" : "NON (Libre)"} />
                        </div>
                    </div>
                </section>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const SectionTitle = ({ icon, title }: any) => (
    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="text-[#0528d6]">{icon}</div>
        <h4 className="text-sm font-black  italic text-slate-800 dark:text-white">{title}</h4>
    </div>
);

const DataField = ({ label, value, mono }: any) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black  text-slate-400 italic tracking-widest">{label}</p>
        <p className={`text-sm font-black text-slate-800 dark:text-white italic ${mono ? 'font-mono  bg-slate-50 dark:bg-slate-800 px-1 rounded' : ''}`}>{value || '---'}</p>
    </div>
);

const PriceRow = ({ label, value }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <span className="text-[10px] font-black  text-slate-500 italic">{label}</span>
        <span className="text-lg font-black text-[#0528d6] italic">{value?.toLocaleString()} <span className="text-[10px] text-slate-400">XAF</span></span>
    </div>
);