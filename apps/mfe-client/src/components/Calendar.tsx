import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval, 
  parseISO 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

interface Schedule {
  startDate: string;
  endDate: string;
  reason: string;
}

interface CalendarProps {
  schedules: Schedule[];
}

const Calendar: React.FC<CalendarProps> = ({ schedules }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Fonction pour vérifier si un jour est dans une plage d'indisponibilité
  const isDayDisabled = (day: Date) => {
    return schedules.some(slot => 
      isWithinInterval(day, {
        start: parseISO(slot.startDate),
        end: parseISO(slot.endDate)
      }) || isSameDay(day, parseISO(slot.startDate)) || isSameDay(day, parseISO(slot.endDate))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wider">
          <CalendarIcon size={16} className="text-blue-600" />
          Disponibilités
        </h3>
        <span className="text-xs font-medium text-gray-500 capitalize">
          {format(today, 'MMMM yyyy', { locale: fr })}
        </span>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-gray-400">{d}</span>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const disabled = isDayDisabled(day);
          const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);

          return (
            <div
              key={i}
              className={`
                relative h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all
                ${!isCurrentMonth ? 'text-gray-200' : ''}
                ${disabled 
                  ? 'bg-red-50 text-red-400 cursor-not-allowed overflow-hidden' 
                  : 'bg-green-50 text-green-700 hover:bg-green-100 cursor-default'}
              `}
            >
              {format(day, 'd')}
              
              {/* Barre rouge pour les jours occupés */}
              {disabled && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-full h-[2px] bg-red-400 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px]">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Libre
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span> Occupé
          </span>
        </div>
        {schedules.length === 0 && (
          <p className="text-gray-400 italic font-medium">Libre tout le mois</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;