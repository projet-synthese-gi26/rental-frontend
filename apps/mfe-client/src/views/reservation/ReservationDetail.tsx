/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MapPin,
  UserIcon,
  X,
  Loader2,
  Phone,
  Mail,
  Calendar,
  Clock,
  Car,
  Shield,
  CreditCard,
  Gauge,
  ChevronRight,
} from "lucide-react";

const ReservationDetail = ({ data, onClose, onCancel, cancelling }: any) => {
  const { rental, vehicle, driver, agency } = data;

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    if (rental?.rentalType !== "DAILY") {
        options.hour = "2-digit";
        options.minute = "2-digit";
    }

    return new Date(date).toLocaleDateString("fr-FR", options);
  };

    const start = new Date(rental?.startDate);
    const end = new Date(rental?.endDate);

    const diffMs = end.getTime() - start.getTime();

    const durationDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const durationHours = Math.ceil(diffMs / (1000 * 60 * 60));

    const duration =
    rental?.rentalType === "DAILY" ? durationDays : durationHours ;

    const durationLabel =
    rental?.rentalType === "DAILY" ? "Jours" : "Heures" ;


  const remaining = (rental?.totalAmount || 0) - (rental?.amountPaid || 0);

  const SectionTitle = ({ title, icon: Icon }: any) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="size-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
        <Icon size={14} />
      </div>
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {title}
      </h4>
    </div>
  );

  const FeatureBadge = ({ label, active }: any) =>
    active ? (
      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0528d6] rounded-xl text-[10px] font-bold border border-blue-100">
        <div className="size-1 bg-[#0528d6] rounded-full" />
        {label}
      </span>
    ) : null;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
      
      {/* HEADER : VISUEL & IDENTITÉ */}
      <div className="relative h-72 bg-slate-900">
        <img
          src={vehicle?.images?.[0] || "/car-placeholder.png"}
          className="w-full h-full object-cover opacity-60"
          alt="Véhicule"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 size-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                {vehicle?.brand} {vehicle?.model}
              </span>
              <h3 className="text-4xl font-black text-white mt-3 tracking-tighter italic uppercase">
                {vehicle?.licencePlate || "SANS IMMAT"}
              </h3>
              <p className="text-sm text-white/60 font-medium">
                {vehicle?.color} • Modèle {vehicle?.yearProduction?.slice?.(0, 4)}
              </p>
            </div>
            <div className="text-right hidden md:block">
               <p className="text-[10px] font-black text-white/40 uppercase">Référence</p>
               <p className="text-xs font-bold text-white uppercase tracking-widest">{rental?.id?.slice(0,8)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-12">
        
        {/* SECTION 1 : DASHBOARD FINANCIER & STATUT */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900 rounded-[2rem] text-white col-span-1 md:col-span-2 shadow-xl shadow-slate-200">
              <div className="flex justify-between items-center mb-4">
                <CreditCard size={18} className="text-blue-400" />
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${rental?.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {rental?.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Reste à régler en agence</p>
                <p className="text-3xl font-black italic">{remaining.toLocaleString()} <span className="text-xs italic opacity-50">XAF</span></p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-[10px] font-bold opacity-60">
                <span>TOTAL: {rental?.totalAmount?.toLocaleString()}</span>
                <span>PAYÉ: {rental?.amountPaid?.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-5 bg-blue-50 border border-blue-100 rounded-[2rem] flex flex-col justify-center">
              <SectionTitle title="Durée" icon={Clock} />
              <p className="text-2xl font-black text-[#0528d6] italic">{duration} <span className="text-xs font-black uppercase tracking-tighter">{durationLabel}</span></p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col justify-center">
              <SectionTitle title="Kilométrage" icon={Gauge} />
              <p className="text-2xl font-black text-slate-900 italic">{vehicle?.kilometrage || '0'} <span className="text-xs font-black uppercase tracking-tighter">KM</span></p>
            </div>
          </div>
        </section>

        {/* SECTION 2 : LOGISTIQUE (DATES & LIEUX) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SectionTitle title="Planning de location" icon={Calendar} />
            <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] top-0 size-4 rounded-full bg-white border-4 border-blue-600" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Départ</p>
                <p className="text-sm font-black text-slate-900">{formatDate(rental?.startDate)}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-0 size-4 rounded-full bg-white border-4 border-slate-200" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Retour</p>
                <p className="text-sm font-black text-slate-900">{formatDate(rental?.endDate)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="Lieu de retrait" icon={MapPin} />
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <p className="text-sm font-black text-slate-900 mb-1">{agency?.name}</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{agency?.address}, {agency?.city}</p>
              <div className="flex gap-2">
                <a href={`tel:${agency?.phone}`} className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors">
                  <Phone size={16} />
                </a>
                <a href={`mailto:${agency?.email}`} className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 : LES ACTEURS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Client */}
          <div className="space-y-4">
            <SectionTitle title="Client" icon={UserIcon} />
            <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="size-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <UserIcon size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none mb-1">{rental?.clientName}</p>
                <p className="text-[10px] text-slate-500 font-bold">{rental?.clientPhone}</p>
              </div>
            </div>
          </div>

          {/* Chauffeur */}
          {driver && (
            <div className="space-y-4">
              <SectionTitle title="Chauffeur" icon={Shield} />
              <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="size-12 rounded-xl overflow-hidden bg-slate-100">
                  {driver?.profilUrl ? (
                    <img src={driver.profilUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <UserIcon size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 leading-none mb-1">{driver?.firstname} {driver?.lastname}</p>
                  <p className="text-[10px] text-slate-500 font-bold italic flex gap-2"> <Phone size={12} />Tel: {driver?.tel}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4 : ÉQUIPEMENTS VÉHICULE */}
        <section className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <SectionTitle title="Équipements & Confort" icon={Car} />
          <div className="flex flex-wrap gap-2">
            <FeatureBadge label="Climatisation" active={vehicle?.functionalities?.air_condition} />
            <FeatureBadge label="Bluetooth" active={vehicle?.functionalities?.bluetooth} />
            <FeatureBadge label="GPS" active={vehicle?.functionalities?.gps} />
            <FeatureBadge label="USB" active={vehicle?.functionalities?.usb_input} />
            <FeatureBadge label="Ordinateur" active={vehicle?.functionalities?.onboard_computer} />
            <FeatureBadge label="Bagages" active={vehicle?.functionalities?.luggage} />
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200/50">
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Transmission</p>
                <p className="text-xs font-black text-slate-900">{vehicle?.transmission}</p>
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Places</p>
                <p className="text-xs font-black text-slate-900">{vehicle?.places} Sièges</p>
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">VIN</p>
                <p className="text-xs font-black text-slate-900">{vehicle?.vinNumber || 'N/A'}</p>
             </div>
          </div>
        </section>

        {/* ACTION FINALE */}
        <div className="pt-4">
          <button
            disabled={cancelling}
            onClick={() => onCancel(rental?.id)}
            className="w-full py-5 bg-red-50 text-red-500 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg shadow-red-100"
          >
            {cancelling ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Annuler ma réservation
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <p className="text-center text-[9px] font-bold text-slate-400 uppercase mt-4 tracking-tighter">
            Note: Une annulation tardive peut entraîner des frais de gestion.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ReservationDetail;