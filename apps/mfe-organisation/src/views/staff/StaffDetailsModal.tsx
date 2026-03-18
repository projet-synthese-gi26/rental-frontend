/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { X, Loader2, ShieldCheck, Mail, Store, Calendar, UserCheck, Lock, Fingerprint } from 'lucide-react';
import { Portal } from '../../components/Portal';
import { staffService, agencyService } from '@pwa-easy-rental/shared-services';

export const StaffDetailsModal = ({ staffId, onClose }: any) => {
  const [data, setData] = useState<any>(null);
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await staffService.getStaffDetails(staffId);
        if (res.ok && res.data) {
          setData(res.data);
          const agRes = await agencyService.getAgencyDetails(res.data.agencyId);
          if (agRes.ok) setAgency(agRes.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [staffId]);

  if (loading || !data) return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
        <Loader2 className="animate-spin text-white size-12" />
      </div>
    </Portal>
  );

  return (
    <Portal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 text-left">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
        <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/10 animate-in zoom-in">
          <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-[#0528d6] text-white flex items-center justify-center text-2xl font-black italic shadow-lg">
                    {data.firstname?.[0]}{data.lastname?.[0]}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white  italic tracking-tighter leading-none">
                        {data.firstname} {data.lastname}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold  tracking-widest mt-2 italic">ID Collaborateur: {data.id?.substring(0,12)}</p>
                </div>
            </div>
            <button onClick={onClose} className="size-12 bg-white dark:bg-slate-800 flex items-center justify-center rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X size={24}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-6">
                    <h4 className="text-xs font-black  text-[#0528d6] italic border-b pb-2 flex items-center gap-2"><Fingerprint size={16}/> Informations Contrat</h4>
                    <div className="space-y-4">
                        <InfoRow icon={<Mail/>} label="Email Professionnel" value={data.email} />
                        <InfoRow icon={<Store/>} label="Affectation" value={agency?.name || 'Non assigné'} />
                        <InfoRow icon={<Calendar/>} label="Date d'embauche" value={new Date(data.hiredAt).toLocaleDateString()} />
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <UserCheck className={data.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'} size={20}/>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 ">Statut du compte</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white  italic">{data.status}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="text-xs font-black  text-[#0528d6] italic border-b pb-2 flex items-center gap-2"><Lock size={16}/> Habilitations Poste</h4>
                    <div className="p-6 bg-[#0528d6] rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                        <ShieldCheck size={120} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold  opacity-60 mb-1">Rôle Système</p>
                            <h5 className="text-xl font-black italic tracking-tighter  mb-4">{data.poste?.name || 'Aucun poste'}</h5>
                            <div className="flex flex-wrap gap-2">
                                {data.poste?.permissions?.map((p: any) => (
                                    <span key={p.id} className="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-black  border border-white/10">{p.name}</span>
                                ))}
                            </div>
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

const InfoRow = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-4 group">
        <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#0528d6] transition-colors">{React.cloneElement(icon, { size: 18 })}</div>
        <div>
            <p className="text-[9px] font-black text-slate-400  tracking-widest">{label}</p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-100 italic">{value || '---'}</p>
        </div>
    </div>
);