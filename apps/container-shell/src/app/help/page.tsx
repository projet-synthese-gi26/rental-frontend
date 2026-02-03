'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle, HelpCircle, ShieldCheck, CreditCard } from 'lucide-react';

const faqData = [
    {
        category: "Réservation & Location",
        icon: <HelpCircle className="text-orange-500"/>,
        items: [
            { q: "Comment réserver un véhicule ?", a: "Il suffit de créer un compte, de choisir le véhicule souhaité dans la section 'Cars', de sélectionner vos dates et de cliquer sur 'Book Now'." },
            { q: "Puis-je modifier ma réservation ?", a: "Oui, vous pouvez modifier votre réservation jusqu'à 24h avant le début de la location via votre espace client." },
        ]
    },
    {
        category: "Paiement & Tarifs",
        icon: <CreditCard className="text-orange-500"/>,
        items: [
            { q: "Quels sont les moyens de paiement acceptés ?", a: "Nous acceptons Mobile Money (Orange/MTN), les cartes bancaires et les virements pour les organisations." },
            { q: "La caution est-elle remboursable ?", a: "Absolument. La caution est débloquée 48h après la restitution du véhicule si aucun dommage n'est constaté." },
        ]
    },
    {
        category: "Assurance & Sécurité",
        icon: <ShieldCheck className="text-orange-500"/>,
        items: [
            { q: "Les véhicules sont-ils assurés ?", a: "Oui, tous nos véhicules partenaires disposent d'une assurance tous risques valide." },
            { q: "Que faire en cas de panne ?", a: "Contactez immédiatement notre support d'urgence disponible 24/7 via le bouton SOS de l'application." },
        ]
    }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-slate-800 font-sans">

      {/* Hero Search */}
      <section className="bg-white/90 dark:bg-[#0f1323]/90 py-20 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Comment pouvons-nous vous aider ?</h1>
        <div className="max-w-2xl mx-auto relative">
            <input 
                type="text" 
                placeholder="Rechercher une question (ex: annulation, chauffeur...)" 
                className="w-full py-4 pl-12 pr-4 rounded-full shadow-lg outline-none text-slate-700 focus:ring-4 focus:ring-orange-500/30 transition"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {faqData.map((cat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        {cat.icon}
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">{cat.category}</h3>
                </div>
            ))}
        </div>

        {/* Accordion Questions */}
        <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Questions Fréquentes</h2>
            
            {faqData.map((cat, catIdx) => (
                <div key={catIdx}>
                    <h3 className="text-orange-500 font-bold uppercase text-sm tracking-wider mb-3 mt-8">{cat.category}</h3>
                    {cat.items.map((item, itemIdx) => {
                        const id = `${catIdx}-${itemIdx}`;
                        const isOpen = openIndex === id;
                        return (
                            <div key={itemIdx} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-3">
                                <button 
                                    onClick={() => toggleFAQ(id)}
                                    className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-700 hover:bg-gray-50 transition"
                                >
                                    {item.q}
                                    {isOpen ? <ChevronUp className="text-blue-600"/> : <ChevronDown className="text-gray-400"/>}
                                </button>
                                {isOpen && (
                                    <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </section>

      {/* Contact Footer Banner */}
      <section className="bg-slate-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Vous ne trouvez pas votre réponse ?</h2>
            <div className="flex flex-col md:flex-row justify-center gap-6">
                <a href="#" className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition">
                    <MessageCircle size={20}/> Chat en direct
                </a>
                <a href="mailto:rentalreseau01@gmail.com" className="flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-gray-100 px-6 py-3 rounded-lg transition">
                    <Mail size={20}/> Envoyer un email
                </a>
                <a href="#" className="flex items-center justify-center gap-3 border border-gray-600 hover:border-white px-6 py-3 rounded-lg transition">
                    <Phone size={20}/> +237 600 000 000
                </a>
            </div>
        </div>
      </section>
    </main>
  );
}