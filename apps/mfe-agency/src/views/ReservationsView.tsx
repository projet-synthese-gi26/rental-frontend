/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Zap, Calendar, Search, Loader2, Plus, Activity } from 'lucide-react';
import { rentalService, vehicleService, driverService, orgService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';
import { BookingFormModal } from './bookings/BookingFormModal';
import { RentalDetailsModal } from './rentals/RentalDetailsModal';
import { hasPermission } from '../utils/permissions';

export const ReservationsView = ({ userData, t }: any) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filtered = reservations.filter(r => r.clientName?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label={t.sidebar.reservations} value={reservations.length} icon={<Zap className="text-[#0528d6]"/>} />
        <StatCard label="Confirmées (60%)" value={reservations.filter(r => r.status === 'RESERVED').length} icon={<Activity className="text-orange-500"/>} />
        <StatCard label={t.sidebar.status} value={reservations.filter(r => r.status === 'PAID').length} icon={<Calendar className="text-green-500"/>} />
      </div>

      <div className="bg-white dark:bg-[#1a1d2d] p-4 md:p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input placeholder={t.header.search} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm font-black italic border-none outline-none focus:ring-2 focus:ring-[#0528d6]/20 dark:text-white transition-all italic" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {hasPermission(userData, 'rental:create') && (
            <button onClick={async () => {
                const [vRes, dRes] = await Promise.all([vehicleService.getVehiclesByAgency(userData.agencyId), driverService.getDriversByAgency(userData.agencyId)]);
                setResources({ vehicles: vRes.data?.filter((v:any) => v.statut === 'AVAILABLE') || [], drivers: dRes.data || [] });
                setActiveModal('FORM');
            }} className="w-full md:w-auto px-8 py-3.5 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl italic tracking-widest">
                <Plus size={16}/> {t.sidebar.reservations.substring(0,8)}
            </button>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filtered.map(r => (
          <BookingCard key={r.id} rental={r} userData={userData} t={t}
            onView={() => setSelectedRentalId(r.id)}
            onStart={r.status === 'PAID' ? () => { if(confirm(t.table.handover)) rentalService.startRental(r.id).then(() => loadData()); } : undefined}
          />
        ))}
      </div>

      {activeModal === 'FORM' && <BookingFormModal mode="RESERVATION" t={t} vehicles={resources.vehicles} drivers={resources.drivers} isDriverRequired={orgInfo?.isDriverBookingRequired} onClose={() => setActiveModal(null)} onSubmit={(d:any) => rentalService.createAgencyRental(userData.agencyId, d).then(() => { setActiveModal(null); loadData(); })} loading={false} />}
      {selectedRentalId && <RentalDetailsModal t={t} rentalId={selectedRentalId} onClose={() => setSelectedRentalId(null)} />}
    </div>
  );
};