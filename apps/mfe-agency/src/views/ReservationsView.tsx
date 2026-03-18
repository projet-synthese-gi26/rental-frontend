// FILE: apps/mfe-agency/src/views/ReservationsView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Zap, Calendar, Search, Loader2, ChevronLeft, ChevronRight, Activity, Plus } from 'lucide-react';
import { rentalService, vehicleService, driverService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';
import { BookingFormModal } from './bookings/BookingFormModal';
import { PaymentModal } from './bookings/PaymentModal';
import { hasPermission } from '../utils/permissions';

const ITEMS_PER_PAGE = 6;

export const ReservationsView = ({ userData }: { userData: any }) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const[loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const[currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paymentRental, setPaymentRental] = useState<any>(null);
  const[actionLoading, setActionLoading] = useState(false);

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setLoading(true);
    try {
      const res = await rentalService.getAgencyReservations(userData.agencyId);
      if (res.ok) {
        // PENDING, RESERVED, PAID
        setReservations((res.data ||[]).filter((r: any) => ['PENDING', 'RESERVED', 'PAID'].includes(r.status)));
      }
    } finally { setLoading(false); }
  }, [userData?.agencyId]);

  useEffect(() => { loadData(); }, [loadData]);

  const loadResources = async () => {
    const [vRes, dRes] = await Promise.all([
      vehicleService.getVehiclesByAgency(userData.agencyId),
      driverService.getDriversByAgency(userData.agencyId)
    ]);
    if (vRes.ok) setVehicles(vRes.data.filter((v:any) => v.statut === 'AVAILABLE'));
    if (dRes.ok) setDrivers(dRes.data.filter((d:any) => d.status === 'ACTIVE'));
  };

  const handleCreateWalkIn = async (data: any) => {
    setActionLoading(true);
    try {
      const res = await rentalService.initiateRental(data);
      if (res.ok) {
        setIsFormOpen(false);
        loadData();
      } else alert(res.data?.message || 'Erreur lors de la création.');
    } finally { setActionLoading(false); }
  };

  const handlePayment = async (amount: number, method: string) => {
    if (!paymentRental) return;
    setActionLoading(true);
    try {
      const res = await rentalService.payRental(paymentRental.id, { amount, method: method as any });
      if (res.ok) {
        setPaymentRental(null);
        loadData();
      } else alert('Erreur de paiement');
    } finally { setActionLoading(false); }
  };

  const handleStart = async (id: string) => {
    await rentalService.startRental(id);
    loadData();
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Annuler cette réservation ?")) {
      await rentalService.cancelRental(id);
      loadData();
    }
  };

  const filtered = useMemo(() => reservations.filter(r => 
    `${r.clientName} ${r.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [reservations, searchTerm]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Réservations Actives" value={reservations.length} icon={<Zap />} />
        <StatCard label="En Attente Paiement" value={reservations.filter(r => r.status === 'PENDING' || r.status === 'RESERVED').length} icon={<Activity className="text-orange-500"/>} />
        <StatCard label="Prêtes au Départ" value={reservations.filter(r => r.status === 'PAID').length} icon={<Calendar className="text-green-500"/>} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input placeholder="Rechercher par nom ou ID..." className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-black italic outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all dark:text-white" 
                 value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
        </div>
        {hasPermission(userData, 'rental:create') && (
          <button onClick={() => { loadResources(); setIsFormOpen(true); }} className="w-full md:w-auto px-6 py-3 bg-[#0528d6] text-white rounded-xl font-black text-xs  shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all italic">
            <Plus size={18} /> Walk-in (Comptoir)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginated.map(rental => (
          <BookingCard 
            key={rental.id} 
            rental={rental} 
            onPay={['PENDING', 'RESERVED'].includes(rental.status) ? () => setPaymentRental(rental) : undefined}
            onStart={rental.status === 'PAID' && hasPermission(userData, 'rental:start') ? () => handleStart(rental.id) : undefined}
            onCancel={hasPermission(userData, 'rental:cancel') ? () => handleCancel(rental.id) : undefined}
          />
        ))}
        {paginated.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-[#1a1d2d] rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-black  italic tracking-widest">Aucune réservation trouvée</p>
            </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 shadow-sm transition-all"><ChevronLeft size={18}/></button>
          <span className="text-[10px] font-black text-slate-500  italic px-4 tracking-widest">Page {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 shadow-sm transition-all"><ChevronRight size={18}/></button>
        </div>
      )}

      {isFormOpen && <BookingFormModal vehicles={vehicles} drivers={drivers} onClose={() => setIsFormOpen(false)} onSubmit={handleCreateWalkIn} loading={actionLoading} />}
      {paymentRental && <PaymentModal rental={paymentRental} onClose={() => setPaymentRental(null)} onSubmit={handlePayment} loading={actionLoading} />}
    </div>
  );
};