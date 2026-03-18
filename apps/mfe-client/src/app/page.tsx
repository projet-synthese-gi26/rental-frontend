/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Footer } from '@shared-ui/components/ui/Footer';
import { authService } from '@pwa-easy-rental/shared-services';

import { Header } from '../components/Header';
import { AuthView } from '../views/AuthView';
import { HomeView } from '../views/HomeView';
import { CatalogView } from '../views/CatalogView';
import { VehicleDetailsView } from '../views/VehicleDetailsView';
import { MyBookingsView } from '../views/MyBookingsView';
import { ProfileView } from '../views/ProfileView';
import { NotificationsView } from '../views/NotificationsView';

import { Loader2 } from 'lucide-react';
import { MyReservationsView } from '@/views/ReservationsView';

export default function ClientDashboard() {
  const[currentView, setCurrentView] = useState<string>('HOME');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const[, setDeferredPrompt] = useState<any>(null);

  // Ajout de l'état pour gérer le menu mobile du nouveau Header
  const [, setSidebarOpen] = useState(false);

  const[isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await authService.getUserMe();
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
  },[]);

  useEffect(() => {
    const handlePrompt = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handlePrompt);

    const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    setDarkMode(true);
  } else {
    document.documentElement.classList.remove('dark');
    setDarkMode(false);
  }


    const token = localStorage.getItem('auth_token');
    if (token) fetchProfile();
    else setIsLoading(false);

    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, [fetchProfile]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  }

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

  if (isLoading) return (
      <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14]">
        <Loader2 className="animate-spin text-[#0528d6] size-12" />
      </div>
  );

  if (!isAuth && currentView === 'AUTH') return (
      <AuthView onAuth={handleAuthAction} lang={lang} setLang={setLang} darkMode={darkMode} toggleTheme={() => toggleDarkMode()} />
  );

  return (
      <div className="min-h-screen bg-[#f4f7fe] dark:bg-[#0f1323] transition-colors duration-500 font-sans">
        <Header
            isAuth={isAuth}
            userData={userData}
            currentView={currentView}
            setCurrentView={setCurrentView}
            toggleTheme={() => toggleDarkMode()}
            darkMode={darkMode}
            lang={lang}
            setLang={setLang}
            setSidebarOpen={setSidebarOpen} // Passé au Header pour le menu mobile
            onLogout={() => { localStorage.removeItem('auth_token'); window.location.reload(); }}
        />

        {/* Ajustement du padding top (pt-28) pour compenser le Header fixed (h-20) */}
        <main className="max-w-7xl mx-auto p-6 md:p-10 pt-28 md:pt-28">
          {currentView === 'HOME' && <HomeView onSearch={() => setCurrentView('CATALOG')} setViewAll={() => setCurrentView('CATALOG')} onSelectVehicle={(id: string) => { setSelectedVehicleId(id); setCurrentView('DETAILS'); }} />}
          {currentView === 'CATALOG' && <CatalogView userData={userData} />}
          {currentView === 'DETAILS' && selectedVehicleId && <VehicleDetailsView vehicleId={selectedVehicleId} isAuth={isAuth} onBack={() => setCurrentView('CATALOG')} onAuthRequired={() => setCurrentView('AUTH')} onStartBooking={() => setCurrentView('CATALOG')} />}
          {currentView === 'MY_BOOKINGS' && <MyBookingsView userData={userData} />}
          {currentView === 'MY_RESERVATIONS' && <MyReservationsView userData={userData} />}
          {currentView === 'PROFILE' && <ProfileView userData={userData} onLogout={() => { localStorage.removeItem('auth_token'); window.location.reload(); }} />}

          {/* Utilisation de clientId au lieu de userData pour correspondre au composant */}
          {currentView === 'NOTIFICATIONS' && <NotificationsView clientId={userData?.id} />}
        </main>
        <Footer/>
      </div>
  );
}
