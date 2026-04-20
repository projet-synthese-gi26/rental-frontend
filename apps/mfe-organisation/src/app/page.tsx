/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
import { ReservationsView } from '../views/ReservationsView';
import { RentalsView } from '../views/RentalsView';
import { TransactionsView } from '../views/TransactionsView';

import { Loader2 } from 'lucide-react';
import { fr } from '../locales/fr';
import { en } from '../locales/en';
import { hasPermission } from '../utils/permissions';

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

  const t = lang === 'FR' ? fr : en;

  const fetchProfile = useCallback(async () => {
    try {
      const meRes = await authService.getOrgUserMe();
      if (meRes.ok && meRes.data) {
        const { user, organization } = meRes.data;
        if (organization) {
          setOrgData(organization);
          setUserData(user);
          // On considère onboardé si la ville est renseignée (OrgUpdateDTO requis)
          setIsOnboarded(organization.city && organization.city !== "string");
          setIsAuth(true);
        }
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (e) {
      console.error("Erreur profile:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  }, [fetchProfile]);

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

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14]">
      <Loader2 className="animate-spin text-[#0528d6] size-12" />
    </div>
  );

  if (!isAuth) return (
    <AuthView onAuth={handleAuthAction} lang={lang} setLang={setLang} darkMode={darkMode} toggleTheme={toggleTheme} t={t} />
  );

  if (!isOnboarded) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14] p-6">
      <OnboardingStepper 
        orgId={orgData?.id} 
        initialName={orgData?.name} 
        onComplete={() => { setIsOnboarded(true); fetchProfile(); }} 
        onLogout={() => { localStorage.removeItem('auth_token'); window.location.reload(); }} 
        t={t} 
      />
    </div>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-[#080b14] overflow-hidden transition-colors duration-500">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        handleInstall={() => deferredPrompt?.prompt()} 
        handleLogout={() => { localStorage.removeItem('auth_token'); window.location.reload(); }} 
        userData={userData}
        t={t}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          title={t.views[currentView] || currentView} 
          setCurrentView={setCurrentView} 
          orgData={orgData} 
          lang={lang} 
          setLang={setLang} 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          setSidebarOpen={setSidebarOpen} 
          onInstall={() => deferredPrompt?.prompt()} 
          hasPrompt={!!deferredPrompt} 
          t={t} 
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f4f7fe] dark:bg-[#0f1323] custom-scrollbar text-left">
          <div className="max-w-[1600px] mx-auto">
            {currentView === 'DASHBOARD' && hasPermission(userData, 'stats:dashboard') && <DashboardView orgData={orgData} t={t} />}
            {currentView === 'RESERVATIONS' && hasPermission(userData, 'rental:list') && <ReservationsView orgData={orgData} t={t} />}
            {currentView === 'RENTALS' && hasPermission(userData, 'rental:list') && <RentalsView orgData={orgData} t={t} />}
            {currentView === 'TRANSACTIONS' && hasPermission(userData, 'finance:transactions') && <TransactionsView orgData={orgData} t={t} />}
            {currentView === 'AGENCIES' && hasPermission(userData, 'agency:view') && <AgenciesView orgData={orgData} setCurrentView={setCurrentView} t={t} />}
            {currentView === 'ROLES' && (userData.role === 'ORGANIZATION_OWNER' || userData.role === 'ADMIN') && <RolesView orgData={orgData} t={t} />}
            {currentView === 'STAFF' && hasPermission(userData, 'staff:list') && <StaffView orgData={orgData} t={t} />}
            {currentView === 'VEHICLES' && hasPermission(userData, 'vehicle:list') && <VehiclesView orgData={orgData} t={t} />}
            {currentView === 'CATEGORIES' && hasPermission(userData, 'category:manage') && <VehicleCategoriesView orgData={orgData} t={t} />}
            {currentView === 'SUBSCRIPTION' && (userData.role === 'ORGANIZATION_OWNER') && <SubscriptionView orgData={orgData} t={t} />}
            {currentView === 'PROFILE' && <ProfileView orgData={orgData} userData={userData} onUpdate={fetchProfile} t={t} />}
            {currentView === 'NOTIFICATIONS' && <NotificationsView orgId={orgData?.id} t={t} />}
          </div>
        </div>
      </main>
    </div>
  );
}