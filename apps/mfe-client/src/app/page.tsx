'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Calendar, Heart, Star, Bell, Download, 
  ChevronRight, Key, Moon, Sun, Languages, Menu, X, 
  LogIn, LogOut, Loader2, Lock, Home
} from 'lucide-react';
import { authService } from '@pwa-easy-rental/shared-services';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

const ALL_VEHICLES = [
  { id: 1, cat: 'sport', title: "Porsche 911 GT3", price: 299, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600", rating: 4.9, tag: "HITS" },
  { id: 2, cat: 'electric', title: "Tesla Model 3", price: 85, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600", rating: 4.8, tag: "ECO" },
  { id: 3, cat: 'suv', title: "Range Rover Sport", price: 150, img: "https://images.unsplash.com/photo-1506469717960-433cebe3f181?w=600", rating: 4.7, tag: "POPULAR" },
  { id: 4, cat: 'compact', title: "Mini Cooper S", price: 55, img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600", rating: 4.5, tag: "CITY" },
];

export default function ClientPortal() {
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeCat, setActiveCat] = useState('all');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Auth Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const t = lang === 'FR' ? fr : en;

  // --- LOGIQUE INITIALISATION ---
  useEffect(() => {
    const init = () => {
      const token = new URLSearchParams(window.location.search).get('token') || localStorage.getItem('auth_token');
      if (token) {
        localStorage.setItem('auth_token', token);
        setIsAuth(true);
        if (window.location.search.includes('token')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
      const isDark = localStorage.getItem('theme') === 'dark';
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');

      // PWA Prompt capture
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handler);
      
      setIsLoading(false);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    };
    init();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      let res;
      if (isSignUp) {
        res = await authService.registerClient({ email, password });
        if (res.ok) { setIsSignUp(false); setAuthError("Compte créé ! Connectez-vous."); }
      } else {
        res = await authService.login({ email, password });
        if (res.ok && res.data.token) {
          localStorage.setItem('auth_token', res.data.token);
          setIsAuth(true);
          setShowAuthModal(false);
        } else { setAuthError(t.auth.error); }
      }
    } catch (err) { setAuthError(t.auth.error); }
    finally { setAuthLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuth(false);
    window.location.reload();
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

  const filteredVehicles = activeCat === 'all' ? ALL_VEHICLES : ALL_VEHICLES.filter(v => v.cat === activeCat);

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0f1323] italic font-black text-blue-600 animate-pulse uppercase tracking-widest text-[10px]">{t.auth.verifying}</div>;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* --- MODALE AUTH --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-blue-600 transition-colors"><X /></button>
            <h2 className="text-3xl font-[900] italic uppercase tracking-tighter mb-8">{isSignUp ? t.auth.registerTitle : t.auth.loginTitle}</h2>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.auth.email} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" required />
              <div className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.auth.password} className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" required />
                <Lock className="absolute right-4 top-4 text-slate-300" size={20}/>
              </div>
              {authError && <p className="text-[10px] font-black text-red-500 uppercase text-center">{authError}</p>}
              <button disabled={authLoading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-xl flex items-center justify-center">
                {authLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? t.auth.submitRegister : t.auth.submitLogin)}
              </button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-6 text-xs font-bold text-slate-400 uppercase hover:text-blue-600 transition-colors">
              {isSignUp ? t.auth.hasAccount : t.auth.noAccount}
            </button>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="w-full h-20 bg-white/90 dark:bg-[#0f1323]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-[100] px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* RETOUR LANDING PAGE (3000) */}
          <a href="http://localhost:3000" className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2 group shadow-sm">
            <Home size={18} />
            <span className="hidden xl:block text-[8px] font-black uppercase tracking-widest leading-none">{t.nav.backHome}</span>
          </a>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Key size={18} fill="currentColor" /></div>
            <span className="text-xl font-[900] italic tracking-tighter uppercase text-blue-900 dark:text-white">Easy<span className="text-blue-600">Rental</span></span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1 italic">{t.nav.search}</a>
          <a href="#" className="hover:text-blue-600 transition-colors italic">{t.nav.bookings}</a>
          <a href="#" className="hover:text-blue-600 transition-colors italic">{t.nav.help}</a>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* BOUTON INSTALLATION PWA */}
          <button onClick={handleInstall} className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest border border-transparent hover:border-blue-600 transition-all">
            <Download size={14}/> {t.nav.install}
          </button>

          <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase border border-transparent dark:border-slate-700">{lang}</button>
          <button onClick={() => { const next = !darkMode; setDarkMode(next); document.documentElement.classList.toggle('dark'); localStorage.setItem('theme', next ? 'dark' : 'light'); }} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 border border-transparent dark:border-slate-700">{darkMode ? <Sun size={16}/> : <Moon size={16}/>}</button>
          
          {isAuth ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
               <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-blue-600"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="u" /></div>
               <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-500"><LogOut size={18}/></button>
            </div>
          ) : (
            <button onClick={() => {setIsSignUp(false); setShowAuthModal(true)}} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 italic leading-none"><LogIn size={14}/> {t.nav.login}</button>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="w-full px-4 md:px-10 py-4 md:py-6">
        <div className="w-full max-w-[1440px] mx-auto relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden min-h-[420px] lg:h-[480px] flex items-center justify-center text-center px-4">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="road" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />
          <div className="relative z-10 w-full max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-[900] italic text-white uppercase leading-[0.9] tracking-tighter mb-4 drop-shadow-2xl">{t.hero.title} <br/><span className="text-blue-400">{t.hero.accent}</span></h1>
            <p className="text-white/70 font-bold uppercase text-[9px] md:text-[11px] tracking-[0.4em] mb-10 max-w-xl mx-auto">{t.hero.sub}</p>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] md:rounded-full p-1.5 shadow-2xl flex flex-col lg:flex-row items-center max-w-4xl mx-auto border-2 border-white/10">
              <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-100 dark:border-slate-800">
                <MapPin size={22} className="text-blue-600 shrink-0" />
                <div className="text-left w-full"><label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{t.hero.loc}</label><input className="bg-transparent outline-none font-bold text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.locPlace} /></div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-6 py-3">
                <Calendar size={22} className="text-blue-600 shrink-0" />
                <div className="text-left flex-1"><label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{t.hero.dates}</label><input className="bg-transparent outline-none font-bold text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.datesPlace} /></div>
                <button className="hidden lg:flex bg-blue-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs items-center gap-2 hover:bg-blue-700 transition-all shadow-lg italic"><Search size={18} strokeWidth={3} /> {t.hero.cta}</button>
              </div>
              <button className="lg:hidden w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 italic"><Search size={18} strokeWidth={3} /> {t.hero.cta}</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <div className="w-full flex gap-3 md:gap-4 overflow-x-auto px-6 md:px-10 py-8 no-scrollbar max-w-7xl mx-auto md:justify-center">
        {Object.keys(t.cats).map((key, i) => (
          <button key={i} onClick={() => setActiveCat(key)} className={`px-8 py-3.5 rounded-full whitespace-nowrap font-black text-[10px] uppercase tracking-widest border transition-all flex items-center gap-3 italic ${activeCat === key ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-600'}`}>{t.cats[key as keyof typeof t.cats]}</button>
        ))}
      </div>

      {/* --- LISTING --- */}
      <section className="w-full px-6 md:px-10 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-5xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">{t.rentals.title}</h2>
          <a href="#" className="text-blue-600 font-black uppercase text-[10px] flex items-center gap-2 italic">{t.rentals.viewAll} <ChevronRight size={14}/></a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredVehicles.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 border border-slate-50 dark:border-slate-800 hover:shadow-2xl transition-all">
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative shadow-inner bg-slate-50 dark:bg-[#0f1323]">
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#0f1323]/95 px-3 py-1 rounded-full text-[8px] font-black uppercase italic text-blue-600 z-10 shadow-sm">{item.tag}</div>
                <div className="absolute top-4 right-4 z-10 p-2.5 bg-white/60 backdrop-blur rounded-full text-slate-900 cursor-pointer hover:bg-red-500 hover:text-white transition-all"><Heart size={16}/></div>
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="v" />
              </div>
              <div className="flex justify-between items-start mb-2 px-1 text-slate-900 dark:text-white">
                <h3 className="font-black uppercase italic text-sm tracking-tight leading-none">{item.title}</h3>
                <div className="flex items-center gap-1 text-[11px] font-black text-orange-500 shrink-0"><Star size={12} fill="currentColor"/> {item.rating}</div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 px-1 italic leading-none">Full Insurance • Bastos Hub</p>
              <div className="flex items-center justify-between px-1">
                 <div className="text-slate-900 dark:text-white"><span className="text-2xl font-black text-blue-600 leading-none">${item.price}</span><span className="text-[9px] font-black uppercase text-slate-300 ml-1">/ {t.rentals.day}</span></div>
                 <button onClick={() => !isAuth && setShowAuthModal(true)} className="bg-slate-50 dark:bg-[#1a1d2d] text-blue-600 dark:text-blue-400 px-6 py-2.5 rounded-2xl font-black uppercase text-[10px] hover:bg-blue-600 hover:text-white transition-all italic">{t.rentals.book}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full pt-20 pb-10 border-t border-slate-50 dark:border-slate-800 text-center uppercase font-black text-slate-300 dark:text-slate-700 text-[9px] tracking-[0.5em] italic">© 2025 PWA EASY RENTAL. ALL RIGHTS RESERVED.</footer>
    </div>
  );
}