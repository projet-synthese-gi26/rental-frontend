'use client';
import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  growth?: string; // Ex: "+12%"
  icon: React.ReactNode;
  badge?: string; // Ex: "Action requise"
  highlight?: boolean; // Si vrai, utilise l'accent orange
  className?: string;
}

export const KpiCard = ({ 
  label, 
  value, 
  growth, 
  icon, 
  badge, 
  highlight, 
  className = "" 
}: KpiCardProps) => {
  return (
    <div className={`
      p-6 rounded-2xl border flex flex-col justify-between h-40 transition-all duration-300
      /* Fond blanc qui ressort sur le fond gris du dashboard */
      bg-white dark:bg-[#1a1d2d] shadow-sm hover:shadow-md
      ${highlight 
        ? 'border-orange-200 dark:border-orange-500/30' 
        : 'border-slate-200 dark:border-slate-800'
      }
      ${className}
    `}>
      {/* Section Supérieure : Icône & Indicateurs */}
      <div className="flex justify-between items-start">
        <div className={`
          p-3 rounded-xl transition-colors duration-300
          ${highlight 
            ? 'bg-orange-50 dark:bg-orange-500/10 text-[#F76513]' 
            : 'bg-slate-50 dark:bg-slate-800 text-[#0528d6] group-hover:bg-[#0528d6] group-hover:text-white'
          }
        `}>
          {/* On s'assure que l'icône a une taille constante */}
          {React.cloneElement(icon as React.ReactElement, { size: 22 })}
        </div>
        
        <div className="flex flex-col items-end gap-1">
          {growth && (
            <span className={`text-xs font-bold italic ${growth.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
              {growth}
            </span>
          )}
          {badge && (
            <span className="bg-[#F76513] text-white text-[10px] font-bold px-3 py-1 rounded-lg  tracking-wider shadow-sm">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Section Inférieure : Label & Valeur */}
      <div className="mt-4">
        <p className="text-[11px] font-bold  tracking-widest text-slate-400 mb-1 italic">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {/* Petit indicateur de point si highlight pour attirer l'oeil sans être agressif */}
          {highlight && <div className="size-2 bg-[#F76513] rounded-full animate-ping" />}
        </div>
      </div>
    </div>
  );
};