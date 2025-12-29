'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, Plus, Search, MapPin, Loader2, Edit3, 
  Trash2, X, Filter, Fuel, Users as UsersIcon, 
  Settings2, ArrowRight, Gauge, Layers
} from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';

export const VehiclesView = ({ orgData, t }: { orgData: any, t: any }) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State (aligné sur VehicleRequestDTO)
  const [formData, setFormData] = useState({ 
    marque: '', 
    modele: '', 
    immatriculation: '', 
    kilometrage: 0,
    transmission: 'MANUAL',
    carburantType: 'ESSENCE',
    places: 5,
    agencyId: '', 
    categoryId: '', 
    statut: 'AVAILABLE' 
  });

  useEffect(() => { loadData(); }, [orgData?.id]);

  const loadData = async () => {
    if (!orgData?.id) return;
    setLoading(true);
    try {
      const [vehRes, agRes, catRes] = await Promise.all([
        orgService.getVehiclesByOrg(orgData.id),
        orgService.getAgencies(orgData.id),
        orgService.getVehicleCategories(orgData.id)
      ]);
      if (vehRes.ok) setVehicles(vehRes.data || []);
      if (agRes.ok) setAgencies(agRes.data || []);
      if (catRes.ok) setCategories(catRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch = v.marque?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.immatriculation?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAgency = selectedAgency === 'all' || v.agencyId === selectedAgency;
      const matchCategory = selectedCategory === 'all' || v.categoryId === selectedCategory;
      return matchSearch && matchAgency && matchCategory;
    });
  }, [vehicles, searchTerm, selectedAgency, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        ...formData,
        kilometrage: Number(formData.kilometrage),
        places: Number(formData.places)
      };
      const res = await orgService.createVehicle(orgData.id, payload);
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ marque: '', modele: '', immatriculation: '', kilometrage: 0, transmission: 'MANUAL', carburantType: 'ESSENCE', places: 5, agencyId: '', categoryId: '', statut: 'AVAILABLE' });
        loadData();
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce véhicule de la flotte ?")) {
      await orgService.deleteVehicle(id);
      loadData();
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center animate-pulse">
      <Loader2 className="animate-spin text-primary size-12" />
      <p className="text-[10px] font-black uppercase mt-4 text-slate-400">Analyse de la flotte...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* 1. STATS VÉHICULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label={t.vehicles.stats.total} value={vehicles.length} icon={<Car />} />
        <StatCard label={t.vehicles.stats.available} value={vehicles.filter(v => v.statut === 'AVAILABLE').length} icon={<CheckCircle2 className="text-green-500" />} />
        <StatCard label={t.vehicles.stats.maintenance} value={vehicles.filter(v => v.statut === 'MAINTENANCE').length} icon={<Settings2 className="text-orange-500" />} />
      </div>

      {/* 2. FILTRES & ACTIONS */}
      <div className="flex flex-col xl:flex-row justify-between gap-6">
        <div className="flex flex-col md:flex-row flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder={t.vehicles.searchPlaceholder}
              className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#F76513] font-bold text-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-xs font-black uppercase italic shadow-sm outline-none focus:ring-2 focus:ring-primary dark:text-white"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
          >
            <option value="all">🏢 {t.vehicles.allAgencies}</option>
            {agencies.map(ag => <option key={ag.id} value={ag.id}>{ag.name}</option>)}
          </select>
          <select 
            className="bg-white dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-xs font-black uppercase italic shadow-sm outline-none focus:ring-2 focus:ring-primary dark:text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">🏷️ {t.vehicles.allCategories}</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-[#F76513] text-white rounded-2xl font-[900] uppercase italic text-xs shadow-xl shadow-orange-200 dark:shadow-none flex items-center justify-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={18} /> {t.vehicles.addBtn}
        </button>
      </div>

      {/* 3. GRILLE DE VÉHICULES */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1d2d] rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
            <Car size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase italic text-sm">{t.vehicles.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="bg-white dark:bg-[#1a1d2d] rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase italic ${v.statut === 'AVAILABLE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {v.statut}
              </div>

              <div className="size-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Car size={40} />
              </div>

              <h4 className="text-2xl font-[900] italic uppercase text-slate-900 dark:text-white leading-none">{v.marque} <span className="text-primary">{v.modele}</span></h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg w-fit">
                {v.immatriculation}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
                <div className="text-center">
                    <UsersIcon size={16} className="mx-auto text-slate-300 mb-1" />
                    <p className="text-[10px] font-black dark:text-white">{v.places} P.</p>
                </div>
                <div className="text-center border-x border-slate-50 dark:border-slate-800">
                    <Fuel size={16} className="mx-auto text-slate-300 mb-1" />
                    <p className="text-[10px] font-black dark:text-white uppercase">{v.carburantType?.substring(0,3)}</p>
                </div>
                <div className="text-center">
                    <Gauge size={16} className="mx-auto text-slate-300 mb-1" />
                    <p className="text-[10px] font-black dark:text-white">{v.kilometrage} km</p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <MapPin size={14}/>
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-500 italic">
                        {agencies.find(a=>a.id === v.agencyId)?.name || '---'}
                    </span>
                </div>
                <button onClick={()=>handleDelete(v.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL AJOUT (SIDE DRAWER) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <form 
            onSubmit={handleSubmit} 
            className="relative w-full max-w-xl h-full bg-white dark:bg-[#1a1d2d] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
          >
            <div className="p-8 md:p-12 flex-1 overflow-y-auto no-scrollbar space-y-10">
                <div className="flex justify-between items-center">
                    <h3 className="text-4xl font-[900] italic uppercase text-slate-900 dark:text-white tracking-tighter leading-none">
                        {t.vehicles.modal.titleAdd}
                    </h3>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500">
                        <X size={24}/>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 italic ml-1">{t.vehicles.modal.marque}</label>
                            <input required value={formData.marque} onChange={e=>setFormData({...formData, marque:e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 italic ml-1">{t.vehicles.modal.modele}</label>
                            <input required value={formData.modele} onChange={e=>setFormData({...formData, modele:e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 italic ml-1">{t.vehicles.modal.plate}</label>
                        <input required value={formData.immatriculation} onChange={e=>setFormData({...formData, immatriculation:e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary dark:text-white uppercase" placeholder="LT 123 AA" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 italic ml-1">{t.vehicles.modal.km}</label>
                            <input type="number" required value={formData.kilometrage} onChange={e=>setFormData({...formData, kilometrage:Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 italic ml-1">{t.vehicles.modal.places}</label>
                            <input type="number" required value={formData.places} onChange={e=>setFormData({...formData, places:Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 italic ml-1">{t.vehicles.modal.agency}</label>
                        <select required value={formData.agencyId} onChange={e=>setFormData({...formData, agencyId:e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none dark:text-white">
                            <option value="">{t.staff.modal.selectPlaceholder}</option>
                            {agencies.map(ag => <option key={ag.id} value={ag.id}>{ag.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 italic ml-1">{t.vehicles.modal.category}</label>
                        <select required value={formData.categoryId} onChange={e=>setFormData({...formData, categoryId:e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none dark:text-white">
                            <option value="">{t.staff.modal.selectPlaceholder}</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 border-t border-slate-50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                <button 
                  disabled={modalLoading}
                  type="submit" 
                  className="w-full py-6 bg-[#F76513] text-white rounded-[2rem] font-[900] uppercase italic text-sm shadow-xl shadow-orange-200 dark:shadow-none flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                >
                    {modalLoading ? <Loader2 className="animate-spin" /> : <>{t.vehicles.modal.submit} <ArrowRight size={20}/></>}
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon }: any) => (
  <div className="bg-white dark:bg-[#1a1d2d] p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm group hover:shadow-xl transition-all">
    <div className="size-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-primary italic shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-[900] uppercase text-slate-400 tracking-widest leading-none mb-1 italic">{label}</p>
      <p className="text-3xl font-[900] text-slate-900 dark:text-white uppercase italic leading-none">{value}</p>
    </div>
  </div>
);

const CheckCircle2 = ({ className, size = 20 }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);