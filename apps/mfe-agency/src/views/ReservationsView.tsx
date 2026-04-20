/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Zap, Calendar, Search, Loader2, ChevronLeft, ChevronRight, Activity, Plus } from 'lucide-react';
import { rentalService, vehicleService, driverService, orgService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';
import { BookingFormModal } from './bookings/BookingFormModal';
import { RentalDetailsModal } from './rentals/RentalDetailsModal';

const ITEMS_PER_PAGE = 6;

export const ReservationsView = ({ userData }: { userData: any }) => {
  const [reservations, setReservations] = useState<any[]>([]);
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
        rentalService.getAgencyReservations(userData.agencyId),
        orgService.getOrgDetails(userData.organizationId)
      ]);
      if (res.ok) setReservations((res.data || []).filter((r: any) => ['PENDING', 'RESERVED', 'PAID'].includes(r.status)));
      if (orgRes.ok) setOrgInfo(orgRes.data);
    } finally { setLoading(false); }
  }, [userData]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (formData: any) => {
    try {
      const res = await rentalService.createAgencyRental(userData.agencyId, formData);
      if (res.ok) { setActiveModal(null); loadData(); }
    } catch (e) { alert("Erreur serveur"); }
  };

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      const matchSearch = `${r.clientName} ${r.id}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchDates = (!dateRange.start || new Date(r.startDate) >= new Date(dateRange.start)) &&
                         (!dateRange.end || new Date(r.startDate) <= new Date(dateRange.end));
      return matchSearch && matchStatus && matchDates;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reservations, searchTerm, statusFilter, dateRange]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <StatCard label="Dossiers Réservés" value={reservations.length} icon={<Zap className="text-[#0528d6]"/>} />
        <StatCard label="Acomptes (60%)" value={reservations.filter(r => r.status === 'RESERVED').length} icon={<Activity className="text-orange-500"/>} />
        <StatCard label="Prêts Départ" value={reservations.filter(r => r.status === 'PAID').length} icon={<Calendar className="text-green-500"/>} />
      </div>

      <div className="bg-white dark:bg-[#1a1d2d] p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full text-left">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input placeholder="Rechercher client..." className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full lg:w-48 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-black uppercase tracking-tighter border-none outline-none focus:ring-2 focus:ring-[#0528d6]/20">
                <option value="ALL">Tous Statuts</option>
                <option value="RESERVED">Réservé (Acompte)</option>
                <option value="PAID">Payé (Total)</option>
            </select>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 items-center border-t border-slate-50 dark:border-slate-800 pt-4 text-left">
              <div className="flex items-center gap-2 w-full lg:w-auto">
                  <span className="text-[10px] font-black uppercase text-slate-400">Période du</span>
                  <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[11px] font-bold outline-none"/>
                  <span className="text-[10px] font-black uppercase text-slate-400">au</span>
                  <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[11px] font-bold outline-none"/>
              </div>
              <button onClick={async () => {
                  const [vRes, dRes] = await Promise.all([vehicleService.getVehiclesByAgency(userData.agencyId), driverService.getDriversByAgency(userData.agencyId)]);
                  setResources({ vehicles: vRes.data?.filter((v:any) => v.statut === 'AVAILABLE') || [], drivers: dRes.data || [] });
                  setActiveModal('FORM');
              }} className="ml-auto w-full lg:w-auto px-8 py-3 bg-[#0528d6] text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 italic">
                  <Plus size={16}/> Créer Réservation (60%)
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginated.map(r => (
          <BookingCard key={r.id} rental={r} 
            onView={() => setSelectedRentalId(r.id)}
            onStart={r.status === 'PAID' ? () => { if(confirm("Remettre les clés ?")) rentalService.startRental(r.id).then(() => loadData()); } : undefined}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8 text-left">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 rounded-2xl flex items-center justify-center disabled:opacity-30"><ChevronLeft/></button>
          <span className="text-[10px] font-black text-[#0528d6] uppercase italic px-6 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 shadow-inner">Page {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 rounded-2xl flex items-center justify-center disabled:opacity-30"><ChevronRight/></button>
        </div>
      )}

      {activeModal === 'FORM' && <BookingFormModal mode="RESERVATION" vehicles={resources.vehicles} drivers={resources.drivers} isDriverRequired={orgInfo?.isDriverBookingRequired} onClose={() => setActiveModal(null)} onSubmit={handleCreate} loading={false} />}
      {selectedRentalId && <RentalDetailsModal rentalId={selectedRentalId} onClose={() => setSelectedRentalId(null)} />}
    </div>
  );
};