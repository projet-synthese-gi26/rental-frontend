'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';

interface LocationFilterProps {
  onSearch?: (filters: {
    location: string;
    pickupDate: string;
    returnDate: string;
  }) => void;
  className?: string;
}

export function LocationFilter({ onSearch, className = '' }: LocationFilterProps) {
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const cities = [
    'Yaoundé',
    'Douala',
    'Bafoussam',
    'Garoua',
    'Maroua',
    'Bamenda',
    'Kribi',
    'Limbe',
  ];

  const handleSearch = () => {
    onSearch?.({ location, pickupDate, returnDate });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-4 md:p-6 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Sélectionner une ville</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de prise
          </label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de retour
          </label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Search size={20} />
            <span>Rechercher</span>
          </button>
        </div>
      </div>
    </div>
  );
}
