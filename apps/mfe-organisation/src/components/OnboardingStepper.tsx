'use client';
import React, { useState } from 'react';
import { 
  Loader2, ArrowRight, CheckCircle2, 
  Building2, MapPin, ShieldCheck, Globe, 
  ChevronLeft, Sparkles, AlignLeft 
} from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';

// --- COMPOSANT INPUT STANDARD ---
const StepperInput = ({ label, name, placeholder, value, onChange, type = "text", icon: Icon }: any) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-[900] uppercase text-slate-400 dark:text-slate-500 italic tracking-[0.2em] ml-1 flex justify-between">
      <span>{label}</span>
      <span className="text-[#F76513] font-bold">*</span>
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F76513] transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent rounded-2xl py-4 pr-6 ${Icon ? 'pl-12' : 'pl-6'} text-sm font-bold text-slate-700 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#F76513]/20 focus:ring-4 focus:ring-[#F76513]/5 transition-all duration-300`}
        required
      />
    </div>
  </div>
);

// --- COMPOSANT TEXTAREA ---
const StepperArea = ({ label, name, placeholder, value, onChange, icon: Icon }: any) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-[900] uppercase text-slate-400 dark:text-slate-500 italic tracking-[0.2em] ml-1 flex justify-between">
      <span>{label}</span>
      <span className="text-[#F76513] font-bold">*</span>
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-5 text-slate-300 group-focus-within:text-[#F76513] transition-colors">
          <Icon size={18} />
        </div>
      )}
      <textarea 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className={`w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent rounded-3xl py-4 pr-6 ${Icon ? 'pl-12' : 'pl-6'} text-sm font-bold text-slate-700 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#F76513]/20 focus:ring-4 focus:ring-[#F76513]/5 transition-all duration-300`}
        required
      />
    </div>
  </div>
);

