/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { Menu, Sun, Moon, Languages, Download, Bell } from 'lucide-react';
import { notifService } from '@pwa-easy-rental/shared-services';

export const Header = ({ 
  title, 
  orgData, 
  lang, 
  setLang, 
  darkMode, 
  toggleTheme, 
  setSidebarOpen, 
  onInstall,
  hasPrompt,
  setCurrentView,
  t 
}: any) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (orgData?.id) {
      notifService.countUnreadOrg(orgData.id).then(res => {
        if (res.ok) setUnreadCount(res.data);
      });
    }
  }, [orgData?.id]);

  return (
    <header className="h-20 px-6 md:px-10 flex items-center justify-between shrink-0 border-b-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1323]/80 backdrop-blur-lg sticky top-0 z-[50]">
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>
        
        <div className="flex flex-col text-left">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            {title}
          </h2>
          <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mt-1">
            Console d&apos;administration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {hasPrompt && (
            <button 
              onClick={onInstall} 
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-orange-50 dark:bg-orange-500/10 text-[#F76513] rounded-full font-black text-[10px] uppercase border border-orange-100 dark:border-orange-500/20 hover:bg-orange-100 transition-colors animate-pulse"
            >
                <Download size={14} /> {t.header.installBtn || "Installer"}
            </button>
        )}

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
          className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-black border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#0528d6] transition-all"
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
           <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1 group-hover:text-[#0528d6] transition-colors">
                Administrateur
              </p>
              <p className="text-xs font-black text-slate-700 dark:text-slate-200 max-w-[120px] truncate italic">
                {orgData?.name || "Organisation"}
              </p>
           </div>
           
           <div className="relative">
              <div className="size-10 rounded-xl bg-gradient-to-br from-[#0528d6] to-blue-400 p-[2px] shadow-md group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] overflow-hidden">
                  <img 
                    src={orgData?.logoUrl || `https://ui-avatars.com/api/?name=${orgData?.name}&background=0528d6&color=fff`} 
                    alt="Logo" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 size-3 bg-green-500 border-2 border-white dark:border-[#0f1323] rounded-full"></span>
           </div>
        </div>
      </div>
    </header>
  );
};