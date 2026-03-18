// FILE: apps/mfe-agency/src/views/RentalsView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, Activity, CheckCircle2, History } from 'lucide-react';
import { rentalService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';
import { hasPermission } from '../utils/permissions';

const ITEMS_PER_PAGE = 6;

export const RentalsView = ({ userData }: { userData: any }) => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setLoading(true);
    try {
      const res = await rentalService.getAgencyRentals(userData.agencyId);
      if (res.ok) {
        // ONGOING, UNDER_REVIEW, COMPLETED, CANCELLED
        setRentals((res.data || []).filter((r: any) =>['ONGOING', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED'].includes(r.status)));
      }
    } finally { setLoading(false); }
  }, [userData?.agencyId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleValidateReturn = async (id: string) => {
    if (window.confirm("Confirmer la restitution du véhicule ?")) {
      await rentalService.validateReturn(id);
      loadData();
    }
  };

  const filtered = useMemo(() => rentals.filter(r => 
    `${r.clientName} ${r.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [rentals, searchTerm]);

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Historique Locations" value={rentals.length} icon={<History />} />
        <StatCard label="En Circulation" value={rentals.filter(r => r.status === 'ONGOING' || r.status === 'UNDER_REVIEW').length} icon={<Activity className="text-blue-500"/>} />
        <StatCard label="Terminées" value={rentals.filter(r => r.status === 'COMPLETED').length} icon={<CheckCircle2 className="text-green-500" />} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input placeholder="Rechercher par nom ou ID..." className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-black italic outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all dark:text-white" 
                 value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginated.map(rental => (
          <BookingCard 
            key={rental.id} 
            rental={rental} 
            onValidate={['ONGOING', 'UNDER_REVIEW'].includes(rental.status) && hasPermission(userData, 'rental:validate_return') ? () => handleValidateReturn(rental.id) : undefined}
          />
        ))}
        {paginated.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-[#1a1d2d] rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                <Activity className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-black  italic tracking-widest">Aucune location en cours</p>
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
    </div>
  );
};