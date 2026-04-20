/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Car, Plus, Search, Loader2, CheckCircle2, Settings2 } from 'lucide-react';
import { vehicleService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { VehicleCard } from './vehicles/VehicleCard';
import { VehicleFormModal } from './vehicles/VehicleFormModal';
import { ResourceDetailsModal } from './vehicles/ResourceDetailsModal';

export const VehiclesView = ({ userData }: { userData: any }) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const[categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const[modalLoading, setModalLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // État pour le modal de détails
  const[viewingVehicleId, setViewingVehicleId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setLoading(true);
    try {
      const [vehRes, catRes] = await Promise.all([
        vehicleService.getVehiclesByAgency(userData.agencyId),
        vehicleService.getVehicleCategories(userData.organizationId)
      ]);
      if (vehRes.ok) setVehicles(vehRes.data ||[]);
      if (catRes.ok) setCategories(catRes.data ||[]);
    } finally {
      setLoading(false);
    }
  }, [userData?.agencyId, userData?.organizationId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (formData: any) => {
    setModalLoading(true);
    setBackendError(null);
    try {
      // Formatage strict pour le backend (Nombres, ISO Dates et Injection Agency)
      const payload = {
        ...formData,
        agencyId: userData.agencyId, // Forcé côté agence
        kilometrage: Number(formData.kilometrage || 0),
        places: Number(formData.places || 5),
        engineDetails: {
          ...formData.engineDetails,
          horsepower: Number(formData.engineDetails?.horsepower || 0),
          capacity: Number(formData.engineDetails?.capacity || 0)
        },
        yearProduction: formData.yearProduction ? new Date(formData.yearProduction).toISOString() : new Date().toISOString(),
        insuranceDetails: {
          ...formData.insuranceDetails,
          expiry: formData.insuranceDetails?.expiry ? new Date(formData.insuranceDetails.expiry).toISOString() : new Date().toISOString()
        }
      };

      const res = editingVehicle 
        ? await vehicleService.updateVehicle(editingVehicle.id, payload)
        : await vehicleService.createVehicle(userData.organizationId, payload);
      
      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      } else {
        setBackendError(res.data?.message || "Une erreur est survenue lors de l'enregistrement.");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleQuickStatus = async (id: string, status: string) => {
    const res = await vehicleService.updateVehicleStatus(id, status);
    if (res.ok) loadData();
  };

  const filteredVehicles = useMemo(() => vehicles.filter(v => 
    `${v.brand} ${v.model} ${v.licencePlate}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [vehicles, searchTerm]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Agence" value={vehicles.length} icon={<Car />} />
        <StatCard label="Opérationnels" value={vehicles.filter(v => v.statut === 'AVAILABLE').length} icon={<CheckCircle2 className="text-green-500"/>} />
        <StatCard label="En maintenance" value={vehicles.filter(v => v.statut === 'MAINTENANCE').length} icon={<Settings2 className="text-orange-500"/>} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input 
            placeholder="Rechercher marque, plaque..." 
            className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0528d6]/20 font-medium dark:text-white transition-all"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingVehicle(null); setBackendError(null); setIsModalOpen(true); }}
          className="w-full md:w-auto px-6 py-3 bg-[#0528d6] text-white rounded-lg font-bold text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Ajouter véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map(v => (
          <VehicleCard 
            key={v.id} 
            vehicle={v} 
            categoryName={categories.find(c => c.id === v.categoryId)?.name}
            onEdit={(veh: any) => { setEditingVehicle(veh); setBackendError(null); setIsModalOpen(true); }}
            onDelete={async (id: string) => { if(confirm('Retirer ce véhicule de l\'inventaire ?')) { await vehicleService.deleteVehicle(id); loadData(); } }}
            onStatusUpdate={handleQuickStatus}
            onViewDetails={(veh: any) => setViewingVehicleId(veh.id)}
          />
        ))}
      </div>

      {/* MODAL DE CRÉATION/ÉDITION */}
      {isModalOpen && (
        <VehicleFormModal 
          editingVehicle={editingVehicle}
          categories={categories}
          initialData={editingVehicle ? {
            ...editingVehicle,
            yearProduction: editingVehicle.yearProduction ? editingVehicle.yearProduction.split('T')[0] : '',
            engineDetails: editingVehicle.engineDetails || { type: '', horsepower: 0, capacity: 0 },
            insuranceDetails: editingVehicle.insuranceDetails ? {
              ...editingVehicle.insuranceDetails,
              expiry: editingVehicle.insuranceDetails.expiry ? editingVehicle.insuranceDetails.expiry.split('T')[0] : ''
            } : { provider: '', policy_number: '', expiry: '' },
            fuelEfficiency: editingVehicle.fuelEfficiency || { city: '', highway: '' },
            functionalities: editingVehicle.functionalities || {},
            images: editingVehicle.images ||[],
            description: editingVehicle.description ||[]
          } : { 
            brand: '', model: '', licencePlate: '', vinNumber: '', kilometrage: 0, places: 5, color: '', transmission: 'MANUAL', categoryId: '', statut: 'AVAILABLE',
            yearProduction: '',
            engineDetails: { type: '', horsepower: 0, capacity: 0 },
            insuranceDetails: { provider: '', policy_number: '', expiry: '' },
            fuelEfficiency: { city: '', highway: '' },
            functionalities: { air_condition: true, gps: true, bluetooth: true, luggage: true, onboard_computer: true },
            images: [], description:[]
          }}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          modalLoading={modalLoading}
          error={backendError}
        />
      )}

      {/* MODAL DE DÉTAILS / PLANNING */}
      {viewingVehicleId && (
        <ResourceDetailsModal 
          resourceId={viewingVehicleId}
          type="VEHICLE"
          onClose={() => setViewingVehicleId(null)}
        />
      )}
    </div>
  );
};