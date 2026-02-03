/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { authService, orgService } from '@pwa-easy-rental/shared-services';

// Components & Views
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
import { OnboardingStepper } from '../components/OnboardingStepper';

// UI
import { Loader2 } from 'lucide-react';
import { fr } from '../locales/fr';
import { en } from '../locales/en';

export default function OrganisationDashboard() {
  // --- STATES DE NAVIGATION & THÈME ---
  const [currentView, setCurrentView] = useState<string>('DASHBOARD');
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // --- STATES DE DONNÉES (RÉELLES) ---
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);
  const [agencies, setAgencies] = useState<any[]>([]);

  const t = lang === 'FR' ? fr : en;

  // --- INITIALISATION ---
  useEffect(() => {
    // 1. PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => { 
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. Gestion du Thème
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    // 3. Vérification Session
    const token = localStorage.getItem('auth_token');
    if (token) fetchProfile();
    else setIsLoading(false);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // --- RÉCUPÉRATION DES DONNÉES (ZÉRO MOCKUP) ---
  const fetchProfile = async () => {
    try {
      const meRes = await orgService.getMe();
      if (meRes.ok && meRes.data) {
        // meRes.data = { user, organization } selon OrgUserResponseDTO
        const { user, organization } = meRes.data;

        if (organization) {
          setOrgData(organization);
          setUserData(user);
          
          // Vérification onboarding : si la ville est renseignée, on considère l'étape passée
          setIsOnboarded(organization.city && organization.city !== "string");
          
          // Chargement des données périphériques
          const agRes = await orgService.getAgencies(organization.id);
          if (agRes.ok) setAgencies(agRes.data || []);
          
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

  // --- ACTIONS AUTHENTIFICATION ---
  const handleAuthAction = async (isSignUp: boolean, form: any) => {
    try {
      let res;
      if (isSignUp) {
        res = await authService.registerOrg(form);
        if (res.ok) {
          // Auto-login après inscription
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
    } catch (e) {
      console.error("Auth error", e);
    }
    return false; // Retourne false pour que AuthView affiche l'erreur
  };

  const handleOnboardingComplete = async () => {
    setIsOnboarded(true);
    await fetchProfile();
  };

  const logout = () => { 
    localStorage.removeItem('auth_token'); 
    window.location.reload(); 
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert(t.installNotice);
    }
  };

  // --- RENDU : CHARGEMENT ---
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14]">
      <Loader2 className="animate-spin text-[#0528d6] size-12" />
    </div>
  );

  // --- RENDU : ÉCRAN AUTHENTIFICATION ---
  if (!isAuth) return (
    <AuthView 
      onAuth={handleAuthAction}
      lang={lang}
      setLang={setLang}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );

  // --- RENDU : ÉCRAN ONBOARDING ---
  if (!isOnboarded) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fe] dark:bg-[#080b14] p-6">
      <OnboardingStepper 
        orgId={orgData?.id} 
        initialName={orgData?.name} 
        onComplete={handleOnboardingComplete} 
        onLogout={logout} // On passe la fonction ici
        t={t} 
      />
    </div>
  );

  // --- RENDU : DASHBOARD PRINCIPAL ---
  return (
    <div className="flex h-screen bg-white dark:bg-[#080b14] overflow-hidden transition-colors duration-500">
      
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        handleInstall={handleInstall} 
        handleLogout={logout}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
            title={(t.views as any)[currentView] || currentView}
            setCurrentView={setCurrentView}
            orgData={orgData} 
            lang={lang} 
            setLang={setLang}
            darkMode={darkMode} 
            toggleTheme={toggleTheme}
            setSidebarOpen={setSidebarOpen} 
            onInstall={handleInstall}
            hasPrompt={!!deferredPrompt} 
            t={t}
        />

        {/* Zone de contenu avec fond gris technique Google Pro */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f7fe] dark:bg-[#0f1323] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {currentView === 'DASHBOARD' && <DashboardView orgData={orgData} agencies={agencies} t={t} />}
            {currentView === 'AGENCIES' && <AgenciesView orgData={orgData} setCurrentView={setCurrentView} />}
            {currentView === 'ROLES' && <RolesView orgData={orgData} />}
            {currentView === 'STAFF' && <StaffView orgData={orgData} />}
            {currentView === 'VEHICLES' && <VehiclesView orgData={orgData} t={t} />}
            {currentView === 'CATEGORIES' && <VehicleCategoriesView orgData={orgData} />}
            {currentView === 'SUBSCRIPTION' && <SubscriptionView orgData={orgData} t={t} />}
            {currentView === 'PROFILE' && <ProfileView orgData={orgData} userData={userData} />}
          </div>
        </div>
      </main>
    </div>
  );
}