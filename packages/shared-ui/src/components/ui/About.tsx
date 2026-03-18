'use client';
import { Building, Car, Smartphone, Zap } from 'lucide-react';
import React from 'react';

type Props = {
  onInstall?: () => void; // fonction pour déclencher l'installation PWA
};

export const About = ({ onInstall }: Props) => {
  return (
    <div className="w-full mx-auto px-6 py-12 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          À propos de Easy-Rent
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Une plateforme moderne de location de véhicules pensée pour simplifier la mise en relation 
          entre agences et clients, avec une expérience rapide, intuitive et accessible partout.
        </p>
      </div>

      {/* CONTENU */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* BLOC 1 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1d2d] border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
          <Car size={36} className="text-[#0528d6] flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Une solution complète
            </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Easy-Rent permet aux utilisateurs de rechercher, comparer et réserver des véhicules 
            en quelques clics. Grâce à un système de filtres avancés, vous pouvez trouver rapidement 
            le véhicule adapté à vos besoins, que ce soit pour un usage personnel ou professionnel.
          </p>
          </div>
        </div>

        {/* BLOC 2 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1d2d] border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
          <Building size={36} className="text-[#0528d6] flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Pour les agences
            </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Les agences peuvent gérer leur catalogue de véhicules, suivre les disponibilités 
            et optimiser leurs services grâce à une interface claire et performante. 
            Easy-Rent agit comme un véritable levier de visibilité et de gestion.
          </p>
          </div>
        </div>

        {/* BLOC 3 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1d2d] border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
          <Zap size={36} className="text-[#0528d6] flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Performance & Simplicité
            </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            L'application est conçue pour être rapide, fluide et accessible même dans des 
            environnements à ressources limitées. Chaque interaction est optimisée pour offrir 
            une expérience utilisateur agréable et efficace.
          </p>
          </div>
        </div>

        {/* BLOC 4 (PWA) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1d2d] border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
          <Smartphone size={36} className="text-[#0528d6] flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Progressive Web App
            </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Easy-Rent est une application web progressive (PWA), ce qui signifie que vous pouvez 
            l’installer directement sur votre téléphone ou ordinateur, sans passer par un store. 
            Elle fonctionne comme une application native, avec un accès rapide, une navigation fluide 
            et la possibilité d’être utilisée même avec une connexion limitée.
          </p>
          </div>
        </div>

      </div>

      {/* CTA INSTALL */}
      <div className="mt-12 text-center">
        <div className="inline-block p-8 rounded-[2rem] bg-gradient-to-r from-[#0528d6] to-blue-600 text-white shadow-xl">
          <h3 className="text-xl font-black mb-2">
            Installer Easy-Rent
          </h3>
          <p className="text-sm opacity-90 mb-6">
            Accédez rapidement à la plateforme depuis votre écran d’accueil et profitez d’une 
            expérience encore plus fluide.
          </p>

          <button
            onClick={onInstall}
            className="px-8 py-3 rounded-xl bg-white text-[#0528d6] font-bold text-sm hover:scale-105 transition-all"
          >
            Installer l’application
          </button>
        </div>
      </div>

    </div>
  );
};
