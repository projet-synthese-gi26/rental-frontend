/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '@pwa-easy-rental/shared-services';

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
import { defaultClient } from '@shared-services/api/api-client';

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
        if (user) {
          setOrgData(organization);
          setUserData(user);
          // Onboarding check
          setIsOnboarded(organization && organization.city && organization.city !== "string");
          setIsAuth(true);
          return true;
        }
      }
      // Si on arrive ici, c'est que l'appel a échoué
      localStorage.removeItem('auth_token');
      setIsAuth(false);
      return false;
    } catch (e) {
      console.error("Erreur profile:", e);
      setIsAuth(false);
      return false;
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
      let loginRes;
      if (isSignUp) {
        const regRes = await authService.registerOrg(form);
        if (!regRes.ok) return false;
        loginRes = await authService.login({ email: form.email, password: form.password });
      } else {
        loginRes = await authService.login({ email: form.email, password: form.password });
      }

      if (loginRes.ok && loginRes.data.token) {
        const token = loginRes.data.token;
        
        // 1. Mise à jour PRIORITAIRE de l'instance API en mémoire
        defaultClient.setAuthToken(token);
        
        // 2. Sauvegarde persistante
        localStorage.setItem('auth_token', token);
        
        // 3. Récupération du profil et attente de la validation
        const success = await fetchProfile();
        return success; // Si fetchProfile échoue, handleAuthAction renvoie false
      }
      return false;
    } catch (e) { 
      console.error("Auth process error", e); 
      return false;
    }
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
          title={t.views[currentView as 'DASHBOARD' || 'AGENCIES' || 'ROLES' || 'STAFF' || 'SUBSCRIPTION'] || currentView} 
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
            {currentView === 'DASHBOARD' && <DashboardView orgData={orgData} t={t} />}
            {currentView === 'RESERVATIONS' && <ReservationsView orgData={orgData} t={t} />}
            {currentView === 'RENTALS' && <RentalsView orgData={orgData} t={t} />}
            {currentView === 'TRANSACTIONS' && <TransactionsView orgData={orgData} t={t} />}
            {currentView === 'AGENCIES' && <AgenciesView orgData={orgData} setCurrentView={setCurrentView} t={t} />}
            {currentView === 'ROLES' && <RolesView orgData={orgData} t={t} />}
            {currentView === 'STAFF' && <StaffView orgData={orgData} t={t} />}
            {currentView === 'VEHICLES' && <VehiclesView orgData={orgData} t={t} />}
            {currentView === 'CATEGORIES' && <VehicleCategoriesView orgData={orgData} t={t} />}
            {currentView === 'SUBSCRIPTION' && <SubscriptionView orgData={orgData} t={t} />}
            {currentView === 'PROFILE' && <ProfileView orgData={orgData} userData={userData} onUpdate={fetchProfile} t={t} />}
            {currentView === 'NOTIFICATIONS' && <NotificationsView orgId={orgData?.id} t={t} />}
          </div>
        </div>
      </main>
    </div>
  );
}