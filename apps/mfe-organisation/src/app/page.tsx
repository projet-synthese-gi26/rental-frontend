// FILE: apps/mfe-organisation/src/app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { agencyService, authService } from '@pwa-easy-rental/shared-services';

import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AuthView } from '../views/AuthView';
import { DashboardView } from '../views/DashboardView';
import { AgenciesView } from '../views/AgenciesView';
import { RolesView } from '../views/RolesView';
import { StaffView } from '../views/StaffView';
import { VehiclesView } from '../views/VehiclesView';
import { VehicleCategoriesView } from '../views/VehicleCategoriesView';
import { SubscriptionView } from '../views/SubscriptionView';
import { ProfileView } from '../views/ProfileView';
import { NotificationsView } from '../views/NotificationsView';
import { OnboardingStepper } from '../components/OnboardingStepper';

import { Loader2 } from 'lucide-react';
import { fr } from '../locales/fr';
import { en } from '../locales/en';
import { ReservationsView } from '@/views/ReservationsView';
import { RentalsView } from '@/views/RentalsView';
import { TransactionsView } from '@/views/TransactionsView';

export default function OrganisationDashboard() {
  const [currentView, setCurrentView] = useState<string>('DASHBOARD');
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);
  const [agencies, setAgencies] = useState<any[]>([]);

  const t = lang === 'FR' ? fr : en;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => { 
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    const token = localStorage.getItem('auth_token');
    if (token) fetchProfile();
    else setIsLoading(false);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  },[]);

  const fetchProfile = async () => {
    try {
      const meRes = await authService.getOrgUserMe();
      if (meRes.ok && meRes.data) {
        const { user, organization } = meRes.data;
        if (organization) {
          setOrgData(organization);
          setUserData(user);
          setIsOnboarded(organization.city && organization.city !== "string");
          const agRes = await agencyService.getAgencies(organization.id);
          if (agRes.ok) setAgencies(agRes.data ||[]);
          setIsAuth(true);
        }
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (e) {
      console.error("Erreur de profil:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthAction = async (isSignUp: boolean, form: any) => {
    try {
      let res;
      if (isSignUp) {
        res = await authService.registerOrg(form);
        if (res.ok) {
          const logRes = await authService.login({ email: form.email, password: form.password });
          if (logRes.ok && logRes.data.token) {
            localStorage.setItem('auth_token', logRes.data.token);
            await fetchProfile();
            return true;
          }
        }
      } else {
        res = await authService.login({ email: form.email, password: form.password });
        if (res.ok && res.data.token) {
          localStorage.setItem('auth_token', res.data.token);
          await fetchProfile();
          return true;
        }
      }
    } catch (e) { console.error("Auth error", e); }
    return false;
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14]"><Loader2 className="animate-spin text-[#0528d6] size-12" /></div>;
  if (!isAuth) return <AuthView onAuth={handleAuthAction} lang={lang} setLang={setLang} darkMode={darkMode} toggleTheme={toggleTheme} />;
  if (!isOnboarded) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14] p-6"><OnboardingStepper orgId={orgData?.id} initialName={orgData?.name} onComplete={() => { setIsOnboarded(true); fetchProfile(); }} onLogout={() => { localStorage.removeItem('auth_token'); window.location.reload(); }} t={t} /></div>;

  return (
    <div className="flex h-screen bg-white dark:bg-[#080b14] overflow-hidden transition-colors duration-500">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleInstall={() => deferredPrompt?.prompt()} handleLogout={() => { localStorage.removeItem('auth_token'); window.location.reload(); }} />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header title={currentView} setCurrentView={setCurrentView} orgData={orgData} lang={lang} setLang={setLang} darkMode={darkMode} toggleTheme={toggleTheme} setSidebarOpen={setSidebarOpen} onInstall={() => deferredPrompt?.prompt()} hasPrompt={!!deferredPrompt} t={t} />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f7fe] dark:bg-[#0f1323] custom-scrollbar text-left">
          <div className="max-w-[1600px] mx-auto">
            {currentView === 'DASHBOARD' && <DashboardView orgData={orgData} t={t} />}
            {currentView === 'RESERVATIONS' && <ReservationsView orgData={orgData} />}
            {currentView === 'RENTALS' && <RentalsView orgData={orgData} />}
            {currentView === 'TRANSACTIONS' && <TransactionsView orgData={orgData} />}
            {currentView === 'AGENCIES' && <AgenciesView orgData={orgData} setCurrentView={setCurrentView} />}
            {currentView === 'ROLES' && <RolesView orgData={orgData} />}
            {currentView === 'STAFF' && <StaffView orgData={orgData} />}
            {currentView === 'VEHICLES' && <VehiclesView orgData={orgData} />}
            {currentView === 'CATEGORIES' && <VehicleCategoriesView orgData={orgData} />}
            {currentView === 'SUBSCRIPTION' && <SubscriptionView orgData={orgData} />}
            {currentView === 'PROFILE' && <ProfileView orgData={orgData} userData={userData} onUpdate={fetchProfile} />}
            {currentView === 'NOTIFICATIONS' && <NotificationsView orgId={orgData?.id} />}
          </div>
        </div>
      </main>
    </div>
  );
}