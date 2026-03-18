// FILE: apps/mfe-organisation/src/views/ReservationsView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Zap, Calendar, Search, Loader2, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { rentalService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { RentalCard } from './rentals/RentalCard';
import { RentalDetailsModal } from './rentals/RentalDetailsModal';

const ITEMS_PER_PAGE = 6;

export const ReservationsView = ({ orgData }: { orgData: any }) => {
  const[reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const[searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRental, setSelectedRental] = useState<any>(null);

  const loadData = useCallback(async () => {
    if (!orgData?.id) return;
    setLoading(true);
    try {
      const res = await rentalService.getOrgReservations(orgData.id);
      if (res.ok) setReservations(res.data ||[]);
    } finally { setLoading(false); }
  }, [orgData?.id]);

  useEffect(() => { loadData(); }, [loadData]);

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
        <StatCard label="En Attente (PENDING)" value={reservations.filter(r => r.status === 'PENDING').length} icon={<Activity className="text-orange-500"/>} />
        <StatCard label="Payées (PAID)" value={reservations.filter(r => r.status === 'PAID').length} icon={<Calendar className="text-green-500"/>} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input placeholder="Rechercher une réservation par nom ou ID..." className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-black italic outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all dark:text-white" 
                 value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginated.map(rental => (
          <RentalCard key={rental.id} rental={rental} onView={setSelectedRental} />
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

      {selectedRental && <RentalDetailsModal rental={selectedRental} onClose={() => setSelectedRental(null)} />}
    </div>
  );
};