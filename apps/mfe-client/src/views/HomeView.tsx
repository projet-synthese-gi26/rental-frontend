/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Car, Zap, Star, Loader2, ArrowRight } from 'lucide-react';
import { agencyService, vehicleService } from '@pwa-easy-rental/shared-services';

export const HomeView = ({ onSearch, setViewAll, onSelectVehicle }: any) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({ city: '', start: '', end: '' });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [vehRes, agRes] = await Promise.all([
          vehicleService.getAvailableVehicles(),
          agencyService.getAllAgencies()
        ]);
        if (vehRes.ok) setVehicles(vehRes.data.slice(0, 8));
        if (agRes.ok) setAgencies(agRes.data);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const getAgencyInfo = (agencyId: string) => {
    const agency = agencies.find(a => a.id === agencyId);
    return agency ? { name: agency.name, city: agency.city } : { name: 'Agence Partenaire', city: 'Cameroun' };
  };

  const handleSearchClick = () => {
    onSearch(searchData);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] size-[600px] bg-[#0528d6]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] size-[400px] bg-[#F76513]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 items-center gap-12 relative z-10">
            <div className="text-left space-y-8 animate-in slide-in-from-left-10 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0528d6]/10 text-[#0528d6] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#0528d6]/20 italic">
                <Zap size={14} className="animate-pulse" /> La mobilité sans frontières
              </div>
              
              <h1 className="text-6xl md:text-8xl font-[900] italic tracking-tighter leading-[0.85] uppercase text-slate-900 dark:text-white">
                Louer. <span className="text-[#0528d6]">Conduire.</span> <br /> Revenir.
              </h1>
              
              <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium text-lg italic leading-relaxed">
                Accédez à une flotte premium partout au Cameroun. Simple, rapide et sécurisé.
              </p>
            </div>

            <div className="relative hidden lg:block animate-in zoom-in duration-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0528d6]/20 to-transparent rounded-full blur-3xl opacity-30" />
              <img 
                src="https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=1000&auto=format&fit=crop" 
                alt="Premium SUV" 
                className="relative z-10 w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(5,40,214,0.2)]"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16 bg-white dark:bg-[#1a1d2d] p-3 rounded-[2.5rem] shadow-2xl shadow-blue-600/10 border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2 relative z-20">
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-transparent focus-within:border-[#0528d6] transition-all">
              <MapPin className="text-[#0528d6]" size={20} />
              <div className="text-left flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Ville</p>
                <input 
                  type="text" 
                  placeholder="Où allez-vous ?" 
                  value={searchData.city}
                  onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                  className="bg-transparent border-none outline-none text-xs font-bold w-full dark:text-white" 
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
              <Calendar className="text-[#0528d6]" size={20} />
              <div className="text-left flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Départ</p>
                <input 
                  type="date" 
                  value={searchData.start}
                  onChange={(e) => setSearchData({...searchData, start: e.target.value})}
                  className="bg-transparent border-none outline-none text-xs font-bold w-full dark:text-white cursor-pointer" 
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
              <Calendar className="text-[#0528d6]" size={20} />
              <div className="text-left flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Retour</p>
                <input 
                  type="date" 
                  value={searchData.end}
                  onChange={(e) => setSearchData({...searchData, end: e.target.value})}
                  className="bg-transparent border-none outline-none text-xs font-bold w-full dark:text-white cursor-pointer" 
                />
              </div>
            </div>
            <button 
              onClick={handleSearchClick}
              className="bg-[#0528d6] text-white rounded-3xl font-black uppercase text-sm italic shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Search size={18} /> Rechercher
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">Véhicules Disponibles</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 italic">Les meilleures offres de nos agences partenaires</p>
          </div>
          <button 
            onClick={setViewAll}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-[#0528d6] hover:text-white transition-all shadow-sm"
          >
            Tout voir
          </button>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#0528d6]" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Chargement de la flotte...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vehicles.map((v) => {
              const info = getAgencyInfo(v.agencyId);
              return (
                <div 
                  key={v.id} 
                  onClick={() => onSelectVehicle(v.id)}
                  className="group cursor-pointer bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-3xl mb-6 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-[#0528d6] shadow-sm z-10">
                      {v.transmission === 'MANUAL' ? 'MANU' : 'AUTO'}
                    </div>
                    {v.images?.[0] ? (
                      <img src={v.images[0]} alt={v.model} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110 duration-500" />
                    ) : <Car size={64} className="text-slate-200" />}
                  </div>
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-start">
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-none truncate">{v.brand} {v.model}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1.5 italic truncate">{info.name} • {info.city}</p>
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 text-xs font-black bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-lg shrink-0">
                        <Star size={12} fill="currentColor" /> 4.9
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-4 border-y border-slate-50 dark:border-slate-800 text-slate-400">
                      <div className="flex items-center gap-1 text-[10px] font-black italic">{v.places} PLACES</div>
                      <div className="flex items-center gap-1 text-[10px] font-black italic uppercase">CLIM</div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-xl font-black text-[#0528d6]">{v.pricing?.pricePerDay?.toLocaleString() || '---'}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase ml-1">XAF/Jour</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectVehicle(v.id); }}
                        className="size-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center hover:bg-[#0528d6] hover:text-white dark:hover:bg-[#0528d6] hover:scale-110 active:scale-95 transition-all shadow-lg"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Car size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-400 font-bold italic">Aucun véhicule disponible pour le moment.</p>
          </div>
        )}
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0528d6] rounded-lg flex items-center justify-center text-white font-bold italic">E</div>
          <span className="text-xs font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Easy<span className="text-[#0528d6]">Rental</span> Client App</span>
        </div>
        <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
          <span className="hover:text-[#0528d6] cursor-pointer transition-colors">Aide</span>
          <span className="hover:text-[#0528d6] cursor-pointer transition-colors">Conditions</span>
          <span className="hover:text-[#0528d6] cursor-pointer transition-colors">Devenir Partenaire</span>
        </div>
      </footer>
    </div>
  );
};