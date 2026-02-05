/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { 
  Mail, ShieldCheck, 
  Building2, Globe2,
  Briefcase, Calendar
} from 'lucide-react';

export const ProfileView = ({ userData, agencyData, parentOrg }: any) => {
  if (!userData || !agencyData) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="size-32 rounded-3xl overflow-hidden border-4 border-slate-50 dark:border-slate-700 shadow-inner shrink-0 bg-slate-100 flex items-center justify-center text-3xl font-bold text-[#0528d6]">
          {userData.firstname.charAt(0)}{userData.lastname.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{userData.fullname}</h3>
            <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase rounded-full border border-green-100 dark:border-green-900/30">
              {userData.status}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-xs tracking-widest mb-4">
             {userData.role} — <span className="font-black text-[#0528d6]">{agencyData.name}</span>
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-slate-400">
             <span className="flex items-center gap-2 italic"><Mail size={16} className="text-[#0528d6]"/> {userData.email}</span>
             <span className="flex items-center gap-2 italic"><Calendar size={16} className="text-[#0528d6]"/> Assigné le {new Date(userData.hiredAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
              <Building2 className="text-[#0528d6]" size={20} />
              <h4 className="text-sm font-bold uppercase italic tracking-tighter text-slate-800 dark:text-white">Ma Structure d&apos;accueil</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataField label="Nom de l'agence" value={agencyData.name} />
              <DataField label="Ville opérationnelle" value={agencyData.city} />
              <DataField label="Adresse physique" value={agencyData.address} />
              <DataField label="Téléphone Agence" value={agencyData.phone} />
              <DataField label="Email professionnel" value={agencyData.email} />
              <DataField label="Horaires" value={agencyData.is24Hours ? "Ouvert 24h/24" : agencyData.workingHours} />
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
              <ShieldCheck className="text-[#0528d6]" size={20} />
              <h4 className="text-sm font-bold uppercase italic tracking-tighter text-slate-800 dark:text-white">Affiliation Réseau</h4>
            </div>
            {parentOrg ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataField label="Organisation Mère" value={parentOrg.name} />
                <DataField label="ID Organisation" value={parentOrg.id.substring(0,18)} />
                <DataField label="Pays du Siège" value={parentOrg.country} />
                <DataField label="Statut réseau" value={parentOrg.isVerified ? "Certifié" : "En cours"} />
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Chargement des données d&apos;affiliation...</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#0528d6] rounded-[2.5rem] p-8 text-white shadow-xl text-left relative overflow-hidden">
             <Briefcase className="absolute -bottom-6 -right-6 opacity-10 rotate-12" size={120} />
             <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
               <ShieldCheck className="text-white/50" size={20} />
               <h4 className="text-sm font-bold uppercase italic tracking-tighter text-white">Mon Contrat</h4>
             </div>
             <div className="space-y-4 relative z-10">
                <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                   <p className="text-[9px] font-bold uppercase opacity-60 mb-1">Poste occupé</p>
                   <p className="text-lg font-black">{userData.role}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                   <p className="text-[9px] font-bold uppercase opacity-60 mb-1">Identifiant Staff</p>
                   <p className="text-lg font-black truncate">#{userData.id.substring(0,8).toUpperCase()}</p>
                </div>
             </div>
          </section>

          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
             <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
               <Globe2 className="text-[#0528d6]" size={20} />
               <h4 className="text-sm font-bold uppercase italic tracking-tighter text-slate-800 dark:text-white">Support Interne</h4>
             </div>
             <div className="space-y-4">
                <p className="text-xs text-slate-500 italic leading-relaxed">En cas de problème avec vos accès, contactez l&apos;administrateur de l&apos;organisation.</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email Support</p>
                    <p className="text-sm font-bold text-[#0528d6]">{parentOrg?.email || 'N/A'}</p>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const DataField = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{label}</p>
    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{value || '---'}</p>
  </div>
);