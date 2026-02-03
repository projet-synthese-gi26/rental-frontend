'use client';
import React from 'react';
import { Car, MapPin, Gauge, Users, Fuel, Trash2, Edit3, Settings } from 'lucide-react';

export const VehicleCard = ({ vehicle, agencyName, categoryName, onEdit, onDelete }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-700';
      case 'MAINTENANCE': return 'bg-orange-100 text-orange-700';
      case 'RENTED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(vehicle.statut)}`}>
          {vehicle.statut}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(vehicle)} className="p-2 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
          <button onClick={() => onDelete(vehicle.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
        </div>
      </div>

      <div className="flex items-center gap-5 mb-6">
        <div className="size-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] border border-slate-100 dark:border-slate-700">
          <Car size={32} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {vehicle.brand} <span className="font-medium text-slate-500">{vehicle.model}</span>
          </h4>
          <div className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
            {vehicle.licencePlate}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-50 dark:border-slate-800">
        <div className="flex flex-col items-center">
          <Gauge size={14} className="text-slate-300 mb-1" />
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{vehicle.kilometrage} km</span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-50 dark:border-slate-800">
          <Users size={14} className="text-slate-300 mb-1" />
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{vehicle.places} pl.</span>
        </div>
        <div className="flex flex-col items-center">
          <Settings size={14} className="text-slate-300 mb-1" />
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">{vehicle.transmission?.substring(0,3)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin size={12} />
          <span className="text-[11px] font-medium italic">{agencyName}</span>
        </div>
        <span className="text-[10px] font-black text-[#0528d6] uppercase tracking-tighter bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
          {categoryName}
        </span>
      </div>
    </div>
  );
};