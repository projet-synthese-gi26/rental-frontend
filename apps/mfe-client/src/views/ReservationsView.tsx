/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Car, 
  User as UserIcon, 
  Loader2, 
  ArrowRight, 
  Info,
  Clock,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { rentalService } from '@shared-services/api/rental.service';

export const MyReservationsView = ({ userData }: any) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await rentalService.getClientActiveReservations();
        setReservations(res.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
        setLoading(false);
      }
    };
    fetchReservations();
  }, [userData]);

  // Formatteur de date sécurisé
  const formatDate = (dateStr: any) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return "Date non définie";
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#0528d6] size-10" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronisation...</p>
    </div>
  );

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 text-left">
      
      {/* Header Style "Easy Rental" */}
      <div className="flex justify-between items-center border-b pb-6 mt-4">
        <div>
          <h2 className="text-3xl font-[900] italic tracking-tighter uppercase text-slate-900 leading-none">
            Réservations <span className="text-[#0528d6]">Actives</span>
          </h2>
          <p className="text-slate-400 text-xs font-medium mt-2 italic">Vos demandes en attente de validation agence.</p>
        </div>
        <div className="size-12 bg-blue-50 text-[#0528d6] rounded-2xl flex items-center justify-center shadow-sm">
          <Bell size={20}/>
        </div>
      </div>

      <div className="grid gap-3">
        {reservations && reservations.length > 0 ? (
          reservations.map((res: any) => (
            <div 
              key={res?.id} 
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group transition-all"
            >
              <div className="px-8 py-3">
                {/* Ligne 1: En-tête de carte */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="size-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                      <Car size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ID Réservation</p>
                      <p className="text-sm font-bold text-slate-900 tracking-tight">#{res?.id?.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    res?.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {res?.status || 'STATUT INCONNU'}
                  </div>
                </div>

                {/* Ligne 2: Dates */}
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[1.8rem] mb-6">
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date de début</p>
                    <p className="text-sm font-bold text-slate-800">{formatDate(res?.startDate)}</p>
                  </div>
                  <ArrowRight className="text-slate-300" size={18} />
                  <div className="flex-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date de fin</p>
                    <p className="text-sm font-bold text-slate-800">{formatDate(res?.endDate)}</p>
                  </div>
                </div>

                {/* Ligne 3: Récapitulatif financier */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-100 rounded-[1.5rem]">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 italic">Total à payer</p>
                    <p className="text-xl font-black text-slate-900">
                      {res?.totalAmount?.toLocaleString() || 0} <span className="text-[10px] text-slate-400">XAF</span>
                    </p>
                  </div>
                  <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-lg shadow-blue-100">
                    <p className="text-[9px] font-black opacity-80 uppercase mb-1 italic">Acompte versé</p>
                    <p className="text-xl font-black">
                      {res?.amountPaid?.toLocaleString() || 0} <span className="text-[10px]">XAF</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Barre de détails basse */}
              <div className="bg-slate-50 p-4 px-8 flex justify-between items-center border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <UserIcon size={14} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {res?.driverId ? "Avec Chauffeur" : "Véhicule uniquement"}
                  </span>
                </div>
                <button className="text-[10px] font-black text-red-500 uppercase hover:text-red-700 transition-colors">
                  Annuler la demande
                </button>
              </div>
            </div>
          ))
        ) : (
          /* State si aucune réservation */
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm text-center">
              <div className="size-20 bg-orange-50 text-orange-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Clock size={40} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Silence radio...</h4>
              <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto italic mt-2">
                  {"Vous n'avez aucune réservation active pour le moment."}
              </p>
              <button className="mt-8 bg-[#0528d6] text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-blue-200 transition-all">
                Lancer une recherche
              </button>
          </div>
        )}
      </div>

      {/* Info contextuelle */}
      {reservations && reservations.length > 0 ? (<div className="p-5 bg-slate-900 rounded-[2rem] flex items-start gap-4 text-white/80">
        <Info className="text-blue-400 shrink-0" size={20} />
        <p className="text-[11px] leading-relaxed italic">
          Les réservations <span className="text-blue-400 font-bold underline italic">PENDING</span> {"sont en attente de confirmation par l'agence. Vous recevrez une notification par SMS ou via l'application une fois validées."}
        </p>
      </div>):(<p></p>)}

    </div>
  );
};