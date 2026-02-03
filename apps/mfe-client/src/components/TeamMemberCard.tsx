'use client';

import Image from 'next/image';

interface TeamMemberCardProps {
  name: string;
  role: string;
  photo?: string;
}

export function TeamMemberCard({ name, role, photo }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
      {/* Photo */}
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>

      {/* Role */}
      <p className="text-gray-600 text-sm">{role}</p>
    </div>
  );
}
