'use client';
import React from 'react';
import { 
  LayoutDashboard, Store, Users, CreditCard, 
  Download, LogOut, X, ShieldCheck, UserCircle,
  ChevronRight, Activity,
  Car,
  LayoutGrid
} from 'lucide-react';

export const Sidebar = ({ 
  currentView, 
  setCurrentView, 
  sidebarOpen, 
  setSidebarOpen, 
  t, 
  handleInstall, 
  handleLogout 
}: any) => (
  <aside 
    className={`
      ${sidebarOpen ? 'fixed inset-0 z-[200]' : 'hidden'} 
      lg:relative lg:flex lg:w-72 flex-col h-screen shrink-0 transition-all duration-500
      bg-[#0528d6] 
      dark:bg-[#0b1024] border-r border-white/10 dark:border-slate-800 shadow-2xl
    `}
  >
    {/* Overlay flou pour mobile */}
    {sidebarOpen && (
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md lg:hidden" 
        onClick={() => setSidebarOpen(false)} 
      />
    )}
    
    <div className="relative z-10 h-full flex flex-col overflow-hidden">
      
      {/* --- SECTION LOGO (FIXE) --- */}
      <div className="flex-shrink-0 flex items-center justify-between py-8 px-4 mb-2">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-white dark:bg-blue-600 rounded-2xl flex items-center justify-center text-[#0528d6] dark:text-white shadow-xl transition-transform group-hover:rotate-6 duration-300">
            <span className="font-[900] text-2xl italic tracking-tighter">E</span>
          </div>
          <div className="flex flex-col text-white">
            <span className="text-xl font-[900] italic uppercase tracking-tighter leading-none">
              Easy<span className="text-blue-300 dark:text-blue-400">Rental</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-blue-200/50 dark:text-slate-500 mt-1">
              {t.sidebar.systemSubtitle}
            </span>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-white/50 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* --- NAVIGATION (SCROLLABLE SANS ASCENSEUR VISIBLE) --- */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-9 pb-8">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-200/40 dark:text-slate-600 mb-4 px-4">{t.sidebar.hub}</p>
          <div className="space-y-1.5">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label={t.sidebar.dashboard} active={currentView === 'DASHBOARD'} onClick={() => setCurrentView('DASHBOARD')} />
            <SidebarItem icon={<Store size={20}/>} label={t.sidebar.agencies} active={currentView === 'AGENCIES'} onClick={() => setCurrentView('AGENCIES')} />
          </div>
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-200/40 dark:text-slate-600 mb-4 px-4">{t.sidebar.network}</p>
          <div className="space-y-1.5">
            <SidebarItem icon={<ShieldCheck size={20}/>} label={t.sidebar.roles} active={currentView === 'ROLES'} onClick={() => setCurrentView('ROLES')} />
            <SidebarItem icon={<UserCircle size={20}/>} label={t.sidebar.staff} active={currentView === 'STAFF'} onClick={() => setCurrentView('STAFF')} />
            <SidebarItem 
              icon={<Car size={20}/>} 
              label={t.sidebar.vehicles || "Véhicules"} 
              active={currentView === 'VEHICLES'} 
              onClick={() => setCurrentView('VEHICLES')} 
            />
            <SidebarItem 
              icon={<LayoutGrid size={20}/>} 
              label={t.sidebar.categories || "Catégories"} 
              active={currentView === 'CATEGORIES'} 
              onClick={() => setCurrentView('CATEGORIES')} 
            />
            <SidebarItem icon={<CreditCard size={20}/>} label={t.sidebar.subscription} active={currentView === 'SUBSCRIPTION'} onClick={() => setCurrentView('SUBSCRIPTION')} />
          </div>
        </div>
      </nav>

      {/* --- SECTION ACTIONS / FOOTER (FIXE EN BAS) --- */}
      <div className="flex-shrink-0 mt-auto p-4 border-t border-white/10 dark:border-slate-800 bg-[#0528d6] dark:bg-[#0b1024] space-y-2">
        
        {/* BOUTON INSTALLER */}
        <button 
          onClick={handleInstall} 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-blue-100 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all duration-300 group"
        >
          <div className="p-2 bg-white/10 dark:bg-slate-800 rounded-lg group-hover:bg-[#F76513] group-hover:text-white transition-colors text-white">
            <Download size={16}/>
          </div>
          <span className="italic text-white dark:text-slate-400">{t.sidebar.install}</span>
        </button>

        {/* BOUTON LOGOUT */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-red-200 dark:text-red-900/70 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
            <LogOut size={16}/>
          </div>
          <span className="italic text-white dark:text-slate-400">{t.nav.logout}</span>
        </button>

        <div className="mt-2 p-3 bg-white/5 dark:bg-slate-900/50 rounded-2xl border border-white/5 dark:border-slate-800/50">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white dark:text-slate-500">
                <div className="size-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                  {t.sidebar.status}
                </span>
              </div>
              <Activity size={12} className="text-blue-300/30" />
           </div>
        </div>
      </div>
    </div>
  </aside>
);

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`
      w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
      ${active 
        ? 'bg-white dark:bg-blue-600 text-[#0528d6] dark:text-white shadow-xl scale-[1.02]' 
        : 'text-blue-100/70 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-800/50 hover:text-white'
      }
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`transition-transform duration-500 ${active ? 'scale-110 rotate-3' : 'opacity-50 group-hover:opacity-100'}`}>
        {icon}
      </div>
      <span className={`text-[10px] uppercase tracking-widest ${active ? 'font-[900] italic' : 'font-bold'}`}>
        {label}
      </span>
    </div>
    {active && <ChevronRight size={14} className="opacity-40 animate-in slide-in-from-left-2" />}
  </button>
);