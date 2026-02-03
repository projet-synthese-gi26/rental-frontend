'use client';
import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Solutions } from '../components/Solutions';
import { Features } from '../components/Features';
// import { Pricing } from '../components/Pricing';
import { fr } from '../locales/fr';
import { en } from '../locales/en';

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const t = lang === 'FR' ? fr : en;

  useEffect(() => {
    // 1. Theme Sync
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    // 2. PWA Logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert(t.hero.installNotice);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white font-sans transition-colors duration-300">

      <Hero t={t.hero} onInstall={handleInstallApp} />

      <Solutions t={t.stakeholders} />

      <Features t={t.features} />

      {/* <Pricing t={t.pricing} /> */}


    </div>
  );
}