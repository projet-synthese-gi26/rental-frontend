'use client';
import React, { useState } from 'react';
import { 
  LayoutDashboard, Store, BarChart3, Users, Settings, 
  LogOut, Search, Bell, ChevronDown, Zap, ShieldCheck, 
  Database, Plus, Download, MoreHorizontal, Globe, Languages, Sun, Moon
} from 'lucide-react';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

export default function OrganisationDashboard() {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const t = lang === 'FR' ? fr : en;

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC] dark:bg-[#0f1323] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white dark:bg-[#1a1d2d] border-r border-slate-100 dark:border-slate-800 flex flex-col p-8 transition-all">
        <div className="flex items-center gap-3 mb-16 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Zap size={22} fill="currentColor"/></div>
          <div>
            <h1 className="text-xl font-[900] italic uppercase tracking-tighter leading-none">Easy<span className="text-blue-600">Rental</span></h1>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dash', icon: <LayoutDashboard size={20}/>, label: t.sidebar.dashboard, active: true },
            { id: 'age', icon: <Store size={20}/>, label: t.sidebar.agencies },
            { id: 'stat', icon: <BarChart3 size={20}/>, label: t.sidebar.stats },
            { id: 'user', icon: <Users size={20}/>, label: t.sidebar.users },
            { id: 'sett', icon: <Settings size={20}/>, label: t.sidebar.settings },
          ].map((item) => (
            <button key={item.id} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${item.active ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none italic' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-red-500 transition-all mt-auto">
          <LogOut size={20}/> {t.sidebar.logout}
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-24 bg-white/80 dark:bg-[#1a1d2d]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-10 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-[900] italic uppercase tracking-tighter">{t.header.title}</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
              <input className="bg-slate-50 dark:bg-[#0f1323] rounded-2xl py-3 pl-12 pr-6 text-xs font-bold w-72 outline-none focus:ring-2 focus:ring-blue-600 transition-all" placeholder={t.header.search} />
            </div>
            
            <button onClick={() => setLang(l => l === 'FR' ? 'EN' : 'FR')} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-slate-100 dark:border-slate-700 transition-all active:scale-95"><Languages size={14}/> {lang}</button>
            <button onClick={toggleTheme} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-700">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <Bell size={22} className="text-slate-300 cursor-pointer hover:text-blue-600 transition-colors" />
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-tighter leading-none italic">Sarah Jenkins</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.header.admin}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden shadow-blue-900/10">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="avatar" />
              </div>
              <ChevronDown size={16} className="text-slate-300" />
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          
          {/* KPI ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: t.kpi.agencies, val: "124", grow: "+5%", icon: <Store className="text-blue-600"/> },
              { label: t.kpi.rentals, val: "845", grow: "+12%", icon: <Zap className="text-blue-600"/> },
              { label: t.kpi.revenue, val: "$142,500", grow: "+8%", icon: <BarChart3 className="text-blue-600"/> },
              { label: t.kpi.pending, val: "18", badge: t.kpi.action, icon: <ShieldCheck className="text-orange-500"/>, highlight: true },
            ].map((kpi, i) => (
              <div key={i} className={`bg-white dark:bg-[#1a1d2d] p-8 rounded-[2.5rem] shadow-sm border ${kpi.highlight ? 'border-orange-500/20' : 'border-slate-100 dark:border-slate-800'} flex flex-col justify-between h-44 relative overflow-hidden group hover:shadow-xl transition-all`}>
                {kpi.highlight && <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-8 -mt-8" />}
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-inner">{kpi.icon}</div>
                  {kpi.grow && <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">{kpi.grow}</span>}
                  {kpi.badge && <span className="text-[8px] font-black text-white bg-orange-500 px-3 py-1 rounded-full uppercase tracking-tighter italic">{kpi.badge}</span>}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{kpi.label}</p>
                  <p className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tighter uppercase italic">{kpi.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS & SYSTEM */}
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2d] p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-[900] italic uppercase tracking-tighter">{t.charts.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.charts.sub}</p>
                  </div>
                  <button className="px-6 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">{t.charts.period}</button>
               </div>
               {/* Mock Chart Area */}
               <div className="h-64 w-full bg-gradient-to-t from-blue-50/50 dark:from-blue-900/5 to-transparent rounded-3xl relative overflow-hidden flex items-end">
                  <svg className="w-full h-40" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,80 Q150,20 300,60 T600,30 T1000,10" fill="none" stroke="#0528d6" strokeWidth="4" className="drop-shadow-lg" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10"><Zap size={200} className="text-blue-600"/></div>
               </div>
            </div>

            <div className="bg-[#0f1323] p-10 rounded-[3rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10"><Database size={120} /></div>
               <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black uppercase italic tracking-widest">{t.system.title}</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_#22c55e]" />
                  </div>
                  <div className="space-y-8">
                     <div>
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] mb-3 text-slate-400"><span>{t.system.sync}</span><span>98% {t.system.op}</span></div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="w-[98%] h-full bg-blue-600 rounded-full shadow-[0_0_10px_#0528d6]" /></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] mb-3 text-slate-400"><span>{t.system.load}</span><span>65% {t.system.moderate}</span></div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="w-[65%] h-full bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]" /></div>
                     </div>
                  </div>
               </div>
               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#0f1323] transition-all">{t.system.log}</button>
            </div>
          </div>

          {/* AGENCIES TABLE */}
          <div className="bg-white dark:bg-[#1a1d2d] rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
               <div>
                  <h3 className="text-3xl font-[900] italic uppercase tracking-tighter">{t.table.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.table.sub}</p>
               </div>
               <div className="flex gap-3">
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all flex items-center gap-2"><Plus size={16}/> {t.table.add}</button>
                  <button className="px-8 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2"><Download size={16}/> {t.table.export}</button>
               </div>
            </div>
            <div className="px-10 pb-10 overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 dark:border-slate-800">
                        <th className="py-8">{t.table.colName}</th>
                        <th>{t.table.colLoc}</th>
                        <th>{t.table.colStatus}</th>
                        <th>{t.table.colRentals}</th>
                        <th>{t.table.colRev}</th>
                        <th className="text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {[
                       { name: "Downtown Hub", loc: "Douala, Akwa", rentals: 142, rev: "$45,200", status: "Online", sCol: "bg-green-500" },
                       { name: "Westside Bastos", loc: "Yaoundé, Bastos", rentals: 98, rev: "$32,150", status: "Syncing", sCol: "bg-blue-500" },
                       { name: "Airport Logistics", loc: "Yaoundé, Nsimalen", rentals: 215, rev: "$65,800", status: "Online", sCol: "bg-green-500" },
                     ].map((item, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer">
                           <td className="py-8 font-black uppercase italic text-sm tracking-tight">{item.name}</td>
                           <td className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.loc}</td>
                           <td>
                              <div className="flex items-center gap-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${item.sCol}`} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                              </div>
                           </td>
                           <td className="font-black text-sm italic">{item.rentals}</td>
                           <td className="font-black text-sm italic text-blue-600">{item.rev}</td>
                           <td className="text-right"><MoreHorizontal className="inline text-slate-300 group-hover:text-blue-600 transition-colors" /></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}