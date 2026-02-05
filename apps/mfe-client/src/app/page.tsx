/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { authService } from '@pwa-easy-rental/shared-services';
import { Header } from '../components/Header';
import { HomeView } from '../views/HomeView';
import { AuthView } from '../views/AuthView';
import { VehiclesView } from '../views/VehiclesView';
import { VehicleDetailsView } from '../views/VehicleDetailsView';
import { ProfileView } from '../views/ProfileView';
import { MyBookingsView } from '../views/MyBookingsView';
import { BookingView } from '../views/BookingView';
import { Loader2 } from 'lucide-react';
import { NotificationsView } from '@/views/NotificationsView';

export default function ClientHome() {
  const [currentView, setCurrentView] = useState('HOME');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({ city: '', start: '', end: '' });

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    const token = localStorage.getItem('auth_token');
    if (token) fetchProfile();
    else setIsLoading(false);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authService.getMe();
      if (res.ok && res.data) {
        setUserData(res.data);
        setIsAuth(true);
      } else {
        localStorage.removeItem('auth_token');
        setIsAuth(false);
      }
    } catch {
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthAction = async (isSignUp: boolean, form: any) => {
    try {
      const res = isSignUp ? await authService.registerClient(form) : await authService.login(form);
      if (res.ok) {
        const credentials = isSignUp ? { email: form.email, password: form.password } : form;
        const logRes = await authService.login(credentials);
        if (logRes.ok && logRes.data.token) {
          localStorage.setItem('auth_token', logRes.data.token);
          await fetchProfile();
          setCurrentView('HOME');
          return true;
        }
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.reload();
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14]">
      <Loader2 className="animate-spin text-[#0528d6] size-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fe] dark:bg-[#0f1323] transition-colors duration-500">
      <Header 
        isAuth={isAuth}
        userData={userData}
        setCurrentView={setCurrentView}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        lang={lang}
        setLang={setLang}
      />

      <main>
        {currentView === 'HOME' && (
          <HomeView 
            onSearch={(f: any) => { setFilters(f); setCurrentView('CARS'); }}
            setViewAll={() => setCurrentView('CARS')}
            onSelectVehicle={(id: string) => { setSelectedVehicleId(id); setCurrentView('DETAILS'); }}
          />
        )}
        {currentView === 'CARS' && (
          <VehiclesView 
            initialFilters={filters} 
            onSelectVehicle={(id: string) => { setSelectedVehicleId(id); setCurrentView('DETAILS'); }}
            onBack={() => setCurrentView('HOME')}
          />
        )}
        {currentView === 'DETAILS' && selectedVehicleId && (
          <VehicleDetailsView 
            vehicleId={selectedVehicleId} 
            isAuth={isAuth}
            onBack={() => setCurrentView('CARS')}
            onAuthRequired={() => setCurrentView('AUTH')}
            onStartBooking={() => setCurrentView('BOOKING_PROCESS')}
          />
        )}
        {currentView === 'BOOKING_PROCESS' && selectedVehicleId && (
          <BookingView 
            vehicleId={selectedVehicleId}
            userData={userData}
            onBack={() => setCurrentView('DETAILS')}
            onSuccess={() => setCurrentView('MY_BOOKINGS')}
          />
        )}
        {currentView === 'MY_BOOKINGS' && (
          <MyBookingsView 
            userData={userData}
            onBack={() => setCurrentView('HOME')}
            onSelectVehicle={(id: string) => { setSelectedVehicleId(id); setCurrentView('DETAILS'); }}
          />
        )}
        {currentView === 'PROFILE' && (
          <ProfileView userData={userData} onLogout={logout} onBack={() => setCurrentView('HOME')} />
        )}
        {currentView === 'AUTH' && (
          <AuthView onAuth={handleAuthAction} onBack={() => setCurrentView('HOME')} lang={lang} setLang={setLang} darkMode={darkMode} toggleTheme={toggleTheme} />
        )}
        {currentView === 'NOTIFICATIONS' && (
          <NotificationsView userData={userData} onBack={() => setCurrentView('HOME')} />
        )}
      </main>
    </div>
  );
}