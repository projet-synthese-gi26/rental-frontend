/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Search, Loader2, Plus, Activity, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { rentalService, vehicleService, driverService, orgService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { BookingCard } from './bookings/BookingCard';
import { BookingFormModal } from './bookings/BookingFormModal';
import { RentalDetailsModal } from './rentals/RentalDetailsModal';
import { hasPermission } from '../utils/permissions';
import { Portal } from '../components/Portal';

export const ReservationsView = ({ userData, t, staffPermissions }: any) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeModal, setActiveModal] = useState<'FORM' | 'DETAILS' | 'CONFIRM' | null>(null);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const [resources, setResources] = useState({ vehicles: [] as any, drivers: [] as any});
  
  // État pour la popup de confirmation personnalisée
  const [confirmConfig, setConfirmConfig] = useState<{ rental: any; title: string; message: string } | null>(null);

  const loadData = useCallback(async () => {
    if (!userData?.agencyId) return;
    setLoading(true);
    try {
      const [res, orgRes] = await Promise.all([
        rentalService.getAgencyReservations(userData.agencyId),
        orgService.getOrgDetails(userData.organizationId)
      ]);
      if (res.ok) {
        setReservations((res.data || []).filter((r: any) => ['PENDING', 'RESERVED', 'PAID'].includes(r.status)));
      }
      if (orgRes.ok) setOrgInfo(orgRes.data);
    } finally { setLoading(false); }
  }, [userData]);

  useEffect(() => { loadData(); }, [loadData]);

  // --- LOGIQUE DE DÉMARRAGE (CASCADE API) ---
  const executeStartSequence = async (rental: any) => {
    const remaining = rental.totalAmount - rental.amountPaid;
    const isFullPaid = rental.status === 'PAID';

    setActionLoading(rental.id);
    setActiveModal(null); // Ferme la popup de confirmation
    
    try {
      // 1. Enregistrement du solde Cash si nécessaire
      if (!isFullPaid && remaining > 0) {
        const payRes = await rentalService.payRental(rental.id, { amount: remaining, method: 'CASH' });
        if (!payRes.ok) throw new Error(payRes.data?.message);
      }

      // 2. Démarrage de la location
      const startRes = await rentalService.startRental(rental.id);
      if (startRes.ok) {
          await loadData();
      } else {
          throw new Error(startRes.data?.message);
      }
    } catch (e: any) {
      alert(e.message || t.reservations.errorProcess);
    } finally {
      setActionLoading(null);
      setConfirmConfig(null);
    }
  };

  // --- OUVERTURE DE LA CONFIRMATION ---
  const handleStartRequest = (rental: any) => {
    const isFullPaid = rental.status === 'PAID';
    const remaining = rental.totalAmount - rental.amountPaid;

    setConfirmConfig({
        rental,
        title: t.reservations.confirmStartTitle,
        message: isFullPaid 
            ? t.reservations.confirmHandover 
            : t.reservations.confirmCashDesc.replace('{{amount}}', remaining.toLocaleString())
    });
    setActiveModal('CONFIRM');
  };

  const filtered = reservations.filter(r => 
    r.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.licencePlate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && reservations.length === 0) return <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14]"><Loader2 className="animate-spin text-[#0528d6] size-12" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 text-left relative">
      
      {/* OVERLAY CHARGEMENT CASCADE */}
      {actionLoading && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
              <div className="bg-white dark:bg-[#1a1d2d] p-10 rounded-[3rem] shadow-2xl text-center border border-white/20">
                  <Loader2 className="animate-spin text-[#0528d6] size-14 mx-auto mb-6" />
                  <h3 className="font-black uppercase italic text-slate-800 dark:text-white tracking-widest leading-none">{t.reservations.processing}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mt-3 italic">{t.reservations.stepPay} & {t.reservations.stepStart}</p>
              </div>
          </div>
      )}

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label={t.sidebar.reservations} value={reservations.length} icon={<Calendar className="text-[#0528d6]"/>} />
        <StatCard label={t.rentals.confirmedLabel} value={reservations.filter(r => r.status === 'RESERVED').length} icon={<Activity className="text-orange-500"/>} />
        <StatCard label={t.sidebar.status} value={reservations.filter(r => r.status === 'PAID').length} icon={<CheckCircle2 className="text-green-500"/>} />
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-[#1a1d2d] p-4 md:p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full text-left">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input placeholder={t.header.search} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-black italic outline-none focus:ring-2 focus:ring-[#0528d6]/20 dark:text-white transition-all shadow-inner uppercase tracking-tighter" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {hasPermission(userData, staffPermissions, 'rental:create') && (
            <button onClick={async () => {
                const [vRes, dRes] = await Promise.all([vehicleService.getVehiclesByAgency(userData.agencyId), driverService.getDriversByAgency(userData.agencyId)]);
                setResources({ vehicles: vRes.data?.filter((v:any) => v.statut === 'AVAILABLE') || [], drivers: dRes.data || [] });
                setActiveModal('FORM');
            }} className="w-full md:w-auto px-8 py-3.5 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 italic tracking-widest">
                <Plus size={16}/> {t.reservations.create}
            </button>
          )}
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filtered.map(r => (
          <BookingCard 
            key={r.id} 
            rental={r} 
            userData={userData} 
            t={t}
            staffPermissions={staffPermissions}
            onView={() => setSelectedRentalId(r.id)}
            onStart={() => handleStartRequest(r)}
          />
        ))}
      </div>

      {/* MODAL FORMULAIRE */}
      {activeModal === 'FORM' && (
        <BookingFormModal 
          mode="RESERVATION" 
          t={t} 
          vehicles={resources.vehicles} 
          drivers={resources.drivers} 
          isDriverRequired={orgInfo?.isDriverBookingRequired} 
          onClose={() => setActiveModal(null)} 
          onSubmit={(d:any) => rentalService.createAgencyRental(userData.agencyId, d).then(() => { setActiveModal(null); loadData(); })} 
          loading={false} 
        />
      )}

      {/* MODAL CONFIRMATION PERSONNALISÉ */}
      {activeModal === 'CONFIRM' && confirmConfig && (
          <ConfirmationModal 
            title={confirmConfig.title}
            message={confirmConfig.message}
            onConfirm={() => executeStartSequence(confirmConfig.rental)}
            onCancel={() => { setActiveModal(null); setConfirmConfig(null); }}
            t={t}
          />
      )}

      {selectedRentalId && <RentalDetailsModal t={t} rentalId={selectedRentalId} onClose={() => setSelectedRentalId(null)} />}
    </div>
  );
};

// --- SOUS-COMPOSANT : MODAL DE CONFIRMATION ---
const ConfirmationModal = ({ title, message, onConfirm, onCancel, t }: any) => (
    <Portal>
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={onCancel} />
            <div className="relative w-full max-w-md bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in text-center p-10">
                <div className="size-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-[#0528d6] mx-auto mb-6 shadow-inner">
                    <AlertCircle size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-4 leading-tight">{title}</h3>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic mb-10 leading-relaxed uppercase">{message}</p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onConfirm}
                        className="w-full py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 italic tracking-widest"
                    >
                        <Check size={18}/> {t.common.confirm}
                    </button>
                    <button 
                        onClick={onCancel}
                        className="w-full py-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase italic tracking-widest hover:text-red-500 transition-colors"
                    >
                        {t.common.cancel}
                    </button>
                </div>
            </div>
        </div>
    </Portal>
);