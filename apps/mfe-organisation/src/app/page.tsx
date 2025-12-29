'use client';
import React, { useState, useEffect } from 'react';
import { authService, orgService } from '@pwa-easy-rental/shared-services';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DashboardView } from '../views/DashboardView';
import { AgenciesView } from '../views/AgenciesView';
import { RolesView } from '../views/RolesView';
import { SubscriptionView } from '../views/SubscriptionView';
import { OnboardingStepper } from '../components/OnboardingStepper';
import { StaffView } from '../views/StaffView';
import { 
  Loader2, Mail, Lock, User, Building, 
  ArrowRight, Sparkles, ShieldCheck, Globe, LogOut, Sun, Moon 
} from 'lucide-react';

import { fr } from '../locales/fr';
import { en } from '../locales/en';
import { VehiclesView } from '@/views/VehiclesView';
import { VehicleCategoriesView } from '@/views/VehicleCategoriesView';

export default function OrganisationDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentView, setCurrentView] = useState<any>('DASHBOARD');
  
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [orgData, setOrgData] = useState<any>(null);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({ firstname: '', lastname: '', email: '', password: '', orgName: '' });

  const t = lang === 'FR' ? fr : en;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    const token = localStorage.getItem('auth_token');
    if (token) fetchProfile();
    else setIsLoading(false);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const fetchProfile = async () => {
    try {
      const meRes = await orgService.getMe();
      if (meRes.ok && meRes.data) {
        const { organization } = meRes.data;

        if (organization) {
          setOrgData(organization);
            
          // LOGIQUE DE VÉRIFICATION BASÉE SUR ISVERIFIED
          setIsOnboarded(prev => prev || organization.city?.length >= 1);//isVerified === true);
          
          const [agRes, subRes] = await Promise.all([
            orgService.getAgencies(organization.id),
            orgService.getSubscription(organization.id)
          ]);
          if (agRes.ok) setAgencies(agRes.data || []);
          if (subRes.ok) setSubscription(subRes.data);
          
          setIsAuth(true);
        }
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setIsOnboarded(true); // Verrouillage immédiat pour éviter le retour arrière
    setOrgData((prev: any) => ({ ...prev, isVerified: true }));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await fetchProfile();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      let res;
      if (isSignUp) {
        res = await authService.registerOrg(authForm);
        if (res.ok) {
          const logRes = await authService.login({ email: authForm.email, password: authForm.password });
          if (logRes.ok && logRes.data.token) {
            localStorage.setItem('auth_token', logRes.data.token);
            await fetchProfile();
          }
        } else setAuthError(res.data?.message || t.auth.error);
      } else {
        const res = await authService.login({ email: authForm.email, password: authForm.password });
        if (res.ok && res.data.token) {
          localStorage.setItem('auth_token', res.data.token);
          await fetchProfile();
        } else setAuthError(t.auth.error);
      }
    } catch (e) {
      setAuthError("Server Error.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => { localStorage.clear(); window.location.reload(); };
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else alert(t.installNotice);
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0b1024]">
      <Loader2 className="animate-spin text-[#0528d6] size-12" />
    </div>
  );

  // AUTH SCREEN
  if (!isAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] dark:bg-[#0b1024] p-6 transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="max-w-[1100px] w-full grid lg:grid-cols-2 bg-white dark:bg-[#161b33] rounded-[3.5rem] shadow-2xl border dark:border-slate-800 animate-in zoom-in duration-700 relative z-10">
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0528d6] text-white">
            <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 italic font-[900] text-3xl">E</div>
            <h2 className="text-6xl font-[900] italic uppercase tracking-tighter leading-[0.85] mt-12 text-left">{t.auth.subtitle}</h2>
            <div className="flex items-center gap-4 text-white/80"><ShieldCheck size={20}/><p className="text-xs font-bold uppercase italic tracking-widest text-left">EasyRental Secure Hub</p></div>
        </div>
        <div className="p-10 md:p-16 flex flex-col justify-center">
            <h3 className="text-4xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white mb-10 leading-none text-left">{isSignUp ? t.auth.titleRegister : t.auth.title}</h3>
            <form onSubmit={handleAuth} className="space-y-4 text-left">
                {isSignUp && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-2 gap-3">
                            <AuthInput icon={<User size={18}/>} placeholder={t.auth.firstname} value={authForm.firstname} onChange={(v:any)=>setAuthForm({...authForm, firstname:v})} />
                            <AuthInput icon={<User size={18}/>} placeholder={t.auth.lastname} value={authForm.lastname} onChange={(v:any)=>setAuthForm({...authForm, lastname:v})} />
                        </div>
                        <AuthInput icon={<Building size={18}/>} placeholder={t.auth.orgName} value={authForm.orgName} onChange={(v:any)=>setAuthForm({...authForm, orgName:v})} />
                    </div>
                )}
                <AuthInput icon={<Mail size={18}/>} type="email" placeholder={t.auth.email} value={authForm.email} onChange={(v:any)=>setAuthForm({...authForm, email:v})} />
                <AuthInput icon={<Lock size={18}/>} type="password" placeholder={t.auth.password} value={authForm.password} onChange={(v:any)=>setAuthForm({...authForm, password:v})} />
                {authError && <div className="p-4 bg-red-50 text-red-500 text-[10px] font-black uppercase italic rounded-2xl">{authError}</div>}
                <button className="w-full py-5 bg-[#F76513] text-white rounded-2xl font-[900] uppercase italic text-sm shadow-xl shadow-orange-200 hover:scale-[1.02] transition-transform">{isSignUp ? t.auth.submitRegister : t.auth.submitLogin}</button>
            </form>
            <div className="flex flex-col items-center gap-6 mt-10">
                <button onClick={()=>setIsSignUp(!isSignUp)} className="text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-colors tracking-widest italic">{isSignUp ? t.auth.hasAccount : t.auth.noAccount}</button>
                <div className="flex gap-4">
                    <button onClick={()=>setLang(lang==='FR'?'EN':'FR')} className="text-xs font-black text-slate-300 hover:text-slate-600 dark:hover:text-white uppercase italic">{lang}</button>
                    <button onClick={toggleTheme} className="text-slate-300 hover:text-orange-500">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  // ONBOARDING SCREEN
  if (!isOnboarded) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0b1024] p-6 transition-all duration-500 overflow-y-auto">
      <button onClick={logout} className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 italic"><LogOut size={16}/> {t.nav.logout}</button>
      <OnboardingStepper orgId={orgData?.id} initialName={orgData?.name} onComplete={handleOnboardingComplete} t={t} />
    </div>
  );

  // MAIN DASHBOARD
  return (
    <div className="flex h-screen bg-[#F8F9FC] dark:bg-[#0b1024] overflow-hidden transition-colors duration-500">
      <Sidebar 
        currentView={currentView} setCurrentView={setCurrentView} 
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        t={t} handleInstall={handleInstall} handleLogout={logout}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
            title={t.views[currentView] || currentView}
            orgData={orgData} lang={lang} setLang={setLang}
            darkMode={darkMode} toggleTheme={toggleTheme}
            setSidebarOpen={setSidebarOpen} onInstall={handleInstall}
            hasPrompt={!!deferredPrompt} t={t}
        />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {currentView === 'DASHBOARD' && <DashboardView orgData={orgData} agencies={agencies} t={t} />}
          {currentView === 'AGENCIES' && <AgenciesView orgData={orgData} t={t} />}
          {currentView === 'ROLES' && <RolesView orgData={orgData} t={t} />}
          {currentView === 'STAFF' && <StaffView orgData={orgData} t={t} />}
          {currentView === 'SUBSCRIPTION' && <SubscriptionView orgData={orgData} t={t} />}
          {currentView === 'VEHICLES' && <VehiclesView orgData={orgData} t={t} />}
          {currentView === 'CATEGORIES' && <VehicleCategoriesView orgData={orgData} t={t} />}
        </div>
      </main>
    </div>
  );
}

const AuthInput = ({ icon, type = "text", placeholder, value, onChange }: any) => (
    <div className="relative group w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F76513] transition-colors">{icon}</div>
        <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent rounded-[1.4rem] pl-14 pr-6 py-5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#F76513]/20 focus:ring-4 focus:ring-[#F76513]/5 transition-all text-left" />
    </div>
);