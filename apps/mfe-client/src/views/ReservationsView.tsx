/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Loader2, 
  ArrowRight, 
  Info,
  Clock,
  Bell,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { rentalService } from '@shared-services/api/rental.service';
import ReservationDetail from './reservation/ReservationDetail';

export const MyReservationsView = ({ userData }: any) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRes, setSelectedRes] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, [userData]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await rentalService.getClientActiveReservations();
      setReservations(res.data || []);
    } catch (error) {
      console.error("Erreur chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReservation = async (res: any) => {
    setLoadingDetail(true);
    try {
      const response = await rentalService.getRentalDetails(res.id);
      setSelectedRes(response.data);
    } catch (error) {
      console.error("Erreur détail:", error);
      setSelectedRes({ rental: res });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Voulez-vous vraiment annuler cette demande ?")) return;
    setCancelling(true);
    try {
      await rentalService.cancelRental(id);
      setSelectedRes(null);
      await fetchReservations(); // Refresh la liste
    } catch (error) {
      console.error("Erreur annulation:", error);
      alert("Erreur lors de l'annulation");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr: any) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      console.error("Erreur formatage date:", e);
      return "Date non définie";
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#0528d6] size-10" />
      <p className="text-[10px] font-black  tracking-widest text-slate-400">Synchronisation...</p>
    </div>
  );

  const selectedId = selectedRes?.rental?.id;

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-700 pb-20 px-4">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6 mt-4">
        <div>
          <h2 className="text-3xl font-[900] tracking-tighter text-slate-900">
            Réservations <span className="text-[#0528d6]">{selectedRes ? 'Détails' : 'Actives'}</span>
          </h2>
          <p className="text-slate-400 text-xs font-medium italic mt-1">Gestion de vos demandes en cours.</p>
        </div>
        <div className="size-12 bg-blue-50 text-[#0528d6] rounded-2xl flex items-center justify-center shadow-sm">
          <Bell size={20}/>
        </div>
      </div>

      {/* Layout Master-Detail */}
      <div className={`grid gap-6 transition-all duration-500 ${selectedRes ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
        
        {/* COLONNE GAUCHE: Liste des cartes */}
        <div className={`${selectedRes ? "lg:col-span-4 space-y-3" : "grid gap-4 md:grid-cols-2 lg:grid-cols-2"}`}>
          {reservations.length > 0 ? (
            reservations.map((res: any) => (
              <div 
                key={res?.id} 
                onClick={() => handleSelectReservation(res)}
                className={`cursor-pointer group relative overflow-hidden transition-all duration-300 rounded-[2rem] border ${
                  selectedId === res.id 
                  ? "border-[#0528d6] bg-blue-50/50 ring-2 ring-[#0528d6]/10" 
                  : "bg-white border-slate-100 hover:border-blue-200 shadow-sm"
                } ${selectedRes ? "p-4" : "p-6"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl flex items-center justify-center transition-colors ${selectedId === res.id ? 'bg-[#0528d6] text-white' : 'bg-slate-900 text-white'} ${selectedRes ? 'size-10' : 'size-12'}`}>
                      <Car size={selectedRes ? 18 : 24} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400  tracking-widest leading-none">ID</p>
                      <p className="text-[11px] font-bold text-slate-900 tracking-tight">#{res?.id?.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black  tracking-widest border ${
                    res?.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {res?.status}
                  </div>
                </div>

                {!selectedRes && (
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[1.5rem] mb-4">
                    <div className="flex-1"><p className="text-[11px] font-bold">{formatDate(res?.startDate)}</p></div>
                    <ArrowRight className="text-slate-300" size={14} />
                    <div className="flex-1 text-right"><p className="text-[11px] font-bold">{formatDate(res?.endDate)}</p></div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className={`${selectedRes ? 'text-sm' : 'text-lg'} font-black text-slate-900 italic`}>
                    {res?.totalAmount?.toLocaleString()} <span className="text-[10px] opacity-40">XAF</span>
                  </p>
                  <ChevronRight size={16} className={`text-slate-300 transition-transform ${selectedId === res.id ? 'rotate-90 text-[#0528d6]' : ''}`} />
                </div>
              </div>
            ))
          ) : (
             <EmptyState />
          )}
        </div>

        {/* COLONNE DROITE: Détails détaillés */}
        {selectedRes && (
          <div className="lg:col-span-8 animate-in slide-in-from-right-4 duration-500">
            {loadingDetail ? (
              <div className="bg-white rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center border border-slate-100 shadow-xl">
                <Loader2 className="animate-spin text-[#0528d6] mb-4" size={30} />
                <p className="text-[10px] font-black  tracking-widest text-slate-400">Chargement du véhicule...</p>
              </div>
            ) : (
              <ReservationDetail
                data={selectedRes} 
                onClose={() => setSelectedRes(null)} 
                onCancel={handleCancel}
                cancelling={cancelling}
              />
            )}
          </div>
        )}
      </div>

      {!selectedRes && reservations.length > 0 && (
        <div className="p-6 bg-slate-900 rounded-[2.5rem] flex items-start gap-4 text-white/80 shadow-2xl">
          <Info className="text-blue-400 shrink-0" size={24} />
          <p className="text-[11px] leading-relaxed italic">
            Les réservations <span className="text-blue-400 font-bold underline italic">PENDING</span> sont en attente de confirmation par {" l'agence."} Nos agents vérifient la disponibilité du véhicule et du chauffeur.
          </p>
        </div>
      )}
    </div>
  );
};

// --- SOUS-COMPOSANTS INTERNES ---

const EmptyState = () => (
  <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm text-center col-span-full">
    <div className="size-24 bg-orange-50 text-orange-500 rounded-[2.8rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
      <Clock size={48} />
    </div>
    <h4 className="text-3xl font-black text-slate-900 italic  tracking-tighter">Silence radio...</h4>
    <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto italic mt-3 leading-relaxed">
      {"Vous n'avez aucune réservation active. Vos réservations s'afficheront ici."}
    </p>
    <button className="mt-10 bg-[#0528d6] text-white px-12 py-5 rounded-full font-black text-xs  tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
      Louer un véhicule
    </button>
  </div>
);