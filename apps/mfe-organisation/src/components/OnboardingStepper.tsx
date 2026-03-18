/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { 
  Loader2, ArrowRight, CheckCircle2, Building2, MapPin, 
  ShieldCheck, Globe, ChevronLeft, Sparkles, AlignLeft,
  Mail, Phone, Clock, Hash,
  LogOut
} from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';
import { StepperInput } from './StepperInput';
import { StepperArea } from './StepperArea';
import { LogoUpload } from './LogoUpload';

export const OnboardingStepper = ({ orgId, initialName, onComplete, onLogout }: any) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // État initial respectant strictement le OrgUpdateDTO
  const [formData, setFormData] = useState({
    name: initialName || '', 
    description: '', 
    address: '', 
    city: '', 
    postalCode: '', 
    region: '', 
    phone: '', 
    email: '',
    website: '', 
    timezone: 'Africa/Douala', 
    logoUrl: '', // Force upload
    registrationNumber: '', 
    taxNumber: ''
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validation stricte basée sur les "required" du Swagger
  const isStepValid = () => {
    const isFull = (val: string) => val && val.trim() !== '' && val !== 'string';
    
    if (step === 1) return isFull(formData.name) && isFull(formData.description) && isFull(formData.website);// && isFull(formData.logoUrl);
    if (step === 2) return isFull(formData.city) && isFull(formData.region) && isFull(formData.address) && isFull(formData.phone) && isFull(formData.email);
    if (step === 3) return isFull(formData.registrationNumber) && isFull(formData.taxNumber) && isFull(formData.timezone) && isFull(formData.postalCode);
    return false;
  };

  const handleFinalSubmit = async () => {
    if (!isStepValid()) return;
    setLoading(true);
    try {
      // On envoie exactement le OrgUpdateDTO au service
      const res = await orgService.updateOrg(orgId, { ...formData, isVerified: true });
      if (res.ok) onComplete();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Identité", sub: "Image de marque", icon: <Building2 size={20}/> },
    { title: "Contact", sub: "Siège & Coordonnées", icon: <Globe size={20}/> },
    { title: "Légal", sub: "Fiscalité & Région", icon: <ShieldCheck size={20}/> }
  ];

  return (
    <div className="max-w-5xl w-full flex flex-col items-center animate-in fade-in duration-700 px-4">
      
      {/* Header informatif */}
      <div className="w-full mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#0528d6] rounded-full text-[10px] font-bold  tracking-widest border border-blue-100 dark:border-blue-900/30 mb-4">
          <Sparkles size={14} /> Étape {step} sur 3
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
           Finaliser votre <span className="text-[#0528d6]">Configuration.</span>
        </h1>
      </div>

      <div className="w-full bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800 overflow-hidden grid lg:grid-cols-12 min-h-[650px]">
        
        {/* NAVIGATION LATÉRALE (FIXE) */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-[#080b14] border-r border-slate-100 dark:border-slate-800 p-10 flex flex-col">
            
            {/* Steps List */}
            <div className="flex flex-col gap-10">
                {steps.map((info, i) => (
                    <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${step === i+1 ? 'translate-x-2' : 'opacity-40'}`}>
                        <div className={`size-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${step === i+1 ? 'bg-[#0528d6] text-white scale-110 shadow-blue-600/20' : step > i+1 ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                            {step > i+1 ? <CheckCircle2 size={24} /> : info.icon}
                        </div>
                        <div className="flex flex-col text-left leading-tight">
                            <span className="text-[10px] font-bold  text-slate-400">Phase 0{i+1}</span>
                            <span className={`text-sm font-bold ${step === i+1 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{info.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* NOUVELLE POSITION DU BOUTON QUITTER (FOOTER DE SIDEBAR) */}
            <div className="mt-auto pt-10 border-t border-slate-200/50 dark:border-slate-800/50">
               <button 
                 onClick={onLogout}
                 className="flex items-center gap-3 text-slate-400 hover:text-red-500 transition-all group"
               >
                 <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                    <LogOut size={16} />
                 </div>
                 <span className="text-[11px] font-bold  tracking-wider italic">Quitter la session</span>
               </button>
               
               <p className="mt-6 text-[10px] text-slate-400 leading-relaxed italic">
                 Besoin d&apos;aide ? Contactez le support technique Rental.
               </p>
            </div>
        </div>

        {/* Corps du formulaire (Scrollable interne si nécessaire) */}
        <div className="lg:col-span-8 p-8 md:p-14 flex flex-col">
            <div className="flex-1">
                {step === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-50 pb-4">Identité de l&apos;organisation</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {/* Section Upload à gauche (1/3) */}
                          <div className="md:col-span-1">
                              <LogoUpload 
                                  value={formData.logoUrl} 
                                  onUploadSuccess={(url) => setFormData({ ...formData, logoUrl: url })} 
                              />
                          </div>

                          {/* Champs textes à droite (2/3) */}
                          <div className="md:col-span-2 space-y-6">
                              <StepperInput label="Dénomination sociale" name="name" value={formData.name} onChange={handleChange} icon={Building2} placeholder="ex: Rental Prestige Ltd" />
                              <StepperInput label="Site Internet" name="website" placeholder="https://www.monsite.com" value={formData.website} onChange={handleChange} icon={Globe} />
                          </div>
                      </div>

                      <StepperArea label="Vision & Description" name="description" value={formData.description} onChange={handleChange} icon={AlignLeft} placeholder="Décrivez vos services de location, vos valeurs et votre zone de couverture..." />
                  </div>
                )}

                {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Coordonnées & Siège</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <StepperInput label="Ville" name="city" value={formData.city} onChange={handleChange} placeholder="Douala" />
                        <StepperInput label="Région" name="region" value={formData.region} onChange={handleChange} placeholder="Littoral" />
                    </div>
                    <StepperInput label="Adresse physique" name="address" value={formData.address} onChange={handleChange} icon={MapPin} placeholder="Rue 1.234, Akwa" />
                    <div className="grid grid-cols-2 gap-4">
                        <StepperInput label="Téléphone Pro" name="phone" value={formData.phone} onChange={handleChange} icon={Phone} placeholder="699000000" />
                        <StepperInput label="Email Contact" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} placeholder="contact@org.com" />
                    </div>
                </div>
                )}

                {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Informations Légales</h2>
                    <StepperInput label="Numéro RCCM" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} icon={Hash} placeholder="RC/DLA/2024/B/..." />
                    <StepperInput label="Numéro NIU" name="taxNumber" value={formData.taxNumber} onChange={handleChange} icon={ShieldCheck} placeholder="M0123456789..." />
                    <div className="grid grid-cols-2 gap-4">
                        <StepperInput label="Fuseau Horaire" name="timezone" value={formData.timezone} onChange={handleChange} icon={Clock} />
                        <StepperInput label="Code Postal / ZIP" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="00237" />
                    </div>
                </div>
                )}
            </div>

            {/* Actions (Bottom Bar) */}
            <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-400 font-bold  text-[10px] hover:text-[#0528d6] transition-colors italic">
                    <ChevronLeft size={16} /> Précédent
                </button>
                ) : <div />}
                
                <button 
                  onClick={step < 3 ? () => setStep(step + 1) : handleFinalSubmit} 
                  disabled={loading || !isStepValid()}
                  className={`px-10 py-4 ${step < 3 ? 'bg-[#0528d6]' : 'bg-green-600'} text-white rounded-xl font-bold  text-xs shadow-xl shadow-blue-600/10 flex items-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>{step < 3 ? "Continuer" : "Activer mon Dashboard"} <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
