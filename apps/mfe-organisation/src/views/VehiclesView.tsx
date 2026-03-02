/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Car, Plus, Search, Loader2, CheckCircle2, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import { agencyService, orgService, vehicleService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { VehicleCard } from './vehicles/VehicleCard';
import { VehicleFormModal } from './vehicles/VehicleFormModal';
import { VehicleDetailsModal } from './vehicles/VehicleDetailsModal';
import { QuickStatusModal } from './vehicles/QuickStatusModal';

const ITEMS_PER_PAGE = 6;

export const VehiclesView = ({ orgData }: any) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [activeModal, setActiveModal] = useState<'FORM' | 'DETAILS' | 'QUICK_STATUS' | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!orgData?.id) return;
    setLoading(true);
    try {
      const [vehRes, agRes, catRes] = await Promise.all([
        vehicleService.getVehiclesByOrg(orgData.id),
        agencyService.getAgencies(orgData.id),
        vehicleService.getVehicleCategories(orgData.id)
      ]);
      if (vehRes.ok) setVehicles(vehRes.data || []);
      if (agRes.ok) setAgencies(agRes.data || []);
      if (catRes.ok) setCategories(catRes.data || []);
    } finally { setLoading(false); }
  }, [orgData?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  // Handler pour PUT /api/vehicles/{id} (Formulaire complet)
  const handleFormSubmit = async (formData: any) => {
    setModalLoading(true);
    try {
      const res = editingVehicle 
        ? await vehicleService.updateVehicle(editingVehicle.id, formData)
        : await vehicleService.createVehicle(orgData.id, formData);
      if (res.ok) { setActiveModal(null); loadData(); }
    } finally { setModalLoading(false); }
  };

  // Handler pour PATCH /api/vehicles/{id}/status-pricing (Quick Switch)
  const handleQuickStatusSubmit = async (id: string, payload: any) => {
    setModalLoading(true);
    try {
      const res = await (vehicleService as any).updateStatusAndPricing(id, payload);
      if (res.ok) { setActiveModal(null); loadData(); }
    } finally { setModalLoading(false); }
  };

  const filteredVehicles = useMemo(() => vehicles.filter(v => 
    `${v.brand} ${v.model} ${v.licencePlate}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [vehicles, searchTerm]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Flotte Totale" value={vehicles.length} icon={<Car />} />
        <StatCard label="Prêts" value={vehicles.filter(v => v.statut === 'AVAILABLE').length} icon={<CheckCircle2 className="text-green-500"/>} />
        <StatCard label="Atelier" value={vehicles.filter(v => v.statut === 'MAINTENANCE').length} icon={<Settings2 className="text-orange-500"/>} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96 group text-left">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input placeholder="Rechercher marque, modèle, plaque..." className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-black italic outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all dark:text-white" 
                 value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
        </div>
        <button onClick={() => { setEditingVehicle(null); setActiveModal('FORM'); }} className="w-full md:w-auto px-6 py-3 bg-[#0528d6] text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all italic">
          <Plus size={18} /> Ajouter à l'inventaire
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginatedVehicles.map(v => (
          <VehicleCard key={v.id} vehicle={v} 
                       agencyName={agencies.find(a => a.id === v.agencyId)?.name}
                       categoryName={categories.find(c => c.id === v.categoryId)?.name}
                       onViewDetails={(id: string) => { setTargetId(id); setActiveModal('DETAILS'); }}
                       onQuickStatus={(veh: any) => { setEditingVehicle(veh); setActiveModal('QUICK_STATUS'); }}
                       onEdit={(veh: any) => { 
                         setEditingVehicle(veh); 
                         setActiveModal('FORM'); 
                       }}
                       onDelete={async (id: string) => { if(confirm('Supprimer définitivement ?')) { await vehicleService.deleteVehicle(id); loadData(); } }} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 transition-all"><ChevronLeft/></button>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase italic tracking-widest px-4">Page {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 transition-all"><ChevronRight/></button>
        </div>
      )}

      {activeModal === 'DETAILS' && targetId && <VehicleDetailsModal vehicleId={targetId} onClose={() => setActiveModal(null)} />}
      {activeModal === 'QUICK_STATUS' && editingVehicle && <QuickStatusModal vehicle={editingVehicle} onSubmit={handleQuickStatusSubmit} modalLoading={modalLoading} onClose={() => setActiveModal(null)} />}
      {activeModal === 'FORM' && (
        <VehicleFormModal 
          editingVehicle={editingVehicle}
          agencies={agencies}
          categories={categories}
          initialData={editingVehicle ? {
            ...editingVehicle,
            engineDetails: editingVehicle.engineDetails || { type: '', horsepower: 0, capacity: 0 },
            insuranceDetails: editingVehicle.insuranceDetails || { provider: '', policy_number: '', expiry: '' },
            fuelEfficiency: editingVehicle.fuelEfficiency || { city: '', highway: '' },
            functionalities: editingVehicle.functionalities || {},
            images: editingVehicle.images || [],
            description: editingVehicle.description || []
          } : { 
            brand: '', model: '', licencePlate: '', vinNumber: '', kilometrage: 0, places: 5, color: '', transmission: 'MANUAL', agencyId: '', categoryId: '', statut: 'AVAILABLE',
            engineDetails: { type: '', horsepower: 0, capacity: 0 },
            insuranceDetails: { provider: '', policy_number: '', expiry: '' },
            fuelEfficiency: { city: '', highway: '' },
            functionalities: { air_condition: true, gps: true, bluetooth: true, luggage: true, onboard_computer: true },
            images: [], description: []
          }}
          onClose={() => setActiveModal(null)}
          onSubmit={handleFormSubmit}
          modalLoading={modalLoading}
        />
      )}
    </div>
  );
};