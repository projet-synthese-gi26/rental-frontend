/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { vehicleService } from '@pwa-easy-rental/shared-services';
import { VehicleHero } from './vehicle-details/VehicleHero';
import { VehicleSpecs } from './vehicle-details/VehicleSpecs';
import { VehicleReviews } from './vehicle-details/VehicleReviews';
import { VehicleBookingCard } from './vehicle-details/VehicleBookingCard';

export const VehicleDetailsView = ({ vehicleId, isAuth, onBack, onAuthRequired, onStartBooking }: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SPECS');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await vehicleService.getVehicleDetails(vehicleId);
        if (res.ok) setData(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [vehicleId]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f4f7fe] dark:bg-[#0f1323]">
      <Loader2 className="animate-spin text-[#0528d6]" size={48} />
      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse italic">Chargement des données techniques</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20 px-6 text-left">
      
      {/* Barre de navigation persistante avec espacement corrigé */}
      <div className="sticky top-20 z-[40] -mx-6 px-6 py-5 bg-[#f4f7fe]/95 dark:bg-[#0f1323]/95 backdrop-blur-md flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase hover:text-[#0528d6] transition-all italic"
        >
          <ArrowLeft size={16} /> Catalogue
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate italic leading-none">
          {data.vehicle.brand} {data.vehicle.model}
        </span>
      </div>

      {/* Margue supérieure pour dégager le titre du header sticky */}
      <div className="grid lg:grid-cols-12 gap-10 mt-12">
        <div className="lg:col-span-8 space-y-10">
          <VehicleHero vehicle={data.vehicle} />

          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit">
             {['SPECS', 'REVIEWS'].map((tab) => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-[#0528d6] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {tab === 'SPECS' ? 'Spécifications' : 'Avis Clients'}
               </button>
             ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'SPECS' && <VehicleSpecs vehicle={data.vehicle} />}
            {activeTab === 'REVIEWS' && <VehicleReviews reviews={data.reviews} />}
          </div>
        </div>

        <VehicleBookingCard 
          vehicle={data.vehicle}
          pricing={data.pricing}
          isAuth={isAuth}
          onAuthRequired={onAuthRequired}
          onStartBooking={onStartBooking}
        />
      </div>
    </div>
  );
};