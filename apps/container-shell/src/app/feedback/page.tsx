'use client';

import React, { useState } from 'react';
import { Star, Send, ThumbsUp, MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50 text-slate-800 font-sans mt-20">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Votre avis compte énormément pour nous</h1>
        <p className="text-blue-100 max-w-2xl mx-auto">
          {"Aidez-nous à améliorer Easy-Rent. Que vous soyez client, agent ou une organisation, votre retour d'expérience est précieux."}
        </p>
      </section>

      <section className="container mx-auto">
        <div className="bg-white  mx-auto overflow-hidden flex flex-col md:flex-row">
          
          {/* Côté Gauche : Info */}
          <div className="md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-bold mb-6">Pourquoi donner votre avis ?</h3>
                <ul className="space-y-6">
                    <li className="flex items-start gap-3">
                        <ThumbsUp className="text-orange-500 w-6 h-6 mt-1"/>
                        <p className="text-sm text-gray-300">Amélioration continue de nos services de location.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <Star className="text-orange-500 w-6 h-6 mt-1"/>
                        <p className="text-sm text-gray-300">Mise en avant des meilleurs agents et agences.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <MessageSquare className="text-orange-500 w-6 h-6 mt-1"/>
                        <p className="text-sm text-gray-300">Support réactif à vos besoins spécifiques.</p>
                    </li>
                </ul>
            </div>
            <div className="mt-12 text-sm text-gray-500">
                © 2025 Easy-Rent Inc.
            </div>
          </div>

          {/* Côté Droit : Formulaire */}
          <div className="md:w-2/3 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Partagez votre expérience</h2>
            
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Votre Nom</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Votre Rôle</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option>Client</option>
                            <option>Agent</option>
                            <option>Organisation</option>
                            <option>Chauffeur</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Notez votre expérience</label>
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <Star 
                                    key={index} 
                                    size={32}
                                    className={`cursor-pointer transition-colors duration-200 ${ratingValue <= (hover || rating) ? "fill-orange-500 text-orange-500" : "text-gray-300"}`}
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Votre Message</label>
                    <textarea rows={4} placeholder="Racontez-nous votre expérience..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>

                <button type="button" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg">
                    Envoyer mon avis <Send size={20} />
                </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}