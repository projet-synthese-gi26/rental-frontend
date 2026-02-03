'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users } from 'lucide-react';
import { Agency } from '@/types/agencyType';
import { StarRating } from './StarRating';

interface AgencyCardProps {
  agency: Agency;
}

export function AgencyCard({ agency }: AgencyCardProps) {
  return (
    <Link href={`/agencies/${agency.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={agency.images[0] || '/client/images/placeholder-agency.jpg'}
            alt={agency.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                agency.type === 'headquarters'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}
            >
              {agency.type === 'headquarters' ? 'Siège' : 'Agence'}
            </span>
          </div>
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                agency.isOpen
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {agency.isOpen ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Agency Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {agency.name}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin size={14} className="mr-1 text-gray-400" />
            <span>
              {agency.city}, {agency.region}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <StarRating
              rating={agency.rating}
              size={14}
              showValue
              reviewCount={agency.reviewCount}
            />
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={14} className="mr-1" />
              <span>
                {agency.openingHours.open} - {agency.openingHours.close}
              </span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Users size={14} className="mr-1" />
              <span>{agency.followerCount} abonnés</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
