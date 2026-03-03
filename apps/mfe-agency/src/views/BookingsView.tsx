/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { rentalService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';

export const BookingsView = ({ userData }: { userData: any }) => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setLoading(true);
    try {
      const res = await rentalService.getAgencyRentals(userData.agencyId);
      if (res.ok) setRentals(res.data || []);
    } finally {
      setLoading(false);
    }
  }, [userData?.agencyId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAction = async (id: string, action: string) => {
    if (action === 'START') await rentalService.startRental(id);
    else await rentalService.validateReturn(id);
    loadData();
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Dossiers Actifs" value={rentals.filter(r => r.status !== 'COMPLETED').length} icon={<Calendar />} />
        <StatCard label="En Circulation" value={rentals.filter(r => r.status === 'ONGOING').length} icon={<Clock className="text-[#0528d6]"/>} />
        <StatCard label="Total Revenus" value={`${rentals.reduce((acc, r) => acc + (r.amountPaid || 0), 0).toLocaleString()} XAF`} icon={<CheckCircle2 className="text-green-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {rentals.length === 0 ? (
          <div className="col-span-full p-20 bg-white dark:bg-[#1a1d2d] rounded-[3rem] text-center border-2 border-dashed border-slate-100">
             <p className="text-slate-400 font-bold uppercase italic">Aucune réservation détectée pour cette agence</p>
          </div>
        ) : (
          rentals.map(rental => (
            <BookingCard 
              key={rental.id} 
              rental={rental} 
              onStart={() => handleAction(rental.id, 'START')}
              onValidate={() => handleAction(rental.id, 'VALIDATE')}
            />
          ))
        )}
      </div>
    </div>
  );
};