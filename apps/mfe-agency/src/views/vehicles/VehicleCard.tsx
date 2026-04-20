/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Car, Gauge, Users, Settings, Edit3, Trash2, Info, CheckCircle2, Clock } from 'lucide-react';
import { hasPermission } from '../../utils/permissions';

export const VehicleCard = ({ vehicle, categoryName, onEdit, onDelete, onStatusUpdate, onViewDetails, t, userData }: any) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'MAINTENANCE': return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'RENTED': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d2d] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group text-left h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(vehicle.statut)}`}>
          {vehicle.statut}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onViewDetails(vehicle)} className="p-2 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"><Info size={16}/></button>
          {hasPermission(userData, 'vehicle:update') && (
            <button onClick={() => onEdit(vehicle)} className="p-2 text-slate-400 hover:text-[#0528d6] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"><Edit3 size={16}/></button>
          )}
          {hasPermission(userData, 'vehicle:delete') && (
            <button onClick={() => onDelete(vehicle.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"><Trash2 size={16}/></button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="size-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#0528d6] border border-slate-100 dark:border-slate-700 shrink-0">
          <Car size={28} />
        </div>
        <div className="overflow-hidden">
          <h4 className="font-black text-slate-900 dark:text-white leading-tight truncate uppercase italic tracking-tighter">
            {vehicle.brand} {vehicle.model}
          </h4>
          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 italic">
            {vehicle.licencePlate}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 dark:border-slate-800 mb-4">
        <div className="flex flex-col items-center">
          <Gauge size={14} className="text-slate-300 mb-1" />
          <span className="text-[10px] font-bold text-slate-500">{vehicle.kilometrage} km</span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-50 dark:border-slate-800">
          <Users size={14} className="text-slate-300 mb-1" />
          <span className="text-[10px] font-bold text-slate-500">{vehicle.places} pl.</span>
        </div>
        <div className="flex flex-col items-center">
          <Settings size={14} className="text-slate-300 mb-1" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">{vehicle.transmission?.substring(0,3)}</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase italic">
          <span>{t.vehicles.modal.category}</span>
          <span className="text-[#0528d6] dark:text-blue-400 font-black">{categoryName || 'Standard'}</span>
        </div>
        
        {hasPermission(userData, 'vehicle:update') && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
            <button 
              onClick={() => onStatusUpdate(vehicle.id, 'AVAILABLE')}
              className="flex items-center justify-center gap-1.5 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-green-100 transition-colors"
            >
              <CheckCircle2 size={12}/> {t.vehicles.stats.available.split(' ')[0]}
            </button>
            <button 
              onClick={() => onStatusUpdate(vehicle.id, 'MAINTENANCE')}
              className="flex items-center justify-center gap-1.5 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-orange-100 transition-colors"
            >
              <Clock size={12}/> {t.vehicles.stats.maintenance.split(' ')[0]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};