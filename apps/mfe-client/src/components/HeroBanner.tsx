'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  variant?: 'primary' | 'secondary';
}

export function HeroBanner({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundImage,
  variant = 'primary',
}: HeroBannerProps) {
  const bgClass = variant === 'primary'
    ? 'bg-gradient-to-r from-blue-600 to-blue-800'
    : 'bg-gradient-to-r from-orange-500 to-orange-700';

  return (
    <div className={`relative rounded-2xl overflow-hidden ${bgClass}`}>
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover opacity-30"
          />
        </div>
      )}
      <div className="relative z-10 p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/90 text-lg mb-6 max-w-xl">
            {subtitle}
          </p>
        )}
        <Link
          href={buttonLink}
          className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${
            variant === 'primary'
              ? 'bg-white text-blue-600 hover:bg-gray-100'
              : 'bg-white text-orange-600 hover:bg-gray-100'
          }`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