export const OnboardingStepper = ({ orgId, initialName, onComplete, t }: any) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    logoUrl: 'https://placehold.co/200',
    registrationNumber: '', 
    taxNumber: ''
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- LOGIQUE DE VALIDATION STRICTE (TOUS LES CHAMPS) ---
  const isStepValid = () => {
    const isNotEmpty = (val: string) => val.trim() !== '' && val !== 'string';

    if (step === 1) {
      return isNotEmpty(formData.name) && 
             isNotEmpty(formData.description) && 
             isNotEmpty(formData.website);
    }
    if (step === 2) {
      return isNotEmpty(formData.city) && 
             isNotEmpty(formData.region) && 
             isNotEmpty(formData.address) && 
             isNotEmpty(formData.phone) && 
             isNotEmpty(formData.email);
    }
    if (step === 3) {
      return isNotEmpty(formData.registrationNumber) && 
             isNotEmpty(formData.taxNumber) && 
             isNotEmpty(formData.timezone) && 
             isNotEmpty(formData.postalCode);
    }
    return false;
  };

  const handleFinalSubmit = async () => {
    if (!isStepValid()) return;
    setLoading(true);
    try {
      const res = await orgService.updateOrg(orgId, { ...formData, isVerified: true });
      if (res.ok) onComplete();
      else alert("Une erreur est survenue lors de l'enregistrement final.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: t.onboarding.step1Title, icon: <Building2 size={20}/> },
    { title: t.onboarding.step2Title, icon: <Globe size={20}/> },
    { title: t.onboarding.step3Title, icon: <ShieldCheck size={20}/> }
  ];

  return (
    <div className="max-w-4xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-700">
      
      {/* Header Info */}
      <div className="w-full mb-10 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase italic border border-blue-100 dark:border-blue-900/30">
          <Sparkles size={14} className="animate-pulse" /> {t.onboarding.step} {step} {t.onboarding.of} 3
        </div>
        <h1 className="text-5xl md:text-6xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
          {t.onboarding.mainTitle} <span className="text-[#0528d6]">{t.onboarding.accentTitle}</span>
        </h1>
      </div>

      <div className="w-full bg-white dark:bg-[#161b33] rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 overflow-hidden grid lg:grid-cols-12 min-h-[600px]">
        
        {/* Navigation latérale */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-[#0b1024]/50 border-r border-slate-100 dark:border-slate-800 p-10 flex flex-col gap-8">
            {steps.map((info, i) => (
                <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${step === i+1 ? 'translate-x-2' : 'opacity-40 grayscale'}`}>
                    <div className={`size-12 rounded-2xl flex items-center justify-center shadow-lg ${step === i+1 ? 'bg-[#F76513] text-white scale-110' : step > i+1 ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                        {step > i+1 ? <CheckCircle2 size={24} /> : info.icon}
                    </div>
                    <div className="flex flex-col leading-none text-left">
                        <span className="text-[10px] font-black uppercase text-slate-400 mb-1">0{i+1}</span>
                        <span className={`text-sm font-[900] uppercase italic ${step === i+1 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{info.title}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Corps du formulaire */}
        <div className="lg:col-span-8 p-8 md:p-14 flex flex-col text-left">
            <div className="flex-1">
                {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                    <h2 className="text-3xl font-[900] italic uppercase text-slate-900 dark:text-white leading-none tracking-tight">{t.onboarding.form.who}</h2>
                    <StepperInput label={t.onboarding.form.orgName} name="name" value={formData.name} onChange={handleChange} icon={Building2} />
                    <StepperArea label={t.onboarding.form.vision} name="description" value={formData.description} onChange={handleChange} icon={AlignLeft} placeholder={t.onboarding.form.visionPlaceholder} />
                    <StepperInput label={t.onboarding.form.website} name="website" placeholder="https://www.globalrent.com" value={formData.website} onChange={handleChange} icon={Globe} />
                </div>
                )}

                {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                    <h2 className="text-3xl font-[900] italic uppercase text-slate-900 dark:text-white leading-none tracking-tight">{t.onboarding.form.where}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <StepperInput label={t.onboarding.form.city} name="city" value={formData.city} onChange={handleChange} />
                        <StepperInput label={t.onboarding.form.region} name="region" value={formData.region} onChange={handleChange} />
                    </div>
                    <StepperInput label={t.onboarding.form.address} name="address" value={formData.address} onChange={handleChange} icon={MapPin} />
                    <div className="grid grid-cols-2 gap-4">
                        <StepperInput label={t.onboarding.form.phone} name="phone" value={formData.phone} onChange={handleChange} />
                        <StepperInput label={t.onboarding.form.email} name="email" type="email" value={formData.email} onChange={handleChange} />
                    </div>
                </div>
                )}

                {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                    <h2 className="text-3xl font-[900] italic uppercase text-slate-900 dark:text-white leading-none tracking-tight">{t.onboarding.form.legal}</h2>
                    <StepperInput label={t.onboarding.form.rccm} name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} icon={ShieldCheck} />
                    <StepperInput label={t.onboarding.form.niu} name="taxNumber" value={formData.taxNumber} onChange={handleChange} icon={ShieldCheck} />
                    <div className="grid grid-cols-2 gap-4">
                        <StepperInput label={t.onboarding.form.timezone} name="timezone" value={formData.timezone} onChange={handleChange} />
                        <StepperInput label={t.onboarding.form.zip} name="postalCode" value={formData.postalCode} onChange={handleChange} />
                    </div>
                </div>
                )}
            </div>

            <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800 shrink-0">
                {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-400 font-black uppercase italic text-[10px] hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ChevronLeft size={16} /> {t.onboarding.btns.prev}
                </button>
                ) : <div />}
                
                <button 
                  onClick={step < 3 ? () => setStep(step + 1) : handleFinalSubmit} 
                  disabled={loading || !isStepValid()}
                  className={`px-10 py-5 ${step < 3 ? 'bg-[#F76513]' : 'bg-green-600'} text-white rounded-2xl font-[900] uppercase italic text-sm shadow-xl flex items-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-20 disabled:cursor-not-allowed`}
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>{step < 3 ? t.onboarding.btns.next : t.onboarding.btns.finish} <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};