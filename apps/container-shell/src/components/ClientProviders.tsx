'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { fr } from '../locales/fr';
import { en } from '../locales/en';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mounted, setMounted] = useState(false);

  const t = lang === 'FR' ? fr : en;

  useEffect(() => {
    setMounted(true);
    
    // Theme Sync
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    // PWA Logic
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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

  // On évite le flash de contenu non stylisé (hydration mismatch)
  if (!mounted) {
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <>
      <Navbar 
        t={t} 
        lang={lang} 
        onLangToggle={() => setLang(l => l === 'FR' ? 'EN' : 'FR')}
        darkMode={darkMode} 
        onThemeToggle={toggleTheme}
        onInstall={handleInstallApp}
      />
      <main className="min-h-screen flex flex-col pt-20">
        {children}
      </main>
      <Footer t={t.footer} nav={t.nav} />
    </>
  );
}