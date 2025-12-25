'use client';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, List, Calendar as CalIcon, Settings, Search, Bell, 
  PlusCircle, Filter, MoreVertical, WifiOff, Car, Key, Boxes, 
  Menu, X, Sun, Moon, Languages, Download, LogOut, Loader2, Lock, Home, User
} from 'lucide-react';
import { authService } from '@pwa-easy-rental/shared-services';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

export default function AgencyDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const t = lang === 'FR' ? fr : en;

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
    } catch (err) { setAuthError(t.auth.error); }
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
    } else alert(t.auth.installNotice);
  };

  // --- NOUVELLE SIDEBAR DESIGN ---
  const Sidebar = () => (
    <aside className={`${sidebarOpen ? 'fixed inset-0 z-[200]' : 'hidden'} lg:relative lg:flex lg:w-72 bg-[#0f1323] text-white flex-col p-8 shrink-0 transition-all border-r border-white/5`}>
      {sidebarOpen && <div className="absolute inset-0 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Brand */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(5,40,214,0.4)] italic font-black text-xl">E</div>
            <span className="text-xl font-[900] italic uppercase tracking-tighter">Easy<span className="text-blue-500">Rental</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={24}/></button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 space-y-10">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">{t.sidebar.menu}</p>
            <nav className="space-y-1 text-[10px] font-black uppercase tracking-[0.2em]">
              {[{ id: 'd', i: <LayoutDashboard size={18}/>, l: t.sidebar.dash, a: true }, { id: 's', i: <Settings size={18}/>, l: t.sidebar.status }].map((item) => (
                <button key={item.id} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${item.a ? 'bg-blue-600 text-white italic shadow-lg shadow-blue-900/50' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                  {item.i} {item.l}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">{t.sidebar.ops}</p>
            <nav className="space-y-1 text-[10px] font-black uppercase tracking-[0.2em]">
              {[{ id: 'l', i: <List size={18}/>, l: t.sidebar.listings }, { id: 'b', i: <CalIcon size={18}/>, l: t.sidebar.bookings, b: "3" }].map((item) => (
                <button key={item.id} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                  {item.i} {item.l} {item.b && <span className="ml-auto bg-orange-500 text-white size-5 rounded-full flex items-center justify-center italic text-[8px]">{item.b}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-900/50 border border-white/10 shrink-0"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="S" /></div>
            <div className="overflow-hidden"><p className="text-[10px] font-black uppercase italic leading-none truncate text-white">Sarah Jenkins</p><p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Agent Senior</p></div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-400 hover:bg-red-500/10 transition-all italic">
            <LogOut size={18}/> {t.nav.logout}
          </button>
        </div>
      </div>
    </aside>
  );

  if (isLoading) return null;

  // --- LOGIN SCREEN ---
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0f1323] flex items-center justify-center p-6 transition-colors duration-300">
        <div className="w-full max-w-xl bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] p-10 md:p-16 shadow-2xl border border-slate-50 dark:border-slate-800 relative overflow-hidden">
          <a href="http://localhost:3000" className="absolute top-10 left-10 text-slate-300 hover:text-blue-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic"><Home size={16} /> {t.nav.backHome}</a>
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl mx-auto mb-8 italic font-black text-3xl">E</div>
            <h1 className="text-4xl font-[900] italic uppercase tracking-tighter mb-4 text-slate-900 dark:text-white leading-none">{t.auth.title}</h1>
            <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">{t.auth.subtitle}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#0f1323] border-none rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-600/10 font-bold text-slate-900 dark:text-white" placeholder={t.auth.email} />
              <div className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-50 dark:bg-[#0f1323] border-none rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-600/10 font-bold text-slate-900 dark:text-white" placeholder={t.auth.password} />
                <Lock size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
            </div>
            {authError && <p className="text-[10px] font-black text-red-500 uppercase text-center tracking-widest italic">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-[900] uppercase italic text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              {authLoading ? <Loader2 className="animate-spin" /> : t.auth.submit}
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-12 border-t border-slate-50 dark:border-slate-800 pt-8">
            <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-2"><Languages size={14}/> {lang}</button>
            <button onClick={() => { setDarkMode(!darkMode); document.documentElement.classList.toggle('dark'); }} className="text-slate-400 hover:text-yellow-500 transition-colors"><Sun size={18}/></button>
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
        <header className="h-24 px-6 md:px-10 flex items-center justify-between shrink-0 bg-white/50 dark:bg-transparent backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"><Menu size={20} /></button>
            <div><h2 className="text-xl md:text-3xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">{t.header.greet} Sarah</h2><p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{t.header.sub}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase border border-slate-100 dark:border-slate-700">{lang}</button>
            <button onClick={handleLogout} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-700 hover:text-red-500 transition-all"><LogOut size={18}/></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: t.kpi.pending, val: "12", grow: "+2 today", icon: <CalIcon className="text-blue-600"/> },
              { label: t.kpi.active, val: "45", icon: <Key className="text-green-500"/> },
              { label: t.kpi.inventory, val: "120", icon: <Boxes className="text-purple-500"/> },
              { label: t.kpi.offline, val: "2", icon: <WifiOff className="text-orange-500"/> },
            ].map((kpi, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1d2d] p-6 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col justify-between h-40 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-slate-50 dark:bg-[#0f1323] rounded-xl">{kpi.icon}</div>
                  {kpi.grow && <span className="text-[8px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tighter italic">{kpi.grow}</span>}
                </div>
                <div><p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{kpi.label}</p><p className="text-4xl font-[900] text-slate-900 dark:text-white tracking-tighter italic leading-none">{kpi.val}</p></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 pb-10">
            {/* Table */}
            <div className="xl:col-span-2 bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="p-6 md:p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 uppercase italic font-black">
                 <h3 className="text-2xl tracking-tighter leading-none">{t.table.title}</h3>
                 <button className="px-5 py-3 bg-blue-600 text-white rounded-xl text-[9px] tracking-widest shadow-lg shadow-blue-200"><PlusCircle size={14} className="inline mr-1"/> {t.table.add}</button>
              </div>
              <div className="flex-1 overflow-x-auto">
                <div className="min-w-[600px] px-10 pb-6">
                  <table className="w-full text-left">
                    <thead className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 border-b border-slate-50 dark:border-slate-800">
                      <tr><th className="py-8">ID</th><th>{t.table.customer}</th><th>{t.table.vehicle}</th><th>{t.table.status}</th><th className="text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {[
                        { id: "#BK-9021", name: "James Carter", v: "Tesla Model 3", s: "Pending", sCol: "bg-orange-100 text-orange-600" },
                        { id: "#BK-9020", name: "Maria Garcia", v: "Ford Explorer", d: "Oct 25 - 27", s: "Confirmed", sCol: "bg-green-100 text-green-600" },
                      ].map((row, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all italic font-black uppercase text-xs">
                          <td className="py-8 text-slate-400 tracking-tighter">{row.id}</td>
                          <td className="text-slate-900 dark:text-white">{row.name}</td>
                          <td className="text-slate-400 text-[11px] leading-none">{row.v}</td>
                          <td><span className={`px-4 py-1.5 rounded-full text-[8px] tracking-widest ${row.sCol}`}>{row.s}</span></td>
                          <td className="text-right"><button className="text-slate-300 hover:text-blue-600 transition-colors"><MoreVertical size={18}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <button className="py-6 border-t border-slate-50 dark:border-slate-800 text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 hover:bg-blue-50 transition-all italic">{t.table.viewAll}</button>
            </div>

            {/* Side Action */}
            <div className="space-y-10">
              <div className="bg-blue-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-300 dark:shadow-none italic font-black uppercase">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Car size={150}/></div>
                <div className="relative z-10">
                  <h4 className="text-2xl tracking-tighter mb-4 leading-none">{t.side.addTitle}</h4>
                  <p className="text-[10px] font-bold opacity-60 mb-10 normal-case leading-relaxed">{t.side.addSub}</p>
                  <button className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform italic">
                    <PlusCircle size={18}/> {t.side.addCta}
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a1d2d] rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm italic font-black uppercase">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[10px] tracking-widest leading-none">{t.side.availTitle}</h4>
                  <button className="text-[8px] text-blue-600">View All</button>
                </div>
                <div className="space-y-6">
                  {[{ n: "2023 BMW X5", p: "$120/day", s: "bg-green-500" }, { n: "Ferrari 488", p: "$450/day", s: "bg-green-500" }].map((car, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer leading-none">
                      <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0"><Car size={20} className="text-slate-300" /></div>
                      <div className="flex-1 overflow-hidden"><p className="text-[11px] truncate dark:text-white tracking-tighter">{car.n}</p><p className="text-[9px] font-bold text-slate-400 mt-2 tracking-widest leading-none">{car.p}</p></div>
                      <div className={`size-1.5 rounded-full ${car.s} shadow-lg shrink-0`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}