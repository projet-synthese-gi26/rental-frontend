/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { agencyService, authService, driverService, orgService, vehicleService } from '@pwa-easy-rental/shared-services';

import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AuthView } from '../views/AuthView';
import { DashboardView } from '../views/DashboardView';
import { ProfileView } from '../views/ProfileView';
import { VehiclesView } from '@/views/VehiclesView';
import { DriversView } from '@/views/DriversView';
import { Loader2 } from 'lucide-react';

export default function AgencyDashboard() {
  const [currentView, setCurrentView] = useState<string>('DASHBOARD');
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [agencyData, setAgencyData] = useState<any>(null);
  const [parentOrg, setParentOrg] = useState<any>(null);

  // Stats pour le Dashboard
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0 });

  const fetchContext = useCallback(async () => {
    try {
      const meRes = await authService.getMe();
      if (meRes.ok && meRes.data) {
        const user = meRes.data;
        setUserData(user);

        if (user.agencyId) {
          const [agencyRes, orgRes, vehRes, drivRes] = await Promise.all([
            agencyService.getAgencyDetails(user.agencyId),
            orgService.getOrgDetails(user.organizationId),
            vehicleService.getVehiclesByAgency(user.agencyId),
            driverService.getDriversByAgency(user.agencyId)
          ]);
          
          if (agencyRes.ok) setAgencyData(agencyRes.data);
          if (orgRes.ok) setParentOrg(orgRes.data);
          
          // Mise à jour des compteurs réels
          setStats({
            vehicles: vehRes.data?.length || 0,
            drivers: drivRes.data?.length || 0
          });
          
          setIsAuth(true);
        } else {
          localStorage.removeItem('auth_token');
          setIsAuth(false);
        }
      } else {
        localStorage.removeItem('auth_token');
        setIsAuth(false);
      }
    } catch (e) {
      console.error("Erreur contexte agency", e);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    const token = localStorage.getItem('auth_token');
    if (token) fetchContext();
    else setIsLoading(false);
  }, [fetchContext]);

  const handleAuth = async (form: any) => {
    try {
      const res = await authService.login(form);
      if (res.ok && res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
        await fetchContext();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
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
    <AuthView 
      onAuth={handleAuth}
      lang={lang}
      setLang={setLang}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );

  return (
    <div className="flex h-screen bg-white dark:bg-[#080b14] overflow-hidden transition-colors duration-500">
      
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        handleLogout={() => { localStorage.removeItem('auth_token'); window.location.reload(); }}
        parentOrg={parentOrg}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative text-left">
        <Header 
            title={currentView === 'DASHBOARD' ? "Vue d'ensemble" : currentView === 'PROFILE' ? 'Mon Profil' : currentView}
            userData={userData}
            agencyData={agencyData}
            lang={lang} 
            setLang={setLang}
            darkMode={darkMode} 
            toggleTheme={toggleTheme}
            setSidebarOpen={setSidebarOpen}
            setCurrentView={setCurrentView}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f7fe] dark:bg-[#0f1323] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {currentView === 'DASHBOARD' && <DashboardView userData={userData} agencyData={agencyData} stats={stats} />}
            {currentView === 'PROFILE' && <ProfileView userData={userData} agencyData={agencyData} parentOrg={parentOrg} />}
            {currentView === 'VEHICLES' && <VehiclesView userData={userData} />}
            {currentView === 'DRIVERS' && <DriversView userData={userData} />}
          </div>
        </div>
      </main>
    </div>
  );
}