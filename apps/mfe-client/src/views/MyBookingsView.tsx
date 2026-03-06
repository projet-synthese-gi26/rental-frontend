// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import React, { useState, useEffect } from 'react';
// // import { rentalService } from '@pwa-easy-rental/shared-services';
// import { Clock, Bell, Loader2 } from 'lucide-react';

// export const MyBookingsView = ({ userData }: { userData: any }) => {
//   // const [rentals, setRentals] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRentals = async () => {
//       // Pour l'instant, on récupère via les notifications ou un endpoint dédié
//       // Note: Le Swagger n'expose pas de /rentals/client/{id}, on utilise le mock filtré si besoin
//       setLoading(false);
//     };
//     fetchRentals();
//   }, [userData]);

//   // const handleSignalEnd = async (id: string) => {
//   //   if (confirm("Signaler la restitution du véhicule à l'agence ?")) {
//   //     const res = await rentalService.signalEnd(id);
//   //     if (res.ok) alert("Fin de location signalée !");
//   //   }
//   // };

//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-12" /></div>;

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 text-left">
//       <div className="flex justify-between items-center border-b pb-6">
//         <h2 className="text-3xl font-[900] italic tracking-tighter uppercase">Mes Trajets</h2>
//         <div className="size-12 bg-blue-50 text-[#0528d6] rounded-2xl flex items-center justify-center"><Bell size={20}/></div>
//       </div>

//       <div className="space-y-6">
//         {/* Placeholder - On itérerait sur rentals ici */}
//         <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
//             <div className="flex items-center gap-4 mb-8">
//                <div className="size-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center shadow-inner"><Clock size={32}/></div>
//                <div>
//                   <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Aucune location active</p>
//                   <h4 className="text-lg font-bold">Prêt pour un nouveau départ ?</h4>
//                </div>
//             </div>
//             <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
//                 Retrouvez ici vos locations en cours, vos factures et signalez la fin de vos trajets en un clic.
//             </p>
//         </div>
//       </div>
//     </div>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Clock, Bell, Loader2,  Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { rentalService } from '@shared-services/api/rental.service';



export const MyBookingsView = ({ userData }: { userData: any }) => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await rentalService.getClientRentalsHistory();
        if (data.ok) setRentals(data.data || []);
          setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des locations", error);
        setLoading(false);
      }
    };
    fetchRentals();
  }, [userData]);

  const getStatusStyle = (status: any) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'ACTIVE': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#0528d6] size-12" />
      <p className="text-sm font-bold italic text-slate-400 uppercase tracking-widest">Chargement de vos trajets...</p>
    </div>
  );

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-left px-4">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6 mt-4">
        <div>
          <h2 className="text-3xl font-[900] tracking-tighter text-slate-900">Mes trajets</h2>
          <p className="text-slate-400 text-xs font-medium">Historique et réservations en cours</p>
        </div>
        <div className="relative size-12 bg-white shadow-sm border border-slate-100 text-[#0528d6] rounded-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
          <Bell size={20}/>
          <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
      </div>

      <div className="space-y-6">
        {rentals.length > 0 ? (
          rentals.map((rental) => (
            <div 
              key={rental.id} 
              className="group bg-white dark:bg-[#1a1d2d] rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all border-l-8 border-l-[#0528d6]"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Infos Principales */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusStyle(rental.status)}`}>
                      {rental.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Réf: {rental.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Dates</p>
                        <p className="text-sm font-bold text-slate-700">
                          Du {format(new Date(rental.startDate), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        <p className="text-xs text-slate-500">
                          au {format(new Date(rental.endDate), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0528d6] shrink-0">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Paiement</p>
                        <p className="text-sm font-black text-slate-900">
                          {rental.totalAmount.toLocaleString()} XAF
                        </p>
                        <p className={`text-[10px] font-bold ${rental.amountPaid >= rental.totalAmount ? 'text-green-500' : 'text-orange-500'}`}>
                          {rental.amountPaid >= rental.totalAmount ? 'Soldé' : `Reste: ${rental.totalAmount - rental.amountPaid} XAF`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions / CTA */}
                <div className="flex flex-col justify-center items-center md:items-end gap-3 shrink-0">
                  <button className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors">
                    Détails du trajet <ChevronRight size={16} />
                  </button>
                  {rental.status === 'ACTIVE' && (
                    <button className="text-[10px] font-black text-[#0528d6] uppercase underline decoration-2 underline-offset-4">
                      Signaler la fin
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="size-20 bg-orange-50 text-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-inner mx-auto mb-2">
                <Clock size={48} className="animate-pulse" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Aucun trajet trouvé</h4>
              <p className="text-slate-400 text-sm font-medium italic leading-relaxed max-w-sm mx-auto">
                  Aucune réservation trouvée. Vos futures locations, factures et suivis apparaîtront ici.
              </p>
              <button className="mt-8 bg-[#0528d6] text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-blue-200 transition-all">
                Louer un véhicule
              </button>
          </div>
        )}
      </div>
    </div>
  );
};