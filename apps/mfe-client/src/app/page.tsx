'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Calendar, Heart, Star, Bell, 
  Download, ChevronRight, Key, ShieldCheck, Headphones,
  Facebook, Twitter, Instagram, Moon, Sun, Languages
} from 'lucide-react';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

export default function ClientPortal() {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const t = lang === 'FR' ? fr : en;

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* --- NAVBAR --- */}
      <nav className="h-20 bg-white dark:bg-[#0f1323] border-b border-slate-100 dark:border-slate-800 sticky top-0 z-[100] px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Key size={18} fill="currentColor" /></div>
          <span className="text-xl font-black italic tracking-tighter uppercase text-blue-900 dark:text-white">Easy<span className="text-blue-600">Rental</span></span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">{t.nav.search}</a>
          <a href="#" className="hover:text-blue-600">{t.nav.bookings}</a>
          <a href="#" className="hover:text-blue-600">{t.nav.help}</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'FR' ? 'EN' : 'FR')} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase flex items-center gap-2"><Languages size={14}/> {lang}</button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400">{darkMode ? <Sun size={16}/> : <Moon size={16}/>}</button>
          <button className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200 dark:shadow-none"><Download size={14}/> {t.nav.install}</button>
          <Bell size={20} className="text-slate-300 cursor-pointer" />
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="profile" />
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative px-6 py-10 md:px-10">
        <div className="max-w-7xl mx-auto relative rounded-[3rem] overflow-hidden h-[500px] flex items-center justify-center text-center px-4">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="road" />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative z-10 w-full max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-[900] italic text-white uppercase leading-[0.85] tracking-tighter mb-6">
              {t.hero.title} <br/><span className="text-blue-400">{t.hero.accent}</span>
            </h1>
            <p className="text-white/80 font-bold uppercase text-[10px] tracking-[0.4em] mb-12">{t.hero.sub}</p>

            {/* Massive Search Bar */}
            <div className="bg-white rounded-[2.5rem] p-2 shadow-2xl flex flex-col md:flex-row items-center gap-1 max-w-3xl mx-auto border-4 border-white/20">
              <div className="flex-1 flex items-center gap-4 px-6 py-4">
                <MapPin size={22} className="text-slate-300" />
                <div className="text-left">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">{t.hero.loc}</label>
                  <input className="bg-transparent outline-none font-bold text-slate-900 w-full placeholder:text-slate-300" placeholder={t.hero.locPlace} />
                </div>
              </div>
              <div className="h-10 w-px bg-slate-100 hidden md:block" />
              <div className="flex-1 flex items-center gap-4 px-6 py-4">
                <Calendar size={22} className="text-slate-300" />
                <div className="text-left flex-1">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">{t.hero.dates}</label>
                  <input className="bg-transparent outline-none font-bold text-slate-900 w-full placeholder:text-slate-300" placeholder={t.hero.datesPlace} />
                </div>
                <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.8rem] font-black uppercase text-xs flex items-center gap-2 hover:bg-blue-700 transition-all">
                  <Search size={18} strokeWidth={3} /> {t.hero.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <div className="flex gap-4 overflow-x-auto px-6 md:px-10 py-8 no-scrollbar max-w-7xl mx-auto justify-center">
        {[
          { label: t.cats.all, active: true },
          { label: t.cats.vehicles, icon: '🚗' },
          { label: t.cats.tools, icon: '⚒️' },
          { label: t.cats.electronics, icon: '📷' },
          { label: t.cats.camping, icon: '🏕️' }
        ].map((cat, i) => (
          <button key={i} className={`px-8 py-4 rounded-[2rem] whitespace-nowrap font-black text-[10px] uppercase tracking-widest border transition-all flex items-center gap-3 ${cat.active ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-600'}`}>
            {cat.icon && <span>{cat.icon}</span>} {cat.label}
          </button>
        ))}
      </div>

      {/* --- FEATURED RENTALS --- */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-[900] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">{t.rentals.title}</h2>
          <a href="#" className="text-blue-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 group">{t.rentals.viewAll} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/></a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { tag: "VEHICLE", title: "Tesla Model 3", price: 85, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500", rating: 4.9 },
            { tag: "POPULAR", title: "Canon R5 Kit", price: 120, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500", rating: 5.0 },
            { tag: "TOOLS", title: "Heavy Duty Drill", price: 25, img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500", rating: 4.7 },
            { tag: "VEHICLE", title: "15' Moving Truck", price: 45, img: "https://images.unsplash.com/photo-1586191582056-a607e4d8120b?w=500", rating: 4.5 }
          ].map((item, i) => (
            <div key={i} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all">
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative">
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark/90 px-3 py-1 rounded-full text-[8px] font-black uppercase italic text-blue-600 z-10">{item.tag}</div>
                <div className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur rounded-full text-white cursor-pointer hover:bg-red-500 transition-colors"><Heart size={16}/></div>
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="product" />
              </div>
              <div className="flex justify-between items-start mb-2 px-1">
                <h3 className="font-black uppercase italic text-sm tracking-tight">{item.title}</h3>
                <div className="flex items-center gap-1 text-[10px] font-black text-orange-500"><Star size={12} fill="currentColor"/> {item.rating}</div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Assurance incluse • bastos hub</p>
              <div className="flex items-center justify-between px-1">
                 <div>
                    <span className="text-xl font-black text-blue-600">${item.price}</span>
                    <span className="text-[8px] font-black uppercase text-slate-300 ml-1">/ {t.rentals.day}</span>
                 </div>
                 <button className="bg-slate-100 dark:bg-slate-900 text-blue-600 px-4 py-2 rounded-2xl font-black uppercase text-[10px] hover:bg-blue-600 hover:text-white transition-all">{t.rentals.book}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BENEFITS --- */}
      <section className="py-24 border-y border-slate-50 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          {[
            { icon: <Key className="text-blue-600"/>, t: t.benefits.b1t, d: t.benefits.b1d },
            { icon: <ShieldCheck className="text-blue-600"/>, t: t.benefits.b2t, d: t.benefits.b2d },
            { icon: <Headphones className="text-blue-600"/>, t: t.benefits.b3t, d: t.benefits.b3d },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">{b.icon}</div>
              <h4 className="text-xl font-[900] italic uppercase tracking-tighter">{b.t}</h4>
              <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-24 pb-12 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="col-span-2">
             <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Key size={18} fill="currentColor"/></div>
                <span className="text-lg font-black tracking-tighter uppercase italic text-blue-900 dark:text-white">Easy<span className="text-blue-600">Rental</span></span>
             </div>
             <p className="normal-case tracking-normal font-medium leading-relaxed max-w-xs text-slate-500 mb-10">{t.footer.desc}</p>
             <div className="flex gap-4">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Icon size={16}/></div>
                ))}
             </div>
          </div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">{t.footer.company}</h5><ul className="space-y-5"><li>About Us</li><li>Careers</li><li>Blog</li></ul></div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">{t.footer.support}</h5><ul className="space-y-5"><li>Help Center</li><li>Privacy Policy</li><li>Terms</li></ul></div>
        </div>
        <div className="text-[9px] font-black text-slate-300 dark:text-slate-700 tracking-[0.5em] uppercase italic text-center border-t border-slate-50 dark:border-slate-800 pt-10">
          {t.footer.copy}
        </div>
      </footer>
    </div>
  );
}