/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';    
import { Sun, Moon, LogOut, Car, Home, Ticket} from 'lucide-react';

export const Header = ({ isAuth, userData, currentView, setCurrentView, toggleTheme, darkMode, lang, setLang, onLogout }: any) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 px-6 md:px-12 flex items-center justify-between z-[100] bg-white/80 dark:bg-[#0f1323]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('HOME')}>
          <div className="size-10 bg-[#0528d6] rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6">
            <span className="font-bold text-xl italic">E</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Easy<span className="text-[#0528d6]">Rental</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink label="Accueil" active={currentView === 'HOME'} onClick={() => setCurrentView('HOME')} icon={<Home size={16}/>} />
          <NavLink label="Catalogue" active={currentView === 'CATALOG'} onClick={() => setCurrentView('CATALOG')} icon={<Car size={16}/>} />
          <NavLink label="Mes Trajets" active={currentView === 'MY_BOOKINGS'} onClick={() => setCurrentView('MY_BOOKINGS')} icon={<Ticket size={16}/>} />
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-500">{lang}</button>
        <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-orange-500 transition-colors">{darkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
        
        {isAuth ? (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
             <button onClick={() => setCurrentView('PROFILE')} className="flex items-center gap-3 group">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Client</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[100px]">{userData?.firstname}</p>
                </div>
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] font-bold border border-slate-200 dark:border-slate-700">
                  {userData?.firstname?.charAt(0)}
                </div>
             </button>
             <button onClick={onLogout} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><LogOut size={20}/></button>
          </div>
        ) : (
          <button onClick={() => setCurrentView('AUTH')} className="px-6 py-2.5 bg-[#0528d6] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20">Connexion</button>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ label, active, onClick, icon }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${active ? 'text-[#0528d6]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
    {icon} {label}
  </button>
);