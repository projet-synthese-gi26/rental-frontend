/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, Activity, Plus, CheckCircle2, History } from 'lucide-react';
import { rentalService, vehicleService, driverService, orgService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';
import { BookingFormModal } from './bookings/BookingFormModal';
import { RentalDetailsModal } from './rentals/RentalDetailsModal';
import { hasPermission } from '../utils/permissions';

export const RentalsView = ({ userData, t }: { userData: any, t: any }) => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<'FORM' | 'DETAILS' | null>(null);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const [resources, setResources] = useState({ vehicles: [], drivers: [] });

  const loadData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setLoading(true);
    try {
      const [res, orgRes] = await Promise.all([
        rentalService.getAgencyRentals(userData.agencyId),
        orgService.getOrgDetails(userData.organizationId)
      ]);
      if (res.ok) setRentals((res.data || []).filter((r: any) => ['ONGOING', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED'].includes(r.status)));
      if (orgRes.ok) setOrgInfo(orgRes.data);
    } finally { setLoading(false); }
  }, [userData]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateLocation = async (formData: any) => {
    const res = await rentalService.createAgencyRental(userData.agencyId, formData);
    if (res.ok && res.data.rentalId) {
      await rentalService.startRental(res.data.rentalId);
      setActiveModal(null);
      loadData();
    }
  };

  const filtered = rentals.filter(r => 
    `${r.clientName} ${r.licencePlate}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || r.status === statusFilter)
  );

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label={t.kpi.active} value={rentals.filter(r => r.status === 'ONGOING').length} icon={<Activity className="text-[#0528d6]"/>} />
        <StatCard label="Retours Attente" value={rentals.filter(r => r.status === 'UNDER_REVIEW').length} icon={<History className="text-orange-500"/>} />
        <StatCard label="Dossiers Clôturés" value={rentals.filter(r => r.status === 'COMPLETED').length} icon={<CheckCircle2 className="text-green-500"/>} />
      </div>

      <div className="bg-white dark:bg-[#1a1d2d] p-4 md:p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input placeholder={t.header.search} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm font-black italic border-none outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {hasPermission(userData, 'rental:create') && (
            <button onClick={async () => {
                const [vRes, dRes] = await Promise.all([vehicleService.getVehiclesByAgency(userData.agencyId), driverService.getDriversByAgency(userData.agencyId)]);
                setResources({ vehicles: vRes.data?.filter((v:any) => v.statut === 'AVAILABLE') || [], drivers: dRes.data || [] });
                setActiveModal('FORM');
            }} className="w-full md:w-auto px-8 py-3.5 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 italic tracking-widest">
                <Plus size={16}/> {t.table.add || "Nouveau"}
            </button>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {filtered.map(r => (
          <BookingCard key={r.id} rental={r} userData={userData} t={t}
            onView={() => setSelectedRentalId(r.id)}
            onValidate={['ONGOING', 'UNDER_REVIEW'].includes(r.status) ? () => { if(confirm("Valider retour ?")) rentalService.validateReturn(r.id).then(() => loadData()); } : undefined}
          />
        ))}
      </div>

      {activeModal === 'FORM' && <BookingFormModal mode="RENTAL" t={t} vehicles={resources.vehicles} drivers={resources.drivers} isDriverRequired={orgInfo?.isDriverBookingRequired} onClose={() => setActiveModal(null)} onSubmit={handleCreateLocation} loading={false} />}
      {selectedRentalId && <RentalDetailsModal t={t} rentalId={selectedRentalId} onClose={() => setSelectedRentalId(null)} />}
    </div>
  );
};