'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Download, Key, Moon, Sun, X,
  LogIn, LogOut, Loader2, Lock, Home
} from 'lucide-react';

import { fr } from '../locales/fr';
import { en } from '../locales/en';

interface AppNavbarProps {
  lang: 'FR' | 'EN';
  darkMode: boolean;
  isAuth: boolean;
  onLangToggle: () => void;
  onDarkModeToggle: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onInstall: () => void;
}

export function AppNavbar({
  lang,
  darkMode,
  isAuth,
  onLangToggle,
  onDarkModeToggle,
  onLogout,
  onLoginClick,
  onInstall,
}: AppNavbarProps) {
  const pathname = usePathname();
  const t = lang === 'FR' ? fr : en;

  const navLinks = [
    { href: '/dashboard', label: t.sidebar.dash },
    { href: '/listings', label: t.sidebar.listings },
    { href: '/bookings', label: t.sidebar.bookings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full h-20 bg-white/90 dark:bg-[#0f1323]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-[100] px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* RETOUR LANDING PAGE (3000) */}
        <a href="http://localhost:3000" className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2 group shadow-sm">
          <Home size={18} />
          <span className="hidden xl:block text-[8px] font-black uppercase tracking-widest leading-none">{t.nav.backHome}</span>
        </a>
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Key size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-[900] italic tracking-tighter uppercase text-blue-900 dark:text-white">
            Easy<span className="text-blue-600">Rental</span>
            <span className="text-[10px] ml-2 text-slate-400 not-italic">Agency</span>
          </span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-blue-600 transition-colors italic ${
              isActive(link.href)
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* BOUTON INSTALLATION PWA */}
        <button
          onClick={onInstall}
          className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest border border-transparent hover:border-blue-600 transition-all"
        >
          <Download size={14} /> {t.nav.install}
        </button>

        <button
          onClick={onLangToggle}
          className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase border border-transparent dark:border-slate-700"
        >
          {lang}
        </button>

        <button
          onClick={onDarkModeToggle}
          className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 border border-transparent dark:border-slate-700"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {isAuth ? (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-blue-600">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="u" />
            </div>
            <button onClick={onLogout} className="p-2 text-slate-300 hover:text-red-500">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 italic leading-none"
          >
            <LogIn size={14} /> {t.nav.login}
          </button>
        )}
      </div>
    </nav>
  );
}

// Auth Modal Component
interface AuthModalProps {
  show: boolean;
  email: string;
  password: string;
  authLoading: boolean;
  authError: string;
  lang: 'FR' | 'EN';
  onClose: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthModal({
  show,
  email,
  password,
  authLoading,
  authError,
  lang,
  onClose,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AuthModalProps) {
  const t = lang === 'FR' ? fr : en;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-blue-600 transition-colors">
          <X />
        </button>
        <h2 className="text-3xl font-[900] italic uppercase tracking-tighter mb-2">
          {t.auth.title}
        </h2>
        <p className="text-sm text-slate-400 mb-8">{t.auth.subtitle}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder={t.auth.email}
            className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold"
            required
          />
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder={t.auth.password}
              className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              required
            />
            <Lock className="absolute right-4 top-4 text-slate-300" size={20} />
          </div>
          {authError && (
            <p className="text-[10px] font-black text-red-500 uppercase text-center">{authError}</p>
          )}
          <button
            disabled={authLoading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-xl flex items-center justify-center"
          >
            {authLoading ? <Loader2 className="animate-spin" /> : t.auth.submit}
          </button>
        </form>
        <p className="mt-6 text-xs text-slate-400 text-center">{t.auth.noAccount}</p>
      </div>
    </div>
  );
}
