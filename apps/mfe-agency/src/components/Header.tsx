// FILE: apps/mfe-agency/src/components/Header.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Menu, Sun, Moon, Languages, Bell, MapPin } from 'lucide-react';
import { notifService } from '@pwa-easy-rental/shared-services';

export const Header = ({ 
  title, 
  userData, 
  agencyData,
  lang, 
  setLang, 
  darkMode, 
  toggleTheme, 
  setSidebarOpen,
  setCurrentView
}: any) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (agencyData?.id) {
      const fetchNotifs = () => {
        notifService.countUnreadAgency(agencyData.id).then(res => {
          if (res.ok) setUnreadCount(res.data);
        });
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000);
      return () => clearInterval(interval);
    }
  }, [agencyData?.id]);

  return (
    <header className="h-20 px-6 md:px-10 flex items-center justify-between shrink-0 border-b-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1323]/80 backdrop-blur-lg sticky top-0 z-[50]">
      
      <div className="flex items-center gap-6 text-left">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>
        
        <div className="flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            {title}
          </h2>
          <div className="hidden md:flex items-center gap-2 mt-1.5 text-[11px] font-bold text-slate-400  tracking-widest italic">
            <MapPin size={12} className="text-[#0528d6]" /> {agencyData?.name || 'Localisation...'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={() => setCurrentView('NOTIFICATIONS')}
          className="p-2.5 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-all relative group"
        >
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 size-4 bg-red-500 border-2 border-white dark:border-[#0f1323] rounded-full text-[8px] text-white flex items-center justify-center font-black">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')} 
          className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#0528d6] transition-all"
        >
          <Languages size={16} className="text-[#0528d6]" />
          <span className="hidden sm:inline italic">{lang}</span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-orange-500 transition-colors shadow-sm"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div 
            onClick={() => setCurrentView('PROFILE')}
            className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
        >
           <div className="text-right hidden sm:block text-slate-900 dark:text-white">
              <p className="text-[10px] font-bold text-slate-400  tracking-tighter leading-none mb-1 group-hover:text-[#0528d6] transition-colors">
                Personnel Agency
              </p>
              <p className="text-xs font-bold truncate max-w-[120px] italic">
                {userData?.fullname}
              </p>
           </div>
           
           <div className="relative">
              <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] font-bold shadow-md border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-all">
                {userData?.firstname?.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 size-3 bg-green-500 border-2 border-white dark:border-[#0f1323] rounded-full"></span>
           </div>
        </div>
      </div>
    </header>
  );
};