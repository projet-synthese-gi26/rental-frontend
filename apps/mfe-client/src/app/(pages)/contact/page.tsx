'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// Subject options
const subjectOptions = [
  { value: '', label: 'Sélectionner un sujet' },
  { value: 'general', label: 'Demande générale' },
  { value: 'booking', label: 'Support réservation' },
  { value: 'technical', label: 'Problème technique' },
  { value: 'feedback', label: 'Feedback' },
];

// FAQ data
const faqs = [
  {
    question: 'Comment puis-je réserver un véhicule?',
    answer: 'Vous pouvez réserver un véhicule directement sur notre site en sélectionnant vos dates et le véhicule souhaité.',
  },
  {
    question: 'Quels sont les documents nécessaires?',
    answer: 'Vous aurez besoin d\'une pièce d\'identité valide et d\'un permis de conduire en cours de validité.',
  },
  {
    question: 'Puis-je annuler ma réservation?',
    answer: 'Oui, l\'annulation est gratuite jusqu\'à 24h avant la prise en charge du véhicule.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const clearForm = () => {
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setErrors({});
    setSubmitStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <div>
                    <p className="font-semibold text-green-800">Message envoyé avec succès!</p>
                    <p className="text-green-600 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <div>
                    <p className="font-semibold text-red-800">Erreur d&apos;envoi</p>
                    <p className="text-red-600 text-sm">Veuillez réessayer plus tard.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider?"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Effacer
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Informations de contact</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600">123 Avenue Kennedy<br />Yaoundé, Cameroun</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Téléphone</p>
                    <a href="tel:+237222123456" className="text-blue-600 hover:underline">
                      +237 222 123 456
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:contact@easyrent.cm" className="text-blue-600 hover:underline">
                      contact@easyrent.cm
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Heures d&apos;ouverture</p>
                    <p className="text-gray-600">Lun - Sam: 8h00 - 18h00</p>
                    <p className="text-gray-600">Dim: Fermé</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6 pt-6 border-t">
                <p className="font-semibold text-gray-900 mb-4">Suivez-nous</p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Urgent Contact */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-bold text-orange-800 mb-2">Besoin d&apos;aide urgente?</h3>
              <p className="text-orange-700 mb-4">
                Notre équipe est disponible 24/7 pour les urgences.
              </p>
              <a
                href="tel:+237699123456"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                +237 699 123 456
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="font-bold text-green-800">Temps de réponse</h3>
              </div>
              <p className="text-green-700">
                Nous répondons généralement dans les 24 heures ouvrées.
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-900">Notre localisation</h3>
              </div>
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Carte interactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
