'use client';

import './globals.css';
import React, { useState, useEffect } from 'react';
import { AppNavbar, AuthModal } from '@/components/AppNavbar';
import { authService } from '@/services/authService';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const [lang, setLang] = useState<'FR' | 'EN'>('FR');
    const [darkMode, setDarkMode] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent|null>(null);

    // Load preferences from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('client-lang') as 'FR' | 'EN';
        const savedDark = localStorage.getItem('client-darkMode') === 'true';
        const savedAuth = localStorage.getItem('client-isAuth') === 'true';

        if (savedLang) setLang(savedLang);
        if (savedDark) setDarkMode(savedDark);
        if (savedAuth) setIsAuth(savedAuth);
    }, []);

    // Apply dark mode to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('client-darkMode', String(darkMode));
    }, [darkMode]);

    // PWA install prompt
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleLangToggle = () => {
        const newLang = lang === 'FR' ? 'EN' : 'FR';
        setLang(newLang);
        localStorage.setItem('client-lang', newLang);
    };

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = () => {
        setIsAuth(false);
        localStorage.removeItem('client-isAuth');
        localStorage.removeItem('auth_token');
    };

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');

        try {
            const result = await authService.login({ email, password });

            if (result.token) {
                localStorage.setItem('auth_token', result.token);
                setIsAuth(true);
                localStorage.setItem('client-isAuth', 'true');
                setShowAuthModal(false);
                setEmail('');
                setPassword('');
            } else {
                setAuthError(lang === 'FR'
                    ? 'Identifiants incorrects'
                    : 'Invalid credentials');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : (lang === 'FR'
                ? 'Service indisponible'
                : 'Service unavailable');
            setAuthError(message);
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <html lang="fr" suppressHydrationWarning>
        <head>
            <title>PWA Easy Rental</title>
            <meta name="description" content="Location digitale sans frontières" />
            <link rel="manifest" href="/client/manifest.json" />
            <meta name="theme-color" content="#0528d6" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </head>
        <body className="min-h-screen bg-white dark:bg-[#0f1323] transition-colors duration-300 m-0 p-0">
        <AppNavbar
            lang={lang}
            darkMode={darkMode}
            isAuth={isAuth}
            onLangToggle={handleLangToggle}
            onDarkModeToggle={handleDarkModeToggle}
            onLogout={handleLogout}
            onLoginClick={() => { setIsSignUp(false); setShowAuthModal(true); }}
            onInstall={handleInstall}
        />
        <main>{children}</main>
        <AuthModal
            show={showAuthModal}
            // isSignUp={isSignUp}
            email={email}
            password={password}
            authLoading={authLoading}
            authError={authError}
            lang={lang}
            onClose={() => setShowAuthModal(false)}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleAuthSubmit}
            // onToggleMode={() => setIsSignUp(!isSignUp)}
        />
        </body>
        </html>
    );
}