'use client';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, List, Calendar as CalIcon, 
  PlusCircle, Filter, WifiOff, Car, Key, Boxes, 
  Menu, X, Sun, Moon, Languages, Download, LogOut, Loader2, Lock, Home, User, Plus
} from 'lucide-react';
import { authService } from '@pwa-easy-rental/shared-services';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

export default function AgencyDashboard() {
  // --- STATES ---
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const t = lang === 'FR' ? fr : en;

  // --- INITIALISATION ---
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    checkAuth();
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (email === 'personnel@gmail.com' && password === 'personnel') {
        const res = await authService.login({ email, password });
        if (res.ok && res.data.token) {
          localStorage.setItem('auth_token', res.data.token);
          setIsAuth(true);
        }
      } else setAuthError(t.auth.error);
    } catch { setAuthError(t.auth.error); }
    finally { setAuthLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuth(false);
    setSidebarOpen(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else alert(t.auth.installNotice);
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
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg italic font-black text-xl">E</div>
          <span className="text-xl font-[900] italic uppercase tracking-tighter">Easy<span className="text-blue-500">Rental</span></span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24}/></button>
      </div>

      <div className="flex-1 space-y-10">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">{t.sidebar.menu}</p>
          <nav className="space-y-1 text-[10px] font-black uppercase tracking-[0.2em]">
            {[{ id: 'd', i: <LayoutDashboard size={18}/>, l: t.sidebar.dash, a: true }, { id: 's', i: <User size={18}/>, l: t.sidebar.account }].map(i => (
              <button key={i.id} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${i.a ? 'bg-blue-600 text-white italic shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{i.i} {i.l}</button>
            ))}
          </nav>
        </div>
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">{t.sidebar.ops}</p>
          <nav className="space-y-1 text-[10px] font-black uppercase tracking-[0.2em]">
            {[{ id: 'l', i: <List size={18}/>, l: t.sidebar.listings }, { id: 'b', i: <CalIcon size={18}/>, l: t.sidebar.bookings, b: "3" }].map(i => (
              <button key={i.id} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">{i.i} {i.l} {i.b && <span className="ml-auto bg-orange-500 text-white size-5 rounded-full flex items-center justify-center italic text-[8px]">{i.b}</span>}</button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
        <button onClick={handleInstall} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all italic underline decoration-blue-500 underline-offset-4"><Download size={18}/> {t.nav.install}</button>
        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-400 hover:bg-red-500/10 transition-all italic"><LogOut size={18}/> {t.nav.logout}</button>
        <div className="p-4 rounded-2xl bg-blue-900/20 border border-blue-900/30 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /><span className="text-[8px] font-black uppercase text-blue-400 tracking-widest">{t.sidebar.status}</span></div>
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
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#0f1323] border-none rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-600/10 font-bold dark:text-white" placeholder={t.auth.email} />
            <div className="relative"><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#0f1323] border-none rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-600/10 font-bold dark:text-white" placeholder={t.auth.password} /><Lock size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300" /></div>
            {authError && <p className="text-[10px] font-black text-red-500 uppercase text-center tracking-widest italic">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-[900] uppercase italic text-lg shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">{authLoading ? <Loader2 className="animate-spin" /> : t.auth.submit}</button>
          </form>
          <div className="flex justify-center gap-6 mt-12 border-t border-slate-50 dark:border-slate-800 pt-8">
            <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-2"><Languages size={14}/> {lang}</button>
            <button onClick={toggleTheme} className="text-slate-400 hover:text-yellow-500 transition-colors">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
          </div>
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
            <div><h2 className="text-xl md:text-3xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none italic">{t.header.greet} Sarah</h2><p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{t.header.sub}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white">{lang}</button>
            <button onClick={toggleTheme} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-700">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-xl shrink-0"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" /></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {/* KPI GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[{ l: t.kpi.pending, v: "12", i: <CalIcon className="text-blue-600"/>, g: "+2 today" }, { l: t.kpi.active, v: "45", i: <Key className="text-green-500"/> }, { l: t.kpi.inventory, v: "120", i: <Boxes className="text-purple-500"/> }, { l: t.kpi.offline, v: "2", i: <WifiOff className="text-orange-500"/> }].map((k, i) => (
              <div key={i} className={`bg-white dark:bg-[#1a1d2d] p-6 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 flex flex-col justify-between h-40 group hover:shadow-xl transition-all`}>
                <div className="flex justify-between items-start"><div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">{k.i}</div>{k.g && <span className="text-[10px] font-black text-green-600 italic leading-none">{k.g}</span>}</div>
                <div><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic leading-none mb-1">{k.l}</p><p className="text-3xl font-[900] italic uppercase leading-none text-slate-900 dark:text-white">{k.v}</p></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Table Area */}
            <div className="xl:col-span-2 bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="p-10 flex justify-between items-center border-b border-slate-50 dark:border-slate-800">
                 <div><h3 className="text-2xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">{t.table.title}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{t.table.sub}</p></div>
                 <div className="flex gap-4"><button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400"><Filter size={18}/></button><button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase italic shadow-xl shadow-blue-200 leading-none"><Plus size={16} className="inline mr-2"/> {t.table.add}</button></div>
              </div>
              <div className="overflow-x-auto"><div className="min-w-[800px] px-10 pb-10 uppercase italic font-black">
                  <table className="w-full text-left">
                    <thead><tr className="text-[10px] text-slate-300 border-b border-slate-50 dark:border-slate-800"><th className="py-8">ID</th><th>{t.table.customer}</th><th>{t.table.vehicle}</th><th>{t.table.status}</th><th className="text-right">Action</th></tr></thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                       {[{ id: "#BK-9021", n: "James Carter", v: "Tesla Model 3", s: "Pending", c: "bg-orange-500" }].map((row, i) => (
                          <tr key={i}><td className="py-8 text-slate-400">{row.id}</td><td className="text-slate-900 dark:text-white leading-none">{row.n}</td><td className="text-slate-400 text-xs tracking-widest">{row.v}</td><td><span className="flex items-center gap-2 tracking-widest text-[10px]"><div className={`w-2 h-2 rounded-full ${row.c}`} />{row.s}</span></td><td className="text-right leading-none"><button className="text-blue-600 hover:scale-110 transition-transform">Process</button></td></tr>
                       ))}
                    </tbody>
                  </table>
               </div></div>
            </div>

            {/* Side Action Area */}
            <div className="space-y-10">
               <div className="bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col justify-between h-[350px] relative overflow-hidden shadow-2xl">
                  <Car className="absolute top-0 right-0 p-8 opacity-10" size={150}/>
                  <div className="relative z-10"><h4 className="text-2xl font-[900] italic uppercase tracking-tighter mb-4 leading-none">{t.side.addTitle}</h4><p className="text-[10px] font-bold opacity-60 mb-10 normal-case">{t.side.addSub}</p></div>
                  <button className="w-full py-5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase italic shadow-xl shadow-blue-200 transition-transform hover:scale-105"><PlusCircle size={18} className="inline mr-2"/> {t.side.addCta}</button>
               </div>

               <div className="bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden h-fit italic font-black uppercase">
                  <div className="flex justify-between items-center mb-10"><h4 className="text-[10px] tracking-widest text-slate-900 dark:text-white">{t.side.availTitle}</h4><button className="text-[8px] text-blue-600">View All</button></div>
                  <div className="space-y-8">
                     {[{ n: "2023 BMW X5", p: "$120/day", s: "bg-green-500" }, { n: "Ferrari 488", p: "$450/day", s: "bg-green-500" }].map((car, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer leading-none">
                          <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0"><Car size={20} className="text-slate-300" /></div>
                          <div className="flex-1 overflow-hidden"><p className="text-[11px] truncate dark:text-white tracking-tighter leading-none">{car.n}</p><p className="text-[9px] font-bold text-slate-400 mt-2 tracking-widest leading-none">{car.p}</p></div>
                          <div className={`size-1.5 rounded-full ${car.s} shadow-lg shrink-0 shadow-green-500/50`} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Install button (Mobile) */}
      {!deferredPrompt && (
        <button onClick={handleInstall} className="fixed bottom-10 right-10 lg:hidden bg-blue-600 text-white p-5 rounded-full shadow-2xl z-[250] animate-bounce"><Download size={24} /></button>
      )}
    </div>
  );
}