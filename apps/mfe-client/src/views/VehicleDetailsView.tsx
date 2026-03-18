/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Wind, Usb, Bluetooth, MapPin, Briefcase, Zap, 
  ShieldCheck, Loader2, Settings, HardDrive,
  Award, Building2, Store, Phone, Star, MessageSquare, 
  CheckCircle2, Clock, ShieldAlert, 
  Fuel, Palette, Users, ListChecks, Info, 
  UserCheck, CalendarRange,
  ChevronRight
} from 'lucide-react';
import { vehicleService, agencyService, orgService } from '@pwa-easy-rental/shared-services';
import { BookingWizardModal } from './booking/BookingWizardModal';
import MyCalendar from '@/components/MyCalendar';

export const VehicleDetailsView = ({ vehicleId, onBack, userData }: any) => {
  const [details, setDetails] = useState<any>(null);
  const [agency, setAgency] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [rentalType, setRentalType] = useState<'DAILY' | 'HOURLY'>('DAILY');

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    // Tu récupères ainsi un tableau de toutes les dates choisies
    const handleDates = (dates: Date[]) => {
    setSelectedDates(dates);
    };

  useEffect(() => {
    const fetchFullDetails = async () => {
      const res = await vehicleService.getVehicleDetails(vehicleId);
      if (res.ok) {
        setDetails(res.data);
        const agRes = await agencyService.getAgencyDetails(res.data.vehicle.agencyId);
        if (agRes.ok) {
          setAgency(agRes.data);
          const orgRes = await orgService.getOrgDetails(agRes.data.organizationId);
          if (orgRes.ok) setOrg(orgRes.data);
        }
      }
      setLoading(false);
    };
    fetchFullDetails();
  }, [vehicleId]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  const { vehicle, pricing, rating, reviews, isDriverBookingRequired } = details;

  return (
    <div className="animate-in fade-in duration-500 pb-20 text-left">
      {/* HEADER NAVIGATION */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="group flex items-center gap-2 text-xs font-black  text-slate-900 hover:text-[#0528d6] transition-all italic">
          <div className="size-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
            <ChevronLeft size={18}/>
          </div>
          Retour au catalogue
        </button>
        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
           <Award size={16} className="text-[#0528d6]" />
           <span className="text-[10px] font-black  text-[#0528d6] italic">Véhicule Premium Certifié</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SECTION GAUCHE : VISUELS ET PARTENAIRE */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner group">
            <img src={vehicle.images?.[0] || '/car.png'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="main" />
            <div className="absolute top-6 right-6 px-4 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl flex items-center gap-2 shadow-2xl border border-white/20">
               <Star size={16} className="text-orange-500 fill-orange-500" />
               <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{rating?.toFixed(1)}</span>
               <span className="text-[10px] font-bold text-slate-500  italic">({reviews?.length} avis)</span>
            </div>
            <div className="absolute bottom-6 left-6 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-xl text-white text-[10px] font-black  tracking-widest italic border border-white/10">
                Immatriculation : {vehicle.licencePlate}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {vehicle.images?.slice(1, 5).map((img: string, i: number) => (
              <div key={i} className="aspect-video rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm hover:border-[#0528d6] transition-all cursor-pointer">
                <img src={img} className="w-full h-full object-cover" alt="sub" />
              </div>
            ))}
          </div>

          {/* BLOC AGENCE / ORGANISATION */}
          <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6">
             <div className="size-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner shrink-0 overflow-hidden">
                {org?.logoUrl ? <img src={org.logoUrl} className="w-full h-full object-cover" alt="logo" /> : <Building2 className="text-[#0528d6]" size={32}/>}
             </div>
             <div className="flex-1">
                <div className="mb-6">
                    <p className="text-[10px] font-black  text-slate-500 italic mb-2">Description Commerciale</p>
                    <p className="text-xs text-slate-800 dark:text-slate-300 font-bold italic leading-relaxed">
                        {vehicle.description?.length > 0 ? vehicle.description[0] : "Aucune description fournie par l'agence partenaire."}
                    </p>
                </div>
                <p className="text-[10px] font-black  text-[#0528d6] italic mb-1 tracking-widest">Opérateur de Flotte</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter  leading-none">{org?.name}</h4>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
                   <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-800 dark:text-slate-200 italic "><Store size={14} className="text-[#0528d6]"/> Agence {agency?.name}</span>
                   <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-800 dark:text-slate-200 italic "><MapPin size={14} className="text-[#0528d6]"/> {agency?.city}</span>
                   <span className="flex items-center gap-1.5 text-[11px] font-black text-[#0528d6] italic "><Phone size={14}/> {agency?.phone}</span>
                </div>
             </div>
          </div>
          {/* GRILLE TECHNIQUE EXHAUSTIVE (TOUTES LES PROPRIÉTÉS) */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
         
         {/* BOX 1 : MOTORISATION ET ÉCONOMIE */}
         <DataBox title="Performances & Énergie" icon={<HardDrive size={18}/>}>
            <DataRow label="Type de moteur" value={vehicle.engineDetails?.type} />
            <DataRow label="Puissance Totale" value={`${vehicle.engineDetails?.horsepower} Chevaux`} />
            <DataRow label="Capacité Cylindrée" value={`${vehicle.engineDetails?.capacity} Litres`} />
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-2"><Fuel size={14} className="text-[#0528d6]"/><h5 className="text-[10px] font-black  text-slate-800 dark:text-white italic">Consommation moyenne</h5></div>
                <DataRow label="Cycle Urbain (Ville)" value={vehicle.fuelEfficiency?.city} />
                <DataRow label="Cycle Extra-Urbain" value={vehicle.fuelEfficiency?.highway} />
            </div>
         </DataBox>

         {/* BOX 2 : CONFORT & FONCTIONNALITÉS */}
         <DataBox title="Confort & Technologie" icon={<ListChecks size={18}/>}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <IconFeature label="Climatisation" active={vehicle.functionalities?.air_condition} icon={<Wind size={14}/>}/>
                <IconFeature label="Navigation GPS" active={vehicle.functionalities?.gps} icon={<MapPin size={14}/>}/>
                <IconFeature label="Bluetooth" active={vehicle.functionalities?.bluetooth} icon={<Bluetooth size={14}/>}/>
                <IconFeature label="Port USB" active={vehicle.functionalities?.usb_input} icon={<Usb size={14}/>}/>
                <IconFeature label="Système Audio" active={vehicle.functionalities?.audio_input} icon={<MessageSquare size={14}/>}/>
                <IconFeature label="Siège Enfant" active={vehicle.functionalities?.child_seat} icon={<Users size={14}/>}/>
                <IconFeature label="Ordinateur" active={vehicle.functionalities?.onboard_computer} icon={<Settings size={14}/>}/>
                <IconFeature label="Bagages" active={vehicle.functionalities?.luggage} icon={<Briefcase size={14}/>}/>
                <IconFeature label="Espace Nuit" active={vehicle.functionalities?.sleeping_bed} icon={<Clock size={14}/>}/>
                <IconFeature label="Boissons" active={vehicle.functionalities?.water} icon={<Info size={14}/>}/>
            </div>
         </DataBox>

         {/* BOX 3 : INFOS ADMINISTRATIVES & LÉGALES */}
         <DataBox title="Spécifications & Légal" icon={<ShieldAlert size={18}/>}>
            <DataRow label="Transmission" value={vehicle.transmission} />
            <DataRow label="N° de Châssis (VIN)" value={vehicle.vinNumber} />
            <DataRow label="Code Couleur" value={vehicle.color} icon={<Palette size={14}/>} />
            <DataRow label="Kilométrage" value={`${vehicle.kilometrage} KM`} />
            <DataRow label="Capacité Assise" value={`${vehicle.places} Sièges`} />
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 mb-2"><ShieldCheck size={14} className="text-[#0528d6]"/><h5 className="text-[10px] font-black  text-slate-800 dark:text-white italic">Assurance Partenaire</h5></div>
                <DataRow label="Compagnie" value={vehicle.insuranceDetails?.provider} />
                <DataRow label="N° de Police" value={vehicle.insuranceDetails?.policy_number} />
                <DataRow label="Date d'expiration" value={new Date(vehicle.insuranceDetails?.expiry).toLocaleDateString()} />
            </div>
         </DataBox>

        

         {/* BOX 5 : AVIS CLIENTS */}
         <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="text-[#0528d6]"><MessageSquare size={18}/></div>
                <h4 className="text-xs font-black  italic tracking-widest text-slate-900 dark:text-white">Expériences Utilisateurs</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews?.length > 0 ? reviews.map((r:any, i:number) => (
                    <div key={i} className="text-left space-y-3 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 relative">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-[#0528d6] rounded-full flex items-center justify-center text-white font-black text-[10px] ">{r.authorName?.charAt(0)}</div>
                                <span className="text-[11px] font-black text-slate-900 dark:text-white  italic">{r.authorName}</span>
                            </div>
                            <div className="flex text-orange-500 gap-0.5">
                                {[...Array(5)].map((_, star) => <Star key={star} size={10} fill={star < r.rating ? "currentColor" : "none"} className={star < r.rating ? "text-orange-500" : "text-slate-300"} />)}
                            </div>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-300 font-bold italic leading-relaxed">{r.comment}</p>
                        <p className="text-[8px] font-black text-slate-400  tracking-widest">Le {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                )) : (
                    <div className="col-span-2 py-10 text-center text-slate-400 text-[11px] font-black  italic tracking-widest">{"Aucun retour d'expérience pour le moment"}</div>
                )}
            </div>
         </div>
      </div>
        </div>

        {/* SECTION DROITE : PRIX ET ACTIONS */}
        <div className="lg:col-span-5 space-y-6 min-h-screen">
          <div className="bg-white dark:bg-[#1a1d2d] rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden ">
             <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Zap size={120} className="text-[#0528d6]"/></div>
             
             <div className="relative z-10">
                <h1 className="text-3xl font-[900]  tracking-tighter text-slate-900 dark:text-white leading-none mb-2">
                    {vehicle.brand} <span className="text-[#0528d6]">{vehicle.model}</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-black  tracking-[0.2em] mb-10 italic">Millésime {new Date(vehicle.yearProduction).getFullYear()} — Status: {vehicle.statut}</p>
                
                {/* SELECTEUR DE TYPE DE LOCATION */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button onClick={() => setRentalType('DAILY')} className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${rentalType === 'DAILY' ? 'border-[#0528d6] bg-blue-50/10 shadow-inner' : 'border-slate-100 dark:border-slate-800'}`}>
                        <div className="flex items-center justify-between w-full"><span className="text-[9px] font-black  text-slate-500">Par Jour</span><CalendarRange size={14} className={rentalType === 'DAILY' ? 'text-[#0528d6]' : 'text-slate-300'}/></div>
                        <p className={`text-xl font-black italic ${rentalType === 'DAILY' ? 'text-[#0528d6]' : 'text-slate-800 dark:text-slate-200'}`}>{pricing?.pricePerDay?.toLocaleString()} <span className="text-[10px]">XAF</span></p>
                    </button>
                    <button onClick={() => setRentalType('HOURLY')} className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${rentalType === 'HOURLY' ? 'border-[#0528d6] bg-blue-50/10 shadow-inner' : 'border-slate-100 dark:border-slate-800'}`}>
                        <div className="flex items-center justify-between w-full"><span className="text-[9px] font-black  text-slate-500">Par Heure</span><Clock size={14} className={rentalType === 'HOURLY' ? 'text-[#0528d6]' : 'text-slate-300'}/></div>
                        <p className={`text-xl font-black italic ${rentalType === 'HOURLY' ? 'text-[#0528d6]' : 'text-slate-800 dark:text-slate-200'}`}>{pricing?.pricePerHour?.toLocaleString()} <span className="text-[10px]">XAF</span></p>
                    </button>
                </div>

                {isDriverBookingRequired && (
                    <div className="mb-8 p-5 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-800/50 rounded-3xl flex items-start gap-4 shadow-sm">
                        <UserCheck size={24} className="text-orange-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[11px] font-black text-orange-800 dark:text-orange-400  tracking-widest leading-none mb-1 italic">Assistance Chauffeur Obligatoire</p>
                            <p className="text-[10px] text-orange-700/80 dark:text-orange-300/80 font-bold leading-tight">{"Ce véhicule haut standing nécessite l'accompagnement d'un chauffeur agréé par l'organisation."}</p>
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => setShowWizard(true)}
                    className="w-full py-6 bg-[#0528d6] text-white rounded-[2rem] font-black text-sm  tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 italic"
                >
                    Réserver avec ces options <ChevronRight size={20}/>
                </button>
             </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center gap-6 border border-white/5 shadow-2xl">
             <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-inner"><ShieldCheck size={32}/></div>
             <div className="flex-1 text-left">
                <p className="text-[11px] font-black  italic text-blue-400 mb-1 tracking-widest">Protection Garantie</p>
                <p className="text-xs text-slate-300 font-bold leading-tight italic">Assurance tous risques (NIU: {org?.taxNumber}) et assistance technique incluses.</p>
             </div>
          </div>
            <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 py-3 border border-slate-200 dark:border-slate-800 shadow-sm h-full ">
                <div className="overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {/* <MyCalendar schedules={schedule} /> */}
                    <MyCalendar 
                    schedules={details.schedule} 
                    selectedDates={selectedDates} 
                    onDatesChange={handleDates} 
                    />
                </div>
            </div>
        </div>
      </div>

      

      {showWizard && (
        <BookingWizardModal 
            vehicle={vehicle} 
            userData={userData} 
            isDriverRequired={isDriverBookingRequired}
            initialRentalType={rentalType}
            onClose={() => setShowWizard(false)} 
        />
      )}
    </div>
  );
};

// --- SOUS-COMPOSANTS DE DATA INTERNE ---

const DataBox = ({ title, icon, children }: any) => (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-[2.5rem] p-8 py-3 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="text-[#0528d6]">{icon}</div>
            <h4 className="text-xs font-black  italic tracking-widest text-slate-900 dark:text-white">{title}</h4>
        </div>
        <div className="space-y-4 h-full">{children}</div>
    </div>
);

const DataRow = ({ label, value, icon }: any) => (
    <div className="flex justify-between items-center group">
        <div className="flex items-center gap-2">
            {icon && <span className="text-slate-400">{icon}</span>}
            <span className="text-[10px] font-black text-slate-800 dark:text-slate-400  tracking-tighter italic">{label}</span>
        </div>
        <span className="text-xs font-black text-slate-900 dark:text-slate-100 italic transition-colors group-hover:text-[#0528d6]">{value || '---'}</span>
    </div>
);

const IconFeature = ({ label, active, icon }: any) => (
    <div className={`flex items-center gap-3 ${active ? 'opacity-100' : 'opacity-25'}`}>
        <div className={`size-8 rounded-xl flex items-center justify-center ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-[#0528d6]' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}>
            {React.cloneElement(icon, { size: 14 })}
        </div>
        <span className="text-[9px] font-black  text-slate-900 dark:text-slate-200 italic tracking-tight">{label}</span>
        {active && <CheckCircle2 size={12} className="text-green-500 ml-auto" />}
    </div>
);

// const PriceCard = ({ label, value, unit, active }: any) => (
//     <div className={`flex justify-between items-center p-5 rounded-2xl border-2 transition-all ${active ? 'border-[#0528d6] bg-blue-50/10 shadow-inner' : 'border-slate-100 dark:border-slate-800'}`}>
//         <div className="flex items-center gap-3">
//             <div className={`size-2 rounded-full ${active ? 'bg-[#0528d6] animate-pulse' : 'bg-slate-300'}`} />
//             <span className="text-[10px] font-black  text-slate-800 dark:text-slate-300 italic tracking-widest">{label}</span>
//         </div>
//         <div className="text-right">
//             <p className={`text-2xl font-[900] italic tracking-tighter leading-none ${active ? 'text-[#0528d6]' : 'text-slate-900 dark:text-slate-200'}`}>
//                 {value?.toLocaleString()} <span className="text-xs">XAF</span>
//             </p>
//             <p className="text-[8px] font-black  text-slate-500 mt-1 italic opacity-70">{unit}</p>
//         </div>
//     </div>
// );