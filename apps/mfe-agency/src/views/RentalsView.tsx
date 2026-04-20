/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, Activity, Plus, CheckCircle2, History } from 'lucide-react';
import { rentalService, vehicleService, driverService, orgService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';
import { BookingFormModal } from './bookings/BookingFormModal';
import { RentalDetailsModal } from './rentals/RentalDetailsModal';

const ITEMS_PER_PAGE = 6;

export const RentalsView = ({ userData }: { userData: any }) => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
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

  // LOGIQUE CRUCIALE : Création -> Lancement opérationnel immédiat
  const handleCreateLocation = async (formData: any) => {
    try {
      const res = await rentalService.createAgencyRental(userData.agencyId, formData);
      if (res.ok && res.data.rentalId) {
        // Pour une location directe, l'agence effectue le handover immédiatement
        await rentalService.startRental(res.data.rentalId);
        setActiveModal(null);
        loadData();
      }
    } catch (e) { alert("Erreur création"); }
  };

  const filtered = useMemo(() => {
    return rentals.filter(r => {
      const matchSearch = `${r.clientName} ${r.id} ${r.licencePlate}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchDates = (!dateRange.start || new Date(r.startDate) >= new Date(dateRange.start)) &&
                         (!dateRange.end || new Date(r.startDate) <= new Date(dateRange.end));
      return matchSearch && matchStatus && matchDates;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [rentals, searchTerm, statusFilter, dateRange]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <StatCard label="En Circulation" value={rentals.filter(r => r.status === 'ONGOING').length} icon={<Activity className="text-[#0528d6]"/>} />
        <StatCard label="Retours Attente" value={rentals.filter(r => r.status === 'UNDER_REVIEW').length} icon={<History className="text-orange-500"/>} />
        <StatCard label="Total Clôturées" value={rentals.filter(r => r.status === 'COMPLETED').length} icon={<CheckCircle2 className="text-green-500"/>} />
      </div>

      <div className="bg-white dark:bg-[#1a1d2d] p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full text-left">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input placeholder="Chercher plaque, client, ID..." className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full lg:w-48 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-black uppercase tracking-tighter border-none outline-none focus:ring-2 focus:ring-[#0528d6]/20">
                <option value="ALL">Tous Statuts</option>
                <option value="ONGOING">En cours</option>
                <option value="UNDER_REVIEW">Attente Retour</option>
                <option value="COMPLETED">Terminé</option>
            </select>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 items-center border-t border-slate-50 dark:border-slate-800 pt-4 text-left">
              <div className="flex items-center gap-2 w-full lg:w-auto">
                  <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Du</span>
                  <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[11px] font-bold outline-none"/>
                  <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Au</span>
                  <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[11px] font-bold outline-none"/>
              </div>
              <button onClick={async () => {
                  const [vRes, dRes] = await Promise.all([vehicleService.getVehiclesByAgency(userData.agencyId), driverService.getDriversByAgency(userData.agencyId)]);
                  setResources({ vehicles: vRes.data?.filter((v:any) => v.statut === 'AVAILABLE') || [], drivers: dRes.data || [] });
                  setActiveModal('FORM');
              }} className="ml-auto w-full lg:w-auto px-8 py-3 bg-[#0528d6] text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 italic tracking-widest">
                  <Plus size={16}/> Nouvelle Location (100%)
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginated.map(r => (
          <BookingCard key={r.id} rental={r} 
            onView={() => setSelectedRentalId(r.id)}
            onValidate={['ONGOING', 'UNDER_REVIEW'].includes(r.status) ? () => { if(confirm("Valider retour ?")) rentalService.validateReturn(r.id).then(() => loadData()); } : undefined}
          />
        ))}
      </div>

      {activeModal === 'FORM' && <BookingFormModal mode="RENTAL" vehicles={resources.vehicles} drivers={resources.drivers} isDriverRequired={orgInfo?.isDriverBookingRequired} onClose={() => setActiveModal(null)} onSubmit={handleCreateLocation} loading={false} />}
      {selectedRentalId && <RentalDetailsModal rentalId={selectedRentalId} onClose={() => setSelectedRentalId(null)} />}
    </div>
  );
};