// FILE: apps/mfe-agency/src/views/ProfileView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { 
  Mail, ShieldCheck, 
  Building2, Globe2,
  Briefcase, Calendar,
  Lock, CheckCircle2, AlertCircle, Edit3, Save, X, Loader2
} from 'lucide-react';
import { authService, agencyService } from '@pwa-easy-rental/shared-services';
import { hasPermission } from '../utils/permissions';

export const ProfileView = ({ userData, agencyData, parentOrg, onUpdate }: any) => {
  const[editProfileMode, setEditProfileMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [editAgencyMode, setEditAgencyMode] = useState(false);

  const[profileForm, setProfileForm] = useState({
    firstname: userData?.firstname || '',
    lastname: userData?.lastname || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const [agencyForm, setAgencyForm] = useState({
    name: agencyData?.name || '',
    phone: agencyData?.phone || '',
    email: agencyData?.email || '',
    address: agencyData?.address || '',
    workingHours: agencyData?.workingHours || ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  if (!userData || !agencyData) return null;

  const permissions = userData.poste?.permissions ||[];
  const isOwner = userData.role === 'ORGANIZATION_OWNER' || userData.role === 'ADMIN';

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const res = await authService.updateProfile(profileForm);
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour.' });
        setEditProfileMode(false);
        onUpdate();
      } else setMessage({ type: 'error', text: res.data?.message || 'Erreur.' });
    } finally { setLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const res = await authService.updatePassword(passwordForm);
      if (res.ok) {
        setMessage({ type: 'success', text: 'Mot de passe modifié.' });
        setEditPasswordMode(false);
        setPasswordForm({ oldPassword: '', newPassword: '' });
      } else setMessage({ type: 'error', text: res.data?.message || 'Erreur.' });
    } finally { setLoading(false); }
  };

  const handleAgencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const res = await agencyService.updateAgency(agencyData.id, agencyForm);
      if (res.ok) {
        setMessage({ type: 'success', text: 'Agence mise à jour.' });
        setEditAgencyMode(false);
        onUpdate();
      } else setMessage({ type: 'error', text: res.data?.message || 'Erreur.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold  tracking-widest italic flex items-center justify-between ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
          <button onClick={() => setMessage(null)}><X size={16}/></button>
        </div>
      )}

      {/* 1. ENTÊTE UTILISATEUR */}
      <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="size-32 rounded-3xl overflow-hidden border-4 border-slate-50 dark:border-slate-700 shadow-inner shrink-0 bg-slate-100 flex items-center justify-center text-3xl font-bold text-[#0528d6]">
          {userData.firstname?.charAt(0)}{userData.lastname?.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{userData.fullname}</h3>
            <span className={`px-3 py-1 text-[10px] font-bold  rounded-full border ${
                userData.status === 'ACTIVE' 
                ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20' 
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {userData.status}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium  text-xs tracking-widest mb-4">
             {userData.role} — <span className="font-black text-[#0528d6]">{agencyData.name}</span>
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-slate-400">
             <span className="flex items-center gap-2 italic"><Mail size={16} className="text-[#0528d6]"/> {userData.email}</span>
             <span className="flex items-center gap-2 italic"><Calendar size={16} className="text-[#0528d6]"/> Assigné le {new Date(userData.hiredAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : INFOS USER ET STRUCTURE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* USER PROFILE */}
          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative text-left">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3 text-[#0528d6]">
                <Lock size={20}/>
                <h4 className="text-sm font-bold  italic tracking-tighter text-slate-800 dark:text-white">Mes informations</h4>
              </div>
              {!editProfileMode && (
                <button onClick={() => setEditProfileMode(true)} className="p-2 text-slate-400 hover:text-[#0528d6] transition-colors"><Edit3 size={18}/></button>
              )}
            </div>

            {editProfileMode ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Prénom</label>
                    <input required value={profileForm.firstname} onChange={e => setProfileForm({...profileForm, firstname: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Nom</label>
                    <input required value={profileForm.lastname} onChange={e => setProfileForm({...profileForm, lastname: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setEditProfileMode(false)} className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataField label="Prénom" value={userData.firstname} />
                <DataField label="Nom" value={userData.lastname} />
              </div>
            )}
          </section>

          {/* PASSWORD */}
          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative text-left">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3 text-[#0528d6]">
                <ShieldCheck size={20}/>
                <h4 className="text-sm font-bold  italic tracking-tighter text-slate-800 dark:text-white">Sécurité du compte</h4>
              </div>
              {!editPasswordMode && (
                <button onClick={() => setEditPasswordMode(true)} className="text-xs font-bold  text-[#0528d6] hover:underline italic tracking-widest">Modifier le mot de passe</button>
              )}
            </div>

            {editPasswordMode && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Ancien mot de passe</label>
                    <input required type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Nouveau mot de passe</label>
                    <input required type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setEditPasswordMode(false)} className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Mettre à jour
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* AGENCY INFO */}
          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left relative">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3 text-[#0528d6]">
                <Building2 size={20} />
                <h4 className="text-sm font-bold  italic tracking-tighter text-slate-800 dark:text-white">Ma Structure d&apos;accueil</h4>
              </div>
              {hasPermission(userData, 'agency:update') && !editAgencyMode && (
                <button onClick={() => setEditAgencyMode(true)} className="p-2 text-slate-400 hover:text-[#0528d6] transition-colors"><Edit3 size={18}/></button>
              )}
            </div>

            {editAgencyMode ? (
              <form onSubmit={handleAgencySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Nom Agence</label>
                    <input required value={agencyForm.name} onChange={e => setAgencyForm({...agencyForm, name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Téléphone</label>
                    <input required value={agencyForm.phone} onChange={e => setAgencyForm({...agencyForm, phone: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Adresse physique</label>
                    <input required value={agencyForm.address} onChange={e => setAgencyForm({...agencyForm, address: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400  tracking-widest italic">Horaires (ex: 08:00-18:00)</label>
                    <input required value={agencyForm.workingHours} onChange={e => setAgencyForm({...agencyForm, workingHours: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm outline-none focus:border-[#0528d6] dark:text-white transition-all" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setEditAgencyMode(false)} className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-[#0528d6] text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Mettre à jour
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataField label="Nom de l'agence" value={agencyData.name} />
                <DataField label="Ville opérationnelle" value={agencyData.city} />
                <DataField label="Adresse physique" value={agencyData.address} />
                <DataField label="Téléphone Agence" value={agencyData.phone} />
                <DataField label="Email professionnel" value={agencyData.email} />
                <DataField label="Horaires" value={agencyData.is24Hours ? "Ouvert 24h/24" : agencyData.workingHours} />
              </div>
            )}
          </section>

          {/* PERMISSIONS */}
          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <Lock className="text-[#0528d6]" size={20} />
                <h4 className="text-sm font-bold  italic tracking-tighter text-slate-800 dark:text-white">Habilitations & Privilèges</h4>
              </div>
              <span className="text-[10px] font-black text-slate-400  tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg italic">
                {userData.poste?.name || "Rôle standard"}
              </span>
            </div>

            {isOwner ? (
                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 rounded-3xl flex items-center gap-5">
                    <div className="size-12 bg-white dark:bg-blue-900 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-blue-900 dark:text-blue-100  italic">Super-Administrateur</p>
                        <p className="text-xs text-blue-600/80 font-medium">Accès total et illimité à toutes les fonctions de l&apos;organisation et des agences.</p>
                    </div>
                </div>
            ) : permissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map((perm: any) => (
                        <div key={perm.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3 group hover:border-[#0528d6] transition-colors">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[11px] font-black text-slate-700 dark:text-slate-200  tracking-tight mb-0.5">{perm.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium italic leading-tight">{perm.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                    <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-xs text-slate-400 font-bold  italic tracking-widest">Aucune permission spécifique rattachée</p>
                </div>
            )}
          </section>
        </div>

        {/* COLONNE DROITE */}
        <div className="space-y-6">
          <section className="bg-[#0528d6] rounded-[2.5rem] p-8 text-white shadow-xl text-left relative overflow-hidden">
             <Briefcase className="absolute -bottom-6 -right-6 opacity-10 rotate-12" size={120} />
             <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
               <ShieldCheck className="text-white/50" size={20} />
               <h4 className="text-sm font-bold  italic tracking-tighter text-white">Mon Contrat</h4>
             </div>
             <div className="space-y-4 relative z-10">
                <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                   <p className="text-[9px] font-bold  opacity-60 mb-1">Poste occupé</p>
                   <p className="text-lg font-black">{userData.poste?.name || userData.role}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                   <p className="text-[9px] font-bold  opacity-60 mb-1">Identifiant Staff</p>
                   <p className="text-lg font-black truncate">#{userData.id?.substring(0,8).to()}</p>
                </div>
             </div>
          </section>

          <section className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
             <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4 mb-6">
               <Globe2 className="text-[#0528d6]" size={20} />
               <h4 className="text-sm font-bold  italic tracking-tighter text-slate-800 dark:text-white">Support Interne</h4>
             </div>
             <div className="space-y-4">
                <p className="text-xs text-slate-500 italic leading-relaxed">En cas de problème avec vos accès, contactez l&apos;administrateur de l&apos;organisation.</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400  mb-1">Email Support</p>
                    <p className="text-sm font-bold text-[#0528d6] truncate">{parentOrg?.email || 'N/A'}</p>
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
    <p className="text-[10px] font-bold text-slate-400  tracking-widest italic">{label}</p>
    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{value || '---'}</p>
  </div>
);