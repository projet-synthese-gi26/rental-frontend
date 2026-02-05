/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Mail, ShieldCheck, MapPin, Calendar, Clock, CreditCard, History, User, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';

export const ProfileView = ({ userData, onLogout, onBack }: any) => {
  if (!userData) return null;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20 px-6 text-left">
      
      <div className="sticky top-20 z-[40] -mx-6 px-6 py-5 bg-[#f4f7fe]/95 dark:bg-[#0f1323]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase hover:text-[#0528d6] transition-all italic"
        >
          <ArrowLeft size={14} /> Retour à l&apos;accueil
        </button>
      </div>

      <div className="mt-10 space-y-10">
        <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="size-28 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] text-3xl font-bold border-4 border-white dark:border-slate-700 shadow-inner shrink-0 uppercase">
            {userData.firstname.charAt(0)}{userData.lastname.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{userData.fullname}</h3>
              {userData.status === 'ACTIVE' && <ShieldCheck className="text-blue-500" size={22} />}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs tracking-widest mb-4 uppercase">
              Client Premium — <span className="font-black text-[#0528d6]">Membre EasyRental</span>
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-slate-400">
               <span className="flex items-center gap-2 italic"><Mail size={16} className="text-[#0528d6]"/> {userData.email}</span>
               <span className="flex items-center gap-2 italic"><Calendar size={16} className="text-[#0528d6]"/> Inscrit le {new Date(userData.hiredAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
                <User className="text-[#0528d6]" size={20} />
                <h4 className="text-sm font-bold italic tracking-tighter text-slate-800 dark:text-white uppercase">Identité du compte</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataField label="Prénom" value={userData.firstname} />
                <DataField label="Nom de famille" value={userData.lastname} />
                <DataField label="Adresse email" value={userData.email} />
                <DataField label="Statut du profil" value={userData.status || 'Actif'} />
              </div>
            </section>

            <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
                <History className="text-[#0528d6]" size={20} />
                <h4 className="text-sm font-bold italic tracking-tighter text-slate-800 dark:text-white uppercase">Historique de location</h4>
              </div>
              <div className="py-12 text-center">
                 <div className="size-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                    <Clock size={32} />
                 </div>
                 <p className="text-slate-400 text-sm font-medium italic">Aucune activité enregistrée pour le moment.</p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-[#0528d6] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
               <ShieldCheck className="absolute -bottom-6 -right-6 opacity-10 rotate-12" size={120} />
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-6">Résumé financier</h4>
               <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                     <p className="text-[9px] font-bold uppercase opacity-60 mb-1 italic">Total dépensé</p>
                     <p className="text-2xl font-black">0 XAF</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                     <p className="text-[9px] font-bold uppercase opacity-60 mb-1 italic">Réservations</p>
                     <p className="text-2xl font-black">0</p>
                  </div>
               </div>
            </section>

            <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
               <h4 className="text-[10px] font-bold uppercase italic tracking-widest text-slate-400 mb-2">Options rapides</h4>
               <div className="space-y-1">
                  <MenuButton icon={<CreditCard size={18}/>} label="Portefeuille & Paiement" />
                  <MenuButton icon={<MapPin size={18}/>} label="Adresses de livraison" />
                  <MenuButton icon={<ShieldCheck size={18}/>} label="Confidentialité" />
               </div>
               <button 
                  onClick={onLogout}
                  className="w-full mt-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
               >
                  <LogOut size={14}/> Déconnexion
               </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataField = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{label}</p>
    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{value || '---'}</p>
  </div>
);

const MenuButton = ({ icon, label }: any) => (
  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-[#0528d6]">
      {icon}
      <span className="text-xs font-bold italic tracking-tight">{label}</span>
    </div>
    <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform"/>
  </button>
);