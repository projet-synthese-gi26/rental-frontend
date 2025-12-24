'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlayCircle, Zap, Users, ShieldCheck, Globe, 
  BarChart3, Check, Moon, Sun, Languages, ChevronDown, 
  ArrowRight, WifiOff, FileText, LayoutGrid, X, Lock, 
  Facebook, Twitter, Instagram, Mail, 
  MapPin
} from 'lucide-react';

import { fr } from '../locales/fr';
import { en } from '../locales/en';
import AuthModal from '@/components/AuthModal';
import { Navbar } from '@/components';

type Role = 'client' | 'agency' | 'org' | null;

// --- MAIN PAGE ---
export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [initialRole, setInitialRole] = useState<Role>(null);

  const t = lang === 'FR' ? fr : en;

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const openAuth = (role: Role) => { setInitialRole(role); setAuthOpen(true); };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white transition-colors duration-300">
      
      <Navbar t={t} lang={lang} 
        onLangToggle={() => setLang(l => l === 'FR' ? 'EN' : 'FR')}
        darkMode={darkMode} onThemeToggle={() => setDarkMode(!darkMode)}
        onAuthOpen={() => openAuth(null)}
      />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} t={t} initialRole={initialRole} />

      {/* --- HERO --- */}
      <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 dark:border-blue-900 italic">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> {t.hero.badge}
          </div>
          <h1 className="text-6xl md:text-8xl font-[900] italic leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8 uppercase">
            {t.hero.title} <br /> <span className="text-blue-600 underline decoration-orange-500 decoration-4 underline-offset-8">Digitale.</span> <br /> {t.hero.titleAccent}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mb-10">{t.hero.desc}</p>
          <div className="flex flex-wrap gap-4">
            <a href="/client" className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-transform">{t.hero.cta}</a>
            <button className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">{t.hero.demo}</button>
          </div>
        </div>
        <div className="relative group lg:block hidden">
          <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[120px] opacity-20" />
          <div className="relative bg-slate-900 rounded-[4rem] p-4 shadow-2xl border-8 border-slate-800 rotate-2 group-hover:rotate-0 transition-all duration-700">
             <div className="bg-white rounded-[3.2rem] overflow-hidden aspect-video relative">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" alt="Dashboard" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur shadow-2xl p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-blue-600 uppercase italic">Syncing...</span>
                       <span className="text-[10px] font-black text-slate-400">92%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="w-[92%] h-full bg-orange-500 rounded-full" />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- SOLUTIONS --- */}
      <section id="solutions" className="py-32 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-[900] italic tracking-tighter uppercase text-slate-900 dark:text-white mb-4">{t.stakeholders.title}</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{t.stakeholders.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { img: "https://images.unsplash.com/photo-1542362567-b05eef11f94d", label: "HQ View", title: t.stakeholders.org, desc: t.stakeholders.orgDesc, role: 'org' as Role },
            { img: "https://images.unsplash.com/photo-1556740758-90de374c12ad", label: "Manager View", title: t.stakeholders.agency, desc: t.stakeholders.agencyDesc, role: 'agency' as Role },
            { img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42", label: "User App", title: t.stakeholders.client, desc: t.stakeholders.clientDesc, role: 'client' as Role },
          ].map((item, i) => (
            <div key={i} className="group card-pwa p-5 dark:bg-slate-800 dark:border-slate-700 hover:border-blue-600 transition-all">
              <div className="h-72 rounded-[2.5rem] overflow-hidden mb-8 bg-slate-100 relative shadow-inner">
                <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" alt="img" />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase italic text-blue-600">{item.label}</div>
              </div>
              <h3 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed h-12">{item.desc}</p>
              <button onClick={() => openAuth(item.role)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl text-blue-600 font-black text-xs uppercase italic flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                {t.stakeholders.cta} <ArrowRight size={14}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-32 bg-slate-50 dark:bg-slate-900/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-6xl font-[900] italic leading-none tracking-tighter text-slate-900 dark:text-white mb-8 uppercase">Technologie <br /><span className="text-blue-600">PWA First</span></h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed">{t.features.desc}</p>
            <button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase text-sm flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
              {t.features.cta} <LayoutGrid size={20}/>
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: <WifiOff className="text-blue-600"/>, t: t.features.f1, d: t.features.f1d },
              { icon: <MapPin className="text-orange-500"/>, t: t.features.f2, d: t.features.f2d },
              { icon: <FileText className="text-blue-600"/>, t: t.features.f3, d: t.features.f3d },
              { icon: <Zap className="text-orange-500"/>, t: t.features.f4, d: t.features.f4d },
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-inner">{f.icon}</div>
                <h4 className="text-xl font-black uppercase italic text-slate-900 dark:text-white mb-3">{f.t}</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-32 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-[900] italic tracking-tighter uppercase text-slate-900 dark:text-white mb-4">{t.pricing.title}</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{t.pricing.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-12 bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
            <h4 className="text-xl font-black uppercase italic mb-8 tracking-widest text-slate-400">{t.pricing.starter}</h4>
            <div className="text-5xl font-black mb-10 italic">0€ <span className="text-sm font-normal text-slate-400 tracking-normal">{t.pricing.perMonth}</span></div>
            <ul className="space-y-5 mb-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> {t.pricing.f1}</li>
              <li className="flex gap-2 items-center opacity-40"><Check size={16}/> {t.pricing.f2}</li>
              <li className="flex gap-2 items-center opacity-40"><Check size={16}/> {t.pricing.f3}</li>
            </ul>
            <button className="w-full py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl font-black uppercase text-xs shadow-sm hover:bg-blue-600 hover:text-white transition-all">{t.pricing.cta}</button>
          </div>
          <div className="p-12 bg-blue-600 rounded-[4rem] text-white shadow-[0_40px_80px_-15px_rgba(5,40,214,0.4)] relative overflow-hidden transition-all hover:scale-110 z-10 scale-105">
            <div className="absolute top-8 right-8 rotate-12 opacity-10"><Zap size={120} fill="currentColor"/></div>
            <h4 className="text-xl font-black uppercase italic mb-8 tracking-widest text-blue-200">{t.pricing.pro}</h4>
            <div className="text-5xl font-black mb-10 italic">49€ <span className="text-sm font-normal text-blue-200 tracking-normal">{t.pricing.perMonth}</span></div>
            <ul className="space-y-5 mb-12 text-sm font-bold uppercase tracking-widest">
              <li className="flex gap-2 items-center"><Check size={16}/> {t.pricing.f4}</li>
              <li className="flex gap-2 items-center"><Check size={16}/> {t.pricing.f5}</li>
              <li className="flex gap-2 items-center"><Check size={16}/> {t.pricing.f6}</li>
            </ul>
            <button className="w-full py-5 bg-white text-blue-600 rounded-3xl font-black uppercase text-xs shadow-xl hover:scale-105 transition-transform">{t.pricing.cta}</button>
          </div>
          <div className="p-12 bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
            <h4 className="text-xl font-black uppercase italic mb-8 tracking-widest text-slate-400">{t.pricing.enterprise}</h4>
            <div className="text-5xl font-black mb-10 italic uppercase">{t.pricing.onDemand}</div>
            <ul className="space-y-5 mb-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> Multi-agences</li>
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> API Dédiée</li>
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> Marque blanche</li>
            </ul>
            <button className="w-full py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl font-black uppercase text-xs shadow-sm hover:bg-blue-600 hover:text-white transition-all">{t.pricing.cta}</button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-32 pb-16 px-6 max-w-7xl mx-auto border-t border-slate-50 dark:border-slate-800 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          <div className="col-span-2">
             <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Zap size={18} fill="currentColor"/></div>
                <span className="text-lg font-black tracking-tighter uppercase italic text-blue-900 dark:text-white">PWA <span className="text-blue-600">Easy Rental</span></span>
             </div>
             <p className="normal-case tracking-normal font-medium leading-relaxed max-w-xs text-slate-500 dark:text-slate-400 mb-10">{t.footer.desc}</p>
             <div className="flex gap-6">
                {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm"><Icon size={20}/></div>
                ))}
             </div>
          </div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">{t.nav.features}</h5><ul className="space-y-5"><li>PWA First</li><li>Offline Sync</li><li>Real-time GPS</li></ul></div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">Docs</h5><ul className="space-y-5"><li>API Guides</li><li>SDKs</li><li>Status</li></ul></div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">Connect</h5><ul className="space-y-5"><li>Support</li><li>Careers</li><li>Press</li></ul></div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-50 dark:border-slate-800 text-[9px] font-[900] text-slate-300 dark:text-slate-700 tracking-[0.5em] uppercase italic text-center">
          <span>{t.footer.copy}</span>
          <div className="flex gap-10 mt-8 md:mt-0"><span>{t.footer.privacy}</span><span>{t.footer.terms}</span></div>
        </div>
      </footer>
    </div>
  );
}