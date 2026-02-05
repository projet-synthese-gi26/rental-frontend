/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { driverService, vehicleService } from '@pwa-easy-rental/shared-services';
import { X, Calendar, Star, Loader2, User, Car } from 'lucide-react';
import { Portal } from '../../components/Portal';

interface ResourceDetailsModalProps {
  resourceId: string;
  type: 'VEHICLE' | 'DRIVER';
  onClose: () => void;
}

export const ResourceDetailsModal = ({ resourceId, type, onClose }: ResourceDetailsModalProps) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = type === 'VEHICLE' 
        ? await vehicleService.getVehicleDetails(resourceId)
        : await driverService.getDriverDetails(resourceId);
      
      if (res.ok) setDetails(res.data);
      setLoading(false);
    };
    fetchDetails();
  }, [resourceId, type]);

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-white/20 animate-in zoom-in">
          
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Détails Opérationnels
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 italic">
                Consulter le planning et les avis
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={22}/>
            </button>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#0528d6] size-10" />
            </div>
          ) : (
            <div className="p-10 overflow-y-auto custom-scrollbar space-y-10 text-left">
              
              {/* HEADER INFO */}
              <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#0528d6] shadow-sm">
                  {type === 'VEHICLE' ? <Car size={32}/> : <User size={32}/>}
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    {type === 'VEHICLE' ? `${details.vehicle.brand} ${details.vehicle.model}` : `${details.driver.firstname} ${details.driver.lastname}`}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-orange-500 font-black text-sm">★ {details.rating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">({details.reviews?.length || 0} avis)</span>
                  </div>
                </div>
              </div>

              {/* PLANNING / SCHEDULE */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="text-[#0528d6]" size={18} />
                  <h5 className="text-sm font-black uppercase tracking-tighter">Calendrier d&apos;indisponibilité</h5>
                </div>
                
                {details.schedule?.length > 0 ? (
                  <div className="space-y-3">
                    {details.schedule.map((s: any) => (
                      <div key={s.id} className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{s.reason || "Indisponibilité"}</p>
                          <p className="text-[11px] text-slate-400 italic">
                            Du {new Date(s.startDate).toLocaleDateString()} au {new Date(s.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded-lg">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-xs text-slate-400 italic">Aucune période d&apos;indisponibilité enregistrée.</p>
                  </div>
                )}
              </section>

              {/* REVIEWS SECTION */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Star className="text-[#0528d6]" size={18} />
                  <h5 className="text-sm font-black uppercase tracking-tighter">Avis des clients</h5>
                </div>

                <div className="space-y-4">
                  {details.reviews?.length > 0 ? details.reviews.map((r: any) => (
                    <div key={r.id} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold">{r.authorName}</span>
                        <div className="flex text-orange-500">
                          {[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                        &quot;{r.comment}&quot;
                      </p>
                      <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
                        Posté le {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400 italic text-center py-4">Aucun avis pour le moment.</p>
                  )}
                </div>
              </section>

            </div>
          )}

          <div className="px-10 py-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30">
            <button onClick={onClose} className="w-full py-3 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20">
              Fermer la vue
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};