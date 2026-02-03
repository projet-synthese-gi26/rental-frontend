'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  Calendar,
  Heart,
  CreditCard,
  HelpCircle,
  LogOut,
  Camera,
  Share2,
  Edit,
} from 'lucide-react';
import { authApi, getAccessToken } from '@/services/api';

// Sidebar menu items
const menuItems = [
  { icon: User, label: 'Profile', href: '/profile', active: true },
  { icon: Settings, label: 'Paramètres', href: '/profile/settings', active: false },
  { icon: Calendar, label: 'Mes réservations', href: '/reservations', active: false },
  { icon: Heart, label: 'Mes favoris', href: '/favorites', active: false },
  { icon: CreditCard, label: 'Paiements', href: '/payments', active: false },
  { icon: HelpCircle, label: 'Aide & Support', href: '/help', active: false },
];

// Mock user data (fallback)
const mockUser = {
  id: '1',
  firstName: 'Mobina',
  lastName: 'Mirbagheri',
  email: 'mobina@example.com',
  phone: '+237 620 203 233',
  role: 'CLIENT',
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Welcome Message */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back!!</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                    }}
                  />
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <Share2 size={20} className="text-white" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="absolute -top-16 left-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                        {user.firstName?.charAt(0) || 'U'}
                        {user.lastName?.charAt(0) || ''}
                      </div>
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                      <Camera size={18} />
                    </button>
                  </div>
                </div>

                {/* User Details */}
                <div className="pt-20">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-green-600 mt-2">
                    Your account is ready, you can now apply for advice.
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="px-6 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personnel</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Prénom</label>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{user.firstName?.toLowerCase() || '-'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Nom</label>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{user.lastName?.toLowerCase() || '-'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Statut</label>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{user.role || 'Customer'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6">
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/profile/settings"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={18} />
                    Modifier le profil
                  </Link>

                  <Link
                    href="/reservations"
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Calendar size={18} />
                    Historique des réservations
                  </Link>

                  <Link
                    href="/favorites"
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Heart size={18} />
                    Mes favoris
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
