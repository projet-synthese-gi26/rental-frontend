'use client';
import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Solutions } from '../components/Solutions';
import { Features } from '../components/Features';
// import { Pricing } from '../components/Pricing';
import { fr } from '../locales/fr';
import { en } from '../locales/en';
import Testimonial from '@/components/testimonial';
import { MFE_URLS } from '../config/mfe-urls';
import Link from 'next/link';

export default function LandingPage() {
  const [, setDarkMode] = useState(false);
  const [lang,] = useState<'FR' | 'EN'>('FR');
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


  const handleInstallApp = async () => {
    console.log('Install App clicked');
    
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

      <Testimonial/>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-blue-600 rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 overflow-hidden shadow-[0_40px_80px_-15px_rgba(5,40,214,0.3)]">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 -skew-x-12 translate-x-1/2" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-50" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div className="text-left">
                <h2 className="text-4xl md:text-6xl font-[900] italic leading-[0.9] tracking-tighter text-white mb-6 uppercase">
                  Prêt à prendre <br /> la <span className="text-orange-400">Route ?</span>
                </h2>
                <p className="text-blue-100 text-lg font-medium max-w-md leading-relaxed">
                  Réservez votre véhicule en moins de 2 minutes et profitez de l&apos;expérience PWA Easy Rental.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link
                  href={MFE_URLS.client}
                  className="inline-flex items-center justify-center bg-white text-blue-600 px-10 py-5 rounded-[2rem] font-black text-sm uppercase italic hover:scale-105 transition-transform shadow-xl"
                >
                  Explorer le catalogue
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center bg-blue-700 text-white border border-blue-500 px-10 py-5 rounded-[2rem] font-black text-sm uppercase italic hover:bg-blue-800 transition-colors"
                >
                  Besoin d&apos;aide ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}