/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Mail, ShieldCheck, Clock,  History,  LogOut, ArrowLeft } from 'lucide-react';
import { authService } from '@shared-services/api';


export const ProfileView = ({ userData, onLogout, onBack }: any) => {
  const [identity, setIdentity] = useState<any>(null);
  const [passwords, setPasswords] = useState<any>({ old: '', new: '' });

  useEffect(() => { 
    if (userData){
      setIdentity({
        firstname: userData.firstname,
        lastname: userData.lastname
      });
    }
  }, [userData]);
  if (!userData) return null;

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile({firstname: identity.firstname, lastname: identity.lastname });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
    
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.updatePassword({oldPassword : passwords.old,newPassword : passwords.new})
    console.log("Mise à jour mot de passe");
  };

  
  return (
    <div className="mx-auto animate-in fade-in duration-700 pb-20 px-6 text-left">
      
      <div className="absolute sticky z-[40] -mx-6 px-6 py-3 bg-[#f4f7fe]/95 dark:bg-[#0f1323]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-[#0528d6] transition-all   "
        >
          <ArrowLeft size={14} /> Retour à l&apos;accueil
        </button>
      </div>

       <section className="relative min-h-[400px] rounded-[0.5rem] bg-[#0528d6] overflow-hidden flex flex-col items-center justify-start text-white shadow-xl shadow-blue-600/20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/client/hero_car.png"
            className="w-full h-full object-cover" 
            alt="car background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-transparent" />
        </div>

        <div className="relative mt-auto w-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="size-24 rounded-full bg-white p-1.5 ">
              <div className="w-full h-full rounded-full  flex items-center justify-center border-4 border-blue-50">
                <span className="text-2xl text-[#0528d6] tracking-tighter">
                  {userData?.firstname?.charAt(0)}{userData?.lastname?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white backdrop-blur-md pt-16 pb-10 px-8 rounded-b-[0.5rem] text-center mt-4 flex flex-col items-center gap-2">
            <h2 className="text-xl font-black text-black ">{userData?.firstname} {userData?.lastname}</h2>
            <span className="px-4 py-1 text-[#0528d6] text-sm font-black "> {userData?.role || 'Visiteur'}</span>
            <p className="text-xs font-bold text-slate-400 mt-2">
              <span className="flex items-center gap-2   "><Mail size={16} className="text-[#0528d6]"/> {userData.email}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-4">
        <div className="flex flex-wrap gap-3">
        <div className="  space-y-3">
          <h3 className="text-sm font-bold tracking-tighter text-slate-800 dark:text-white">Informations du compte</h3>
          <section className="flex-[2] bg-white dark:bg-[#1a1d2d] rounded-[0.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <form onSubmit={updateProfile} className="flex gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ">Prénom</label>
                <input 
                  value={identity?.firstname || " "}
                  onChange={(e) => setIdentity({...identity, firstname: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0528d6] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ">Nom de famille</label>
                <input 
                  value={identity?.lastname ||""}
                  onChange={(e) => setIdentity({...identity, lastname: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0528d6] outline-none transition-all"
                />
              </div>
              <div className="space-y-6 flex items-end">
                <label className="h-[10px]"></label>
                <button type="submit" className=" bg-[#0528d6] text-white p-3 rounded-xl text-[10px] font-black hover:bg-blue-700 transition-all">
                  Mettre à jour le profil
                </button>
              </div>
            </form>
            <form onSubmit={updatePassword} className="flex gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ">Nouveau mot de passe</label>
                <input 
                  type="password"
                  value={passwords.old}
                  onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                  placeholder="*********"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0528d6] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400">Nouveau mot de passe</label>
                <input 
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  placeholder="*********"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0528d6] outline-none transition-all"
                />
              </div>
              <div className="space-y-3 flex items-end">
                <label className="h-[10px]"></label>
                <button type="submit" className="bg-slate-900 text-white p-3 rounded-xl text-[10px] font-black hover:bg-black transition-all ">
                  Modifier le mot de passe
                </button>
              </div>
              
            </form>
            </section>
          </div>
          
            <section className=" flex-1 bg-[#0528d6] rounded-[0.5rem] p-3 text-white shadow-xl relative overflow-hidden">
               <ShieldCheck className="absolute -bottom-6 -right-6 opacity-10 rotate-12" size={120} />
               <h4 className="text-[10px] font-bold tracking-[0.2em] opacity-60 mb-6">Résumé financier</h4>
               <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                     <p className="text-[9px] font-bold opacity-60 mb-1   ">Total dépensé</p>
                     <p className="text-2xl font-black">0 XAF</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                     <p className="text-[9px] font-bold opacity-60 mb-1   ">Réservations</p>
                     <p className="text-2xl font-black">0</p>
                  </div>
               </div>
            </section>
          </div>

          <section className="bg-white dark:bg-[#1a1d2d] rounded-[0.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
                <History className="text-[#0528d6]" size={20} />
                <h4 className="text-sm font-bold    tracking-tighter text-slate-800 dark:text-white  ">Historique de location</h4>
              </div>
              <div className="py-12 text-center">
                 <div className="size-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                    <Clock size={32} />
                 </div>
                 <p className="text-slate-400 text-sm font-medium   ">Aucune activité enregistrée pour le moment.</p>
              </div>
            </section>

          <div className="space-y-3">

            <section className="bg-white dark:bg-[#1a1d2d] rounded-[0.5rem] p-1 border border-slate-200 dark:border-slate-800">
               <button 
                  onClick={onLogout}
                  className="w-full  py-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
               >
                  <LogOut size={14}/> Déconnexion
               </button>
            </section>
          </div>
        
      </div>
    </div>
  );
};
