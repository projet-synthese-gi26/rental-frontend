'use client';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Store, BarChart3, Users, LogOut,
  Zap, ShieldCheck, Database, Plus, MoreHorizontal,
  Menu, X, Home, Lock, Loader2, Download, Languages, Sun, Moon
} from 'lucide-react';
import { authService } from '@pwa-easy-rental/shared-services';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

export default function OrganisationDashboard() {
  // --- STATES ---
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const t = lang === 'FR' ? fr : en;

  // --- INITIALISATION & AUTH ---
  useEffect(() => {
    const checkAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || localStorage.getItem('auth_token');
      if (token) {
        localStorage.setItem('auth_token', token);
        setIsAuth(true);
        if (urlParams.get('token')) window.history.replaceState({}, document.title, window.location.pathname);
      }
      const isDark = localStorage.getItem('theme') === 'dark';
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');
      setIsLoading(false);
    };

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    checkAuth();
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    setIsAuth(true);
    return;

    
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      let res;
      if (isSignUp) {
        res = await authService.registerOrg({ email, password, orgName });
        if (res.ok) { setIsSignUp(false); setAuthError("Organisation créée ! Connectez-vous."); }
      } else {
        if (email === 'organisation@gmail.com' && password === 'organisation') {
          res = await authService.login({ email, password });
          if (res.ok && res.data.token) {
            localStorage.setItem('auth_token', res.data.token);
            setIsAuth(true);
          }
        } else setAuthError(t.auth.error);
      }
    } catch { setAuthError(t.auth.error); }
    finally { setAuthLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuth(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert(t.installNotice);
    }
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // --- SIDEBAR COMPONENT ---
  const Sidebar = () => (
    <aside className={`${sidebarOpen ? 'fixed inset-0 z-[200]' : 'hidden'} lg:relative lg:flex lg:w-72 bg-[#0b0e1a] text-white flex-col p-8 shrink-0 border-r border-white/5`}>
      {sidebarOpen && <div className="absolute inset-0 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg italic font-black text-xl">E</div>
            <span className="text-xl font-[900] italic uppercase tracking-tighter">Easy<span className="text-blue-500">Rental</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24}/></button>
        </div>

        <div className="flex-1 space-y-10">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">{t.sidebar.hub}</p>
            <nav className="space-y-1 text-[10px] font-black uppercase tracking-[0.2em]">
              {[{ id: 'd', i: <LayoutDashboard size={18}/>, l: t.sidebar.dashboard, a: true }, { id: 's', i: <BarChart3 size={18}/>, l: t.sidebar.stats }].map(i => (
                <button key={i.id} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${i.a ? 'bg-blue-600 text-white italic shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{i.i} {i.l}</button>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">{t.sidebar.network}</p>
            <nav className="space-y-1 text-[10px] font-black uppercase tracking-[0.2em]">
              {[{ id: 'a', i: <Store size={18}/>, l: t.sidebar.agencies }, { id: 'u', i: <Users size={18}/>, l: t.sidebar.users }].map(i => (
                <button key={i.id} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">{i.i} {i.l}</button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          {/* BOUTON INSTALLER APP SIDEBAR */}
          <button onClick={handleInstall} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all italic underline decoration-blue-500 underline-offset-4">
            <Download size={18}/> {t.sidebar.install}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-400 hover:bg-red-500/10 transition-all italic">
            <LogOut size={18}/> {t.nav.logout}
          </button>
          <div className="p-4 rounded-2xl bg-blue-900/20 border border-blue-900/30 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest">{t.sidebar.status}</span>
          </div>
        </div>
      </div>
    </aside>
  );

  if (isLoading) return null;

  // --- AUTH SCREEN ---
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0f1323] flex items-center justify-center p-6 transition-colors duration-300">
        <div className="w-full max-w-xl bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] p-10 md:p-16 shadow-2xl border border-slate-50 dark:border-slate-800 relative">
          <a href="http://localhost:3000" className="absolute top-10 left-10 text-slate-300 hover:text-blue-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest leading-none"><Home size={16} /> {t.nav.backHome}</a>
          
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl mx-auto mb-8 italic font-black text-3xl">E</div>
            <h1 className="text-4xl font-[900] italic uppercase tracking-tighter mb-4 leading-none text-slate-900 dark:text-white">{t.auth.title}</h1>
            <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">{t.auth.subtitle}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#0f1323] border-none rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-600/10 font-bold dark:text-white" placeholder={t.auth.orgName} />}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#0f1323] border-none rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-600/10 font-bold dark:text-white" placeholder={t.auth.email} />
            <div className="relative">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#0f1323] border-none rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-600/10 font-bold dark:text-white" placeholder={t.auth.password} />
              <Lock size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
            {authError && <p className="text-[10px] font-black text-red-500 uppercase text-center tracking-widest italic">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-[900] uppercase italic text-lg shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
              {authLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? t.auth.submitRegister : t.auth.submitLogin)}
            </button>
          </form>

          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-10 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all italic tracking-widest">
            {isSignUp ? t.auth.hasAccount : t.auth.noAccount}
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="flex h-screen bg-[#F8F9FC] dark:bg-[#0f1323] transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 px-6 md:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white"><Menu size={20} /></button>
            <h2 className="text-xl md:text-3xl font-[900] italic uppercase tracking-tighter leading-none italic text-slate-900 dark:text-white">{t.header.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white">{lang}</button>
            <button onClick={toggleTheme} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-700">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-xl shrink-0"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" /></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { l: t.kpi.agencies, v: "124", g: "+5%", i: <Store className="text-blue-600"/> },
              { l: t.kpi.rentals, v: "845", g: "+12%", i: <Zap className="text-blue-600"/> },
              { l: t.kpi.revenue, v: "$142,500", g: "+8%", i: <BarChart3 className="text-blue-600"/> },
              { l: t.kpi.pending, v: "18", b: t.kpi.action, i: <ShieldCheck className="text-orange-500"/>, h: true },
            ].map((k, i) => (
              <div key={i} className={`bg-white dark:bg-[#1a1d2d] p-8 rounded-[2.5rem] border ${k.h ? 'border-orange-500/20' : 'border-slate-50 dark:border-slate-800'} flex flex-col justify-between h-44 group hover:shadow-xl transition-all`}>
                <div className="flex justify-between items-start"><div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">{k.i}</div>{k.g && <span className="text-[10px] font-black text-green-600 italic leading-none">{k.g}</span>}{k.b && <span className="bg-orange-500 text-white text-[8px] font-black px-3 py-1 rounded-full italic uppercase leading-none">{k.b}</span>}</div>
                <div><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 italic leading-none">{k.l}</p><p className="text-3xl font-[900] italic uppercase leading-none text-slate-900 dark:text-white">{k.v}</p></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2d] p-8 md:p-10 rounded-[3rem] border border-slate-50 dark:border-slate-800 h-fit lg:h-full">
               <div className="flex justify-between mb-10"><div><h3 className="text-2xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white">{t.charts.title}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.charts.sub}</p></div><button className="px-6 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase italic text-slate-400">{t.charts.period}</button></div>
               <div className="h-64 flex items-end"><svg className="w-full h-40" viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,80 Q150,10 300,70 T600,40 T1000,20" fill="none" stroke="#0528d6" strokeWidth="4" className="drop-shadow-xl" /></svg></div>
            </div>

            <div className="bg-[#0f1323] p-10 rounded-[3rem] text-white flex flex-col justify-between h-[450px] lg:h-auto relative overflow-hidden">
               <Database className="absolute top-0 right-0 p-8 opacity-10" size={150}/>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10"><h3 className="text-xl font-black uppercase italic tracking-widest">{t.system.title}</h3><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" /></div>
                  <div className="space-y-8 text-[9px] font-black uppercase tracking-[0.3em]">
                     <div><div className="flex justify-between mb-3 text-slate-400"><span>{t.system.sync}</span><span>98% {t.system.op}</span></div><div className="h-1.5 bg-white/10 rounded-full"><div className="w-[98%] h-full bg-blue-600 rounded-full" /></div></div>
                     <div><div className="flex justify-between mb-3 text-slate-400"><span>{t.system.load}</span><span>65% {t.system.loadSub}</span></div><div className="h-1.5 bg-white/10 rounded-full"><div className="w-[65%] h-full bg-orange-500 rounded-full" /></div></div>
                  </div>
               </div>
               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic mt-10 hover:bg-white hover:text-black transition-all">{t.system.log}</button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden mb-10">
            <div className="p-10 flex justify-between items-center border-b border-slate-50 dark:border-slate-800">
               <h3 className="text-2xl md:text-3xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">{t.table.title}</h3>
               <div className="flex gap-4"><button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase italic shadow-xl shadow-blue-200 leading-none"><Plus size={16} className="inline mr-2"/> {t.table.add}</button></div>
            </div>
            <div className="overflow-x-auto">
               <div className="min-w-[800px] px-10 pb-10 uppercase italic font-black">
                  <table className="w-full text-left">
                    <thead><tr className="text-[10px] text-slate-300 border-b border-slate-50 dark:border-slate-800"><th className="py-8">{t.table.colName}</th><th>{t.table.colLoc}</th><th>{t.table.colStatus}</th><th>{t.table.colRev}</th><th className="text-right">Action</th></tr></thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                       {[{ n: "Downtown Hub", l: "New York, NY", s: "Online", v: "$45,200", c: "bg-green-500" }].map((row, i) => (
                          <tr key={i} className="group hover:bg-slate-50/50"><td className="py-8 text-slate-900 dark:text-white leading-none">{row.n}</td><td className="text-slate-400 text-xs tracking-widest">{row.l}</td><td><span className="flex items-center gap-2 tracking-widest text-[10px]"><div className={`w-2 h-2 rounded-full ${row.c}`} />{row.s}</span></td><td className="text-blue-600 leading-none">{row.v}</td><td className="text-right"><MoreHorizontal className="inline text-slate-300" /></td></tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOUTON FLOTTANT INSTALLER APP (Mobile) */}
      {!deferredPrompt && (
        <button onClick={handleInstall} className="fixed bottom-10 right-10 lg:hidden bg-blue-600 text-white p-5 rounded-full shadow-2xl z-[250] animate-bounce">
          <Download size={24} />
        </button>
      )}
    </div>
  );
}