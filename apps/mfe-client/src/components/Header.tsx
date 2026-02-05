/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Sun, Moon, Languages, Bell } from 'lucide-react';

export const Header = ({ isAuth, userData, setCurrentView, toggleTheme, darkMode, lang, setLang }: any) => {
  return (
    <header className="fixed top-0 w-full z-[100] bg-white/80 dark:bg-[#0f1323]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 h-20">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
        <div onClick={() => setCurrentView('HOME')} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-[#0528d6] rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6 font-bold italic text-xl">E</div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">Easy<span className="text-[#0528d6]">Rental</span></span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Client Dashboard</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          <NavBtn label="Accueil" onClick={() => setCurrentView('HOME')} />
          <NavBtn label="Catalogue" onClick={() => setCurrentView('CARS')} />
          {isAuth && <NavBtn label="Mes Locations" onClick={() => setCurrentView('MY_BOOKINGS')} />}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <Languages size={16} className="text-[#0528d6]" />
            <span className="hidden sm:inline">{lang}</span>
          </button>

          <button onClick={toggleTheme} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-orange-500 transition-colors">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={() => setCurrentView('NOTIFICATIONS')}
            className="p-2.5 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-all relative"
          >
            <Bell size={20} />
            {/* Optionnel: Compteur réel via getUnreadNotificationsCount */}
            <span className="absolute top-2 right-2.5 size-2 bg-red-500 border-2 border-white dark:border-[#0f1323] rounded-full"></span>
          </button>

          {isAuth ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div onClick={() => setCurrentView('PROFILE')} className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1 group-hover:text-[#0528d6]">Client</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{userData.firstname}</p>
                </div>
                <div className="size-10 rounded-xl bg-gradient-to-br from-[#0528d6] to-blue-400 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white dark:border-slate-800 group-hover:scale-110 transition-transform">
                  {userData.firstname.charAt(0)}
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setCurrentView('AUTH')} className="bg-[#0528d6] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-tighter text-[10px] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all italic">Connexion</button>
          )}
        </div>
      </div>
    </header>
  );
};

const NavBtn = ({ label, onClick }: any) => (
  <button onClick={onClick} className="text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-400 hover:text-[#0528d6] transition-colors">{label}</button>
);