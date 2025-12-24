'use client';
import React, { useState, useEffect } from 'react';
import { X, Lock, Users, ShieldCheck, LayoutGrid } from 'lucide-react';
import { MFE_URLS } from '../config/mfe-urls';

export default function AuthModal({ isOpen, onClose, t, initialRole }: any) {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialRole) { setRole(initialRole); setStep('form'); }
    else { setStep('role'); }
  }, [initialRole, isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    // LOGIQUE DE REDIRECTION EXTERNE PAR DÉFAUT
    if (role === 'client' && email === 'client@gmail.com' && password === 'client') {
      window.location.href = MFE_URLS.client;
    } else if (role === 'agency' && email === 'personnel@gmail.com' && password === 'personnel') {
      window.location.href = MFE_URLS.agency;
    } else if (role === 'org' && email === 'organisation@gmail.com' && password === 'organisation') {
      window.location.href = MFE_URLS.organisation;
    } else {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-900/40 dark:bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/20 animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-blue-600"><X size={24} /></button>

        {step === 'role' ? (
          <div className="text-center">
            <h2 className="text-3xl font-[900] italic uppercase tracking-tighter mb-8">{t.auth.chooseRole}</h2>
            <div className="grid gap-4">
              {[
                { id: 'client', icon: <Users />, label: t.auth.roles.client, color: 'hover:border-blue-600' },
                { id: 'agency', icon: <ShieldCheck />, label: t.auth.roles.agency, color: 'hover:border-orange-500' },
                { id: 'org', icon: <LayoutGrid />, label: t.auth.roles.org, color: 'hover:border-blue-600' }
              ].map((r) => (
                <button key={r.id} onClick={() => { setRole(r.id); setStep('form'); }}
                  className={`flex items-center gap-6 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 transition-all ${r.color}`}>
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">{r.icon}</div>
                  <span className="text-lg font-black uppercase italic tracking-tighter">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-black uppercase text-blue-600 italic">
                {role === 'org' ? t.auth.roles.org : role === 'agency' ? t.auth.roles.agency : t.auth.roles.client}
              </span>
              <h2 className="text-4xl font-[900] italic uppercase tracking-tighter">{t.auth.loginTitle}</h2>
            </div>
            <div className="space-y-4 text-left">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder={t.auth.email} />
              <div className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder={t.auth.password} />
                <Lock size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{t.auth.error}</p>}
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-[900] uppercase italic text-lg shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700">
              {t.auth.submitLogin}
            </button>
            <button type="button" onClick={() => setStep('role')} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">← {t.auth.chooseRole}</button>
          </form>
        )}
      </div>
    </div>
  );
}