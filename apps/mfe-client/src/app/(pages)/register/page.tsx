'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, User, Mail, Lock } from 'lucide-react';
import { authService } from '@/services/authService';

interface InputGroupProps {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, icon, type = "text", value, onChange }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
        />
      </div>
    </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.register(formData);

      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        router.push('/dashboard');
      } else {
        setError(result.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Service indisponible. Vérifiez votre connexion.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Rejoindre EasyRent
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputGroup
                label="Prénom"
                icon={<User size={20} />}
                value={formData.firstname}
                onChange={(v) => setFormData({...formData, firstname: v})}
            />

            <InputGroup
                label="Nom"
                icon={<User size={20} />}
                value={formData.lastname}
                onChange={(v) => setFormData({...formData, lastname: v})}
            />

            <InputGroup
                label="Email"
                icon={<Mail size={20} />}
                type="email"
                value={formData.email}
                onChange={(v) => setFormData({...formData, email: v})}
            />

            <InputGroup
                label="Mot de passe"
                icon={<Lock size={20} />}
                type="password"
                value={formData.password}
                onChange={(v) => setFormData({...formData, password: v})}
            />

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Inscription en cours...
                  </>
              ) : (
                  "Créer mon compte"
              )}
            </button>
          </form>
        </div>
      </div>
  );
}