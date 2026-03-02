/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { 
  LayoutDashboard, Store, CreditCard, 
  Download, LogOut, X, ShieldCheck, UserCircle,
  ChevronRight, Activity,
  Car,
  LayoutGrid,
  CalendarDays
} from 'lucide-react';

export const Sidebar = ({ 
  currentView, 
  setCurrentView, 
  sidebarOpen, 
  setSidebarOpen, 
  handleInstall, 
  handleLogout 
}: any) => (
  <aside 
    className={`
      ${sidebarOpen ? 'fixed inset-0 z-[200]' : 'hidden'} 
      lg:relative lg:flex lg:w-72 flex-col h-screen shrink-0 transition-all duration-300
      bg-slate-50 border-r-2 border-slate-200 
      dark:bg-[#080b14] dark:border-slate-800 shadow-xl
    `}
  >
    {/* Overlay pour mobile */}
    {sidebarOpen && (
      <div 
        className="absolute inset-0 backdrop-blur-sm lg:hidden" 
        onClick={() => setSidebarOpen(false)} 
      />
    )}
    
    <div className="relative z-10 h-full flex flex-col overflow-hidden">
      
      {/* --- SECTION LOGO --- */}
      <div className="flex-shrink-0 flex items-center justify-between py-10 px-6 mb-2">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-[#0528d6] rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6 duration-300">
            <span className="font-bold text-xl italic">E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Easy<span className="text-[#0528d6] dark:text-blue-400">Rental</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Système de gestion
            </span>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-8 pb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Hub principal</p>
          <div className="space-y-1">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Tableau de bord" active={currentView === 'DASHBOARD'} onClick={() => setCurrentView('DASHBOARD')} />
            <SidebarItem icon={<CalendarDays size={20}/>} label="Gestion Locations" active={currentView === 'RENTALS'} onClick={() => setCurrentView('RENTALS')} />
            <SidebarItem icon={<Store size={20}/>} label="Agences" active={currentView === 'AGENCIES'} onClick={() => setCurrentView('AGENCIES')} />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Opérations réseau</p>
          <div className="space-y-1">
            <SidebarItem icon={<ShieldCheck size={20}/>} label="Postes & Rôles" active={currentView === 'ROLES'} onClick={() => setCurrentView('ROLES')} />
            <SidebarItem icon={<UserCircle size={20}/>} label="Gestion du personnel" active={currentView === 'STAFF'} onClick={() => setCurrentView('STAFF')} />
            <SidebarItem icon={<LayoutGrid size={20}/>} label="Catégories" active={currentView === 'CATEGORIES'} onClick={() => setCurrentView('CATEGORIES')} />
            <SidebarItem icon={<Car size={20}/>} label="Flotte de véhicules" active={currentView === 'VEHICLES'} onClick={() => setCurrentView('VEHICLES')} />
            <SidebarItem icon={<CreditCard size={20}/>} label="Abonnement & Factures" active={currentView === 'SUBSCRIPTION'} onClick={() => setCurrentView('SUBSCRIPTION')} />
          </div>
        </div>
      </nav>

      {/* --- ACTIONS BAS DE PAGE --- */}
      <div className="flex-shrink-0 mt-auto p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        
        {/* BOUTON INSTALLER */}
        <button 
          onClick={handleInstall}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all duration-200 group"
        >
          <Download size={18} className="text-[#0528d6] group-hover:scale-110 transition-transform"/>
          <span>Installer l&apos;application</span>
        </button>

        {/* BOUTON DÉCONNEXION */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18}/>
          <span>Déconnexion</span>
        </button>

        {/* STATUT RÉSEAU */}
        <div className="mt-4 p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800/50">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                  Réseau en direct
                </span>
              </div>
              <Activity size={14} className="text-slate-300 dark:text-slate-700" />
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
      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-[#0528d6] text-white shadow-lg shadow-blue-600/20 font-medium' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`}>
        {icon}
      </div>
      <span className="text-sm">
        {label}
      </span>
    </div>
    {active && <ChevronRight size={14} className="opacity-60 animate-in slide-in-from-left-2" />}
  </button>
);