'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell,  Car, Users, Calendar, KeySquare, UserCircle2} from 'lucide-react';

const mainNavItems = [
  { href: '/vehicles', label: 'Vehicles', icon: Car },
  { href: '/drivers', label: 'Drivers', icon: Users },
  { href: '/reservations', label: 'Reservations', icon: Calendar },
  { href: '/locations', label: 'Locations', icon: KeySquare },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              Easy-<span className="text-secondary">Rental</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Menu principal */}
            <div className="flex items-center space-x-2">
              {mainNavItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}   
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={() => handleNavigation('/notifications')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  5
                </span>
              </button>

              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <UserCircle2 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Menu mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Menu principal mobile */}
            <div className="space-y-2 mb-4">
              {mainNavItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={18} className="text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Actions utilisateur mobile */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {/* <button
                onClick={() => handleNavigation('/favorites')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Heart size={20} className="text-gray-600" />
                <span>Favoris</span>
                <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  3
                </span>
              </button> */}

              <button
                onClick={() => handleNavigation('/notifications')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Bell size={20} className="text-gray-600" />
                <span>Notifications</span>
                <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  5
                </span>
              </button>

              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-100 rounded-lg"
              >
                <UserCircle2 size={20} className="text-gray-600" />
                <span>Mon compte</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour fermer le menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}