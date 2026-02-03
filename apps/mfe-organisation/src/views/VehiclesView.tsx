'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Car, Plus, Search, Loader2, CheckCircle2, Settings2, BarChart3 } from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { VehicleCard } from './vehicles/VehicleCard';
import { VehicleFormModal } from './vehicles/VehicleFormModal';
import { QuotaAlertModal } from '../components/QuotaAlertModal';

export const VehiclesView = ({ orgData, setCurrentView }: any) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!orgData?.id) return;
    setLoading(true);
    try {
      const [vehRes, agRes, catRes, subRes] = await Promise.all([
        orgService.getVehiclesByOrg(orgData.id),
        orgService.getAgencies(orgData.id),
        orgService.getVehicleCategories(orgData.id),
        orgService.getSubscription(orgData.id)
      ]);
      if (vehRes.ok) setVehicles(vehRes.data || []);
      if (agRes.ok) setAgencies(agRes.data || []);
      if (catRes.ok) setCategories(catRes.data || []);
      if (subRes.ok) setSubscription(subRes.data);
    } finally { setLoading(false); }
  }, [orgData?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddClick = () => {
    const current = orgData?.currentVehicles || vehicles.length;
    const limit = subscription?.maxVehicles || 5; 
    if (current >= limit) setShowQuotaModal(true);
    else { setEditingVehicle(null); setIsModalOpen(true); }
  };

  const handleSubmit = async (formData: any) => {
    setModalLoading(true);
    try {
      const res = editingVehicle 
        ? await orgService.updateVehicle(editingVehicle.id, formData)
        : await orgService.createVehicle(orgData.id, formData);
      if (res.ok) { setIsModalOpen(false); loadData(); }
    } finally { setModalLoading(false); }
  };

  const filteredVehicles = useMemo(() => vehicles.filter(v => 
    `${v.brand} ${v.model} ${v.licencePlate}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [vehicles, searchTerm]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Véhicules totaux" value={vehicles.length} icon={<Car />} />
        <StatCard label="Disponibles" value={vehicles.filter(v => v.statut === 'AVAILABLE').length} icon={<CheckCircle2 className="text-green-500"/>} />
        <StatCard label="En maintenance" value={vehicles.filter(v => v.statut === 'MAINTENANCE').length} icon={<Settings2 className="text-orange-500"/>} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input placeholder="Rechercher marque, modèle, plaque..." className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0528d6]/20 font-medium dark:text-white transition-all" 
                 value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={handleAddClick} className="w-full md:w-auto px-6 py-3 bg-[#0528d6] text-white rounded-lg font-bold text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
          <Plus size={18} /> Ajouter un véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map(v => (
          <VehicleCard key={v.id} vehicle={v} 
                       agencyName={agencies.find(a => a.id === v.agencyId)?.name}
                       categoryName={categories.find(c => c.id === v.categoryId)?.name}
                       onEdit={(veh: any) => { setEditingVehicle(veh); setIsModalOpen(true); }}
                       onDelete={async (id: string) => { if(confirm('Supprimer de la flotte ?')) { await orgService.deleteVehicle(id); loadData(); } }} />
        ))}
      </div>

      {showQuotaModal && <QuotaAlertModal limit={subscription?.maxVehicles || 5} type="véhicules" onClose={() => setShowQuotaModal(false)} onUpgrade={() => setCurrentView('SUBSCRIPTION')} />}
      
      {isModalOpen && (
        <VehicleFormModal 
          editingVehicle={editingVehicle}
          agencies={agencies}
          categories={categories}
          initialData={editingVehicle || { brand: '', model: '', licencePlate: '', vinNumber: '', kilometrage: 0, places: 5, transmission: 'MANUAL', agencyId: '', categoryId: '', statut: 'AVAILABLE' }}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          modalLoading={modalLoading}
        />
      )}
    </div>
  );
};