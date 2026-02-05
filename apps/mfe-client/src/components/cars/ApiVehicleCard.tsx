import React from 'react';
import Link from 'next/link';
import { Users, Fuel, Settings2, Heart } from 'lucide-react';
import { ApiVehicle } from '@/types/apiVehicleType';

interface ApiVehicleCardProps {
    vehicle: ApiVehicle;
    categoryName: string;
    lang: 'FR' | 'EN';
}

export default function ApiVehicleCard({ vehicle, categoryName, lang }: ApiVehicleCardProps) {
    const vehicleName = `${vehicle.brand} ${vehicle.model}`;

    return (
        <Link href={`/cars/${vehicle.id}`}>
            <div className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 border border-slate-50 dark:border-slate-700 hover:shadow-2xl transition-all cursor-pointer">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-4 relative shadow-inner bg-slate-50 dark:bg-[#0f1323]">
                    <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#0f1323]/95 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 z-10 shadow-sm">
                        {categoryName}
                    </div>
                    <div className="absolute top-4 right-4 z-10 p-2.5 bg-white/60 backdrop-blur rounded-full text-slate-900 cursor-pointer hover:bg-red-500 hover:text-white transition-all">
                        <Heart size={16} />
                    </div>
                    <img
                        src={vehicle.images?.[0] || 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=No+Image'}
                        alt={vehicleName}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=No+Image';
                        }}
                    />
                </div>

                <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-base tracking-tight leading-none text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {vehicleName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 shrink-0">
                            {new Date(vehicle.yearProduction).getFullYear()}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-medium tracking-wide mb-4">
                        <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>{vehicle.places}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Settings2 size={12} />
                            <span>{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Fuel size={12} />
                            <span>{vehicle.engineDetails?.type || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Pricing */}
                    {vehicle.pricing && (
                        <div className="mb-3">
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                    {vehicle.pricing.pricePerDay} {vehicle.pricing.currency}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    /{lang === 'FR' ? 'jour' : 'day'}
                                </span>
                            </div>
                            {vehicle.pricing.pricePerHour > 0 && (
                                <p className="text-xs text-slate-400">
                                    {vehicle.pricing.pricePerHour} {vehicle.pricing.currency}/{lang === 'FR' ? 'heure' : 'hour'}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Status & Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                vehicle.statut === 'AVAILABLE'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                                {vehicle.statut}
                            </span>
                        </div>
                        <span className="bg-slate-50 dark:bg-[#1a1d2d] text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl font-semibold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {lang === 'FR' ? 'Voir' : 'View'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
