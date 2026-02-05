"use client"; // <--- THIS IS REQUIRED

// import type { Metadata, Viewport } from 'next';
import './globals.css';
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

// NOTE: Metadata must be in a separate file or 
// this component must be split if you want SEO metadata 
// because "use client" components cannot export metadata.

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent|null>(null);
  const [mounted, setMounted] = useState(false); // Fix hydration

  const t = lang === 'FR' ? fr : en;

  useEffect(() => {
    setMounted(true);
    
    // 1. Theme Sync
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    // 2. PWA Logic
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

  const handleInstallApp = async (): Promise<void> => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert(t.hero.installNotice);
    }
  };

  // Prevent hydration UI mismatch
  if (!mounted) return null; 

  return (
    <html lang={lang.toLowerCase()} className="scroll-smooth">
      <body className="bg-white dark:bg-[#0f1323] transition-colors duration-300 overflow-y-auto">
        <Navbar 
          t={t} 
          lang={lang} 
          onLangToggle={() => setLang(l => l === 'FR' ? 'EN' : 'FR')}
          darkMode={darkMode} 
          onThemeToggle={toggleTheme}
          onInstall={handleInstallApp}
        />
        <main>{children}</main>
        <Footer t={t.footer} nav={t.nav} />
      </body>
    </html>
  );
}