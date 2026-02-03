'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  Calendar,
  Heart,
  CreditCard,
  HelpCircle,
  LogOut,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { authApi, getAccessToken } from '@/services/api';

// Sidebar menu items
const menuItems = [
  { icon: User, label: 'Profile', href: '/profile', active: false },
  { icon: Settings, label: 'Paramètres', href: '/profile/settings', active: true },
  { icon: Calendar, label: 'Mes réservations', href: '/reservations', active: false },
  { icon: Heart, label: 'Mes favoris', href: '/favorites', active: false },
  { icon: CreditCard, label: 'Paiements', href: '/payments', active: false },
  { icon: HelpCircle, label: 'Aide & Support', href: '/help', active: false },
];

// Password strength levels
const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const strengthLabels = ['Faible', 'Moyen', 'Bon', 'Fort'];
const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Personal Info Form
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Mobina',
    lastName: 'Mirbagheri',
    status: 'Customer',
    age: '25',
  });

  // Contact Info Form
  const [contactInfo, setContactInfo] = useState({
    email: 'test@gmail.com',
    countryCode: '+237',
    phone: '620203233',
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promo: true,
    reminders: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          const userData = await authApi.getCurrentUser();
          setPersonalInfo({
            firstName: userData.firstName || 'Mobina',
            lastName: userData.lastName || 'Mirbagheri',
            status: userData.role || 'Customer',
            age: '25',
          });
          setContactInfo({
            email: userData.email || 'test@gmail.com',
            countryCode: '+237',
            phone: '620203233',
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    router.push('/');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!personalInfo.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!personalInfo.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    // Password validation
    if (passwordForm.newPassword) {
      if (!passwordForm.currentPassword) {
        newErrors.currentPassword = 'Le mot de passe actuel est requis';
      }
      if (passwordForm.newPassword.length < 8) {
        newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      console.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setHasChanges(false);
    router.push('/profile');
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const updateContactInfo = (field: string, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const updatePasswordForm = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Modifier le profil</h1>
              </div>
            </div>

            {/* Success Message */}
            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Check className="text-green-500" size={24} />
                <p className="text-green-800 font-medium">Modifications enregistrées avec succès!</p>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Personnel</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <input
                      type="text"
                      value={personalInfo.status}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Âge
                    </label>
                    <input
                      type="text"
                      value={personalInfo.age}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Contact</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => updateContactInfo('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={contactInfo.countryCode}
                        onChange={(e) => updateContactInfo('countryCode', e.target.value)}
                        className="w-20 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => updateContactInfo('phone', e.target.value)}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Sécurité</h2>

              <div className="grid lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => updatePasswordForm('currentPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => updatePasswordForm('newPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordForm.newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Force: {strengthLabels[passwordStrength - 1] || 'Très faible'}
                      </p>
                    </div>
                  )}
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => updatePasswordForm('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <ul className="mt-4 text-sm text-gray-500 space-y-1">
                <li className="flex items-center gap-2">
                  <Check size={14} className={passwordForm.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'} />
                  Au moins 8 caractères
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className={/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-500' : 'text-gray-300'} />
                  Une lettre majuscule
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className={/[0-9]/.test(passwordForm.newPassword) ? 'text-green-500' : 'text-gray-300'} />
                  Un chiffre
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className={/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'text-green-500' : 'text-gray-300'} />
                  Un caractère spécial
                </li>
              </ul>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Préférences de notification</h2>

              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Notifications par email' },
                  { key: 'sms', label: 'Notifications par SMS' },
                  { key: 'promo', label: 'Emails promotionnels' },
                  { key: 'reminders', label: 'Rappels de réservation' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700">{item.label}</span>
                    <div
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => {
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof notifications],
                        }));
                        setHasChanges(true);
                      }}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                        }`}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8 border border-red-200">
              <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} />
                Zone dangereuse
              </h2>

              <p className="text-gray-600 mb-4">
                Ces actions sont irréversibles. Procédez avec prudence.
              </p>

              <div className="flex gap-4">
                <button className="px-6 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                  Désactiver le compte
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 size={18} />
                  Supprimer le compte
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
