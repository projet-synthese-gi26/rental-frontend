/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { X, Calendar, User, Car, CreditCard, ShieldCheck, MapPin, Phone, Clock, Banknote, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { Portal } from '../../components/Portal';

export const RentalDetailsModal = ({ rental, onClose }: any) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
      case 'ONGOING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'RESERVED': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'UNDER_REVIEW': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 text-left">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
        <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/10 animate-in zoom-in">
          <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Dossier de Location</h3>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(rental.status)}`}>{rental.status}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Reference: {rental.id}</p>
            </div>
            <button onClick={onClose} className="size-12 bg-white dark:bg-slate-800 flex items-center justify-center rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X size={24}/></button>
          </div>

          <div className="p-10 overflow-y-auto custom-scrollbar space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-[#0528d6] italic border-b pb-2 flex items-center gap-2"><User size={14}/> Client</h4>
                    <div className="space-y-4">
                        <DataRow label="Nom complet" value={rental.clientName} />
                        <DataRow label="Téléphone" value={rental.clientPhone} icon={<Phone size={10}/>} />
                        <DataRow label="ID Client" value={rental.clientId?.substring(0,12)} mono />
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-[#0528d6] italic border-b pb-2 flex items-center gap-2"><Calendar size={14}/> Période</h4>
                    <div className="space-y-4">
                        <DataRow label="Date de départ" value={new Date(rental.startDate).toLocaleString()} />
                        <DataRow label="Date de retour" value={new Date(rental.endDate).toLocaleString()} />
                        <DataRow label="Type Facturation" value={rental.rentalType} />
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-[#0528d6] italic border-b pb-2 flex items-center gap-2"><Banknote size={14}/> État Financier</h4>
                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-slate-400 uppercase">Total Dossier</span><span className="text-sm font-black text-slate-900 dark:text-white">{rental.totalAmount?.toLocaleString()} XAF</span></div>
                        <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-slate-400 uppercase">Montant Perçu</span><span className="text-sm font-black text-green-500">{rental.amountPaid?.toLocaleString()} XAF</span></div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200"><span className="text-[9px] font-bold text-slate-400 uppercase">Caution</span><span className="text-sm font-black text-orange-500">{rental.depositAmount?.toLocaleString()} XAF</span></div>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-[#0528d6] rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                    <Car size={150} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
                    <h4 className="text-xs font-black uppercase italic mb-6 opacity-70">Ressources Assignées</h4>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                            <Car size={24}/>
                            <div>
                                <p className="text-[8px] font-bold uppercase opacity-60">Véhicule Licence</p>
                                <p className="text-sm font-black italic">{rental.licencePlate || 'NON ASSIGNÉ'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                            <User size={24}/>
                            <div>
                                <p className="text-[8px] font-bold uppercase opacity-60">Chauffeur Name</p>
                                <p className="text-sm font-black italic">{(rental.firstname + ' ' + rental.lastname) || 'NON ASSIGNÉ'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                    <ShieldCheck size={150} className="absolute -bottom-10 -right-10 opacity-5" />
                    <h4 className="text-xs font-black uppercase italic mb-6 opacity-70">Traçabilité Opérationnelle</h4>
                    <div className="space-y-4">
                        <DataRow label="Agence ID" value={rental.agencyId} dark />
                        <DataRow label="Dernière Mise à jour" value={new Date(rental.updatedAt).toLocaleString()} dark />
                        <div className="flex items-center gap-3 pt-4">
                            <div className="size-2 rounded-full bg-green-500 animate-pulse"/>
                            <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">Dossier en règle avec la politique fiscalité</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const DataRow = ({ label, value, icon, mono, dark }: any) => (
    <div className="flex justify-between items-center group">
        <span className={`text-[9px] font-black uppercase italic tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
        <div className="flex items-center gap-2">
            {icon && <span className="text-[#0528d6]">{icon}</span>}
            <span className={`text-sm font-black italic ${dark ? 'text-slate-300' : 'text-slate-800 dark:text-slate-100'} ${mono ? 'font-mono' : ''}`}>{value || '---'}</span>
        </div>
    </div>
);