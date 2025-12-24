'use client';
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, Zap, Users, ShieldCheck, Globe, 
  BarChart3, Check, Moon, Sun, Languages, ChevronDown, 
  ArrowRight, WifiOff, FileText, MapPin, Smartphone, LayoutGrid,
  Mail, Instagram, Twitter, Facebook, HelpCircle
} from 'lucide-react';

// --- DICTIONNAIRE DE TRADUCTION COMPLET ---
const translations = {
  FR: {
    nav: { features: "Fonctionnalités", solutions: "Solutions", pricing: "Tarifs", login: "Connexion", register: "S'inscrire", reserve: "Réserver" },
    hero: {
      badge: "Écosystème de location nouvelle génération",
      title: "La Mobilité Digitale. Sans",
      titleAccent: "Frontières.",
      desc: "Une plateforme unique pour gérer votre flotte, vos agences et offrir une expérience premium à vos clients. Partout dans le monde.",
      cta: "Réserver un véhicule",
      demo: "Démo Live"
    },
    stakeholders: {
      title: "Conçu pour chaque acteur",
      subtitle: "Une interface sur-mesure pour chaque utilisateur",
      org: "Organisation",
      orgDesc: "Centralisez votre flotte globale avec des contrôles avancés.",
      agency: "Agence",
      agencyDesc: "Optimisez les réservations et gérez les stocks en un clic.",
      client: "Client",
      clientDesc: "Réservez et payez votre location depuis votre smartphone.",
    },
    features: {
      title: "Technologie PWA",
      desc: "L'expérience d'une application native directement dans votre navigateur.",
      f1: "Mode Offline", f1d: "Travaillez sans réseau, synchro au retour.",
      f2: "GPS Temps Réel", f2d: "Suivez votre flotte sur carte interactive.",
      f3: "Facturation Auto", f3d: "Générez des factures après chaque trajet.",
      f4: "Sync Instantanée", f4d: "Dashboard mis à jour en temps réel."
    },
    pricing: {
      title: "Tarifs Flexibles",
      subtitle: "Des plans adaptés à votre croissance",
      starter: "Débutant", pro: "Professionnel", enterprise: "Entreprise",
      perMonth: "/mois",
      cta: "Choisir ce plan",
      f1: "Jusqu'à 5 véhicules", f2: "Support standard", f3: "Analytiques de base",
      f4: "Véhicules illimités", f5: "Support 24/7", f6: "Multi-agences",
      f7: "Marque blanche", f8: "API dédiée", f9: "Gestionnaire de compte"
    },
    faq: { title: "Questions Fréquentes", q1: "C'est quoi une PWA ?", a1: "C'est une application web qui s'installe sans passer par les stores." },
    footer: { desc: "La nouvelle référence du logiciel de location. Agile et digital.", copy: "© 2025 PWA EASY RENTAL. TOUS DROITS RÉSERVÉS." }
  },
  EN: {
    nav: { features: "Features", solutions: "Solutions", pricing: "Pricing", login: "Login", register: "Sign Up", reserve: "Book Now" },
    hero: {
      badge: "Next-gen rental ecosystem",
      title: "Digital Mobility. Without",
      titleAccent: "Borders.",
      desc: "A unique platform to manage your fleet, your agencies and offer a premium experience to your clients. Worldwide.",
      cta: "Reserve a vehicle",
      demo: "Live Demo"
    },
    stakeholders: {
      title: "Built for everyone",
      subtitle: "Tailor-made interfaces for every user type",
      org: "Organization",
      orgDesc: "Centralize your global fleet with advanced controls.",
      agency: "Agency",
      agencyDesc: "Optimize bookings and manage inventory in one click.",
      client: "Client",
      clientDesc: "Book and pay for your rental right from your phone.",
    },
    features: {
      title: "PWA Technology",
      desc: "The speed of a native app directly in your browser.",
      f1: "Works Offline", f1d: "Keep working without network, sync later.",
      f2: "Real-time GPS", f2d: "Track your fleet on interactive maps.",
      f3: "Auto Invoicing", f3d: "Generate invoices automatically after trips.",
      f4: "Instant Sync", f4d: "Real-time dashboard updates."
    },
    pricing: {
      title: "Flexible Pricing",
      subtitle: "Plans that scale with your business",
      starter: "Starter", pro: "Professional", enterprise: "Enterprise",
      perMonth: "/mo",
      cta: "Choose plan",
      f1: "Up to 5 vehicles", f2: "Standard support", f3: "Basic analytics",
      f4: "Unlimited vehicles", f5: "24/7 priority support", f6: "Multi-agency management",
      f7: "White-label PWA", f8: "Dedicated API", f9: "Account Manager"
    },
    faq: { title: "FAQ", q1: "What is a PWA?", a1: "It's a web app that can be installed without using app stores." },
    footer: { desc: "The new standard in rental software. Agile and digital.", copy: "© 2025 PWA EASY RENTAL. ALL RIGHTS RESERVED." }
  }
};

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white/90 dark:bg-[#0f1323]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-blue-900 dark:text-white">
              PWA <span className="text-blue-600">Easy Rental</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">{t.nav.features}</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">{t.nav.solutions}</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">{t.nav.pricing}</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Connexion / Inscription */}
            <div className="hidden sm:flex items-center gap-4 mr-4 text-[10px] font-black uppercase tracking-widest">
              <button className="hover:text-blue-600">{t.nav.login}</button>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all">{t.nav.register}</button>
            </div>

            {/* Lang & Mode */}
            <div className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase">
                <Languages size={14} /> {lang}
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700">
                  <button onClick={() => { setLang('FR'); setIsLangOpen(false); }} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20">Français</button>
                  <button onClick={() => { setLang('EN'); setIsLangOpen(false); }} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20">English</button>
                </div>
              )}
            </div>

            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-yellow-400">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 dark:border-blue-900">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> {t.hero.badge}
          </div>
          <h1 className="text-6xl md:text-8xl font-[900] italic leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8 uppercase">
            {t.hero.title} <br /> <span className="text-blue-600">Digitale.</span> <br /> {t.hero.titleAccent}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mb-10">{t.hero.desc}</p>
          <div className="flex flex-wrap gap-4">
            <a href="/client" className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-transform">{t.hero.cta}</a>
            <button className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white px-10 py-5 rounded-[2rem] font-black uppercase text-sm flex items-center gap-2 hover:bg-slate-50">{t.hero.demo}</button>
          </div>
        </div>
        <div className="relative group lg:block hidden">
          <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-slate-900 rounded-[4rem] p-4 shadow-2xl border-8 border-slate-800 rotate-2 group-hover:rotate-0 transition-all duration-700">
             <div className="bg-white rounded-[3.2rem] overflow-hidden aspect-video">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" alt="Dashboard" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* --- SOLUTIONS (STAKEHOLDERS) --- */}
      <section id="solutions" className="py-32 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-[900] italic tracking-tighter uppercase text-slate-900 dark:text-white mb-4">{t.stakeholders.title}</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{t.stakeholders.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { img: "https://images.unsplash.com/photo-1542362567-b05eef11f94d", label: "HQ View", title: t.stakeholders.org, desc: t.stakeholders.orgDesc, path: "/organisation" },
            { img: "https://images.unsplash.com/photo-1556740758-90de374c12ad", label: "Manager View", title: t.stakeholders.agency, desc: t.stakeholders.agencyDesc, path: "/agency" },
            { img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42", label: "User App", title: t.stakeholders.client, desc: t.stakeholders.clientDesc, path: "/client" },
          ].map((item, i) => (
            <div key={i} className="group card-pwa p-5 dark:bg-slate-800 dark:border-slate-700 hover:border-blue-600">
              <div className="h-72 rounded-[2.5rem] overflow-hidden mb-8 bg-slate-100 relative shadow-inner">
                <img src={item.img} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" alt="img" />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase italic">{item.label}</div>
              </div>
              <h3 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">{item.desc}</p>
              <a href={item.path} className="text-blue-600 font-black text-xs uppercase italic flex items-center gap-2 group-hover:gap-4 transition-all">Accéder <ArrowRight size={14}/></a>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-32 bg-slate-50 dark:bg-slate-900/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-6xl font-[900] italic leading-none tracking-tighter text-slate-900 dark:text-white mb-8 uppercase">Technologie <br /><span className="text-blue-600">PWA First</span></h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed">{t.features.desc}</p>
            <button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase text-sm flex items-center gap-3">
              Voir Spécifications <LayoutGrid size={20}/>
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: <WifiOff className="text-blue-600"/>, t: t.features.f1, d: t.features.f1d },
              { icon: <MapPin className="text-orange-500"/>, t: t.features.f2, d: t.features.f2d },
              { icon: <FileText className="text-blue-600"/>, t: t.features.f3, d: t.features.f3d },
              { icon: <Zap className="text-orange-500"/>, t: t.features.f4, d: t.features.f4d },
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-inner">{f.icon}</div>
                <h4 className="text-xl font-black uppercase italic text-slate-900 dark:text-white mb-3">{f.t}</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-32 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-[900] italic tracking-tighter uppercase text-slate-900 dark:text-white mb-4">{t.pricing.title}</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{t.pricing.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Card Starter */}
          <div className="p-12 bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
            <h4 className="text-xl font-black uppercase italic mb-8">{t.pricing.starter}</h4>
            <div className="text-5xl font-black mb-10 italic">0€ <span className="text-sm font-normal text-slate-400 tracking-normal">{t.pricing.perMonth}</span></div>
            <ul className="space-y-5 mb-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> {t.pricing.f1}</li>
              <li className="flex gap-2 items-center opacity-40"><Check size={16}/> {t.pricing.f2}</li>
              <li className="flex gap-2 items-center opacity-40"><Check size={16}/> {t.pricing.f3}</li>
            </ul>
            <button className="w-full py-5 bg-white dark:bg-slate-800 rounded-3xl font-black uppercase text-xs shadow-sm">{t.pricing.cta}</button>
          </div>
          {/* Card PRO - Highlighted */}
          <div className="p-12 bg-blue-600 rounded-[4rem] text-white shadow-[0_40px_80px_-15px_rgba(5,40,214,0.4)] relative overflow-hidden transition-all hover:scale-110 z-10 scale-105">
            <div className="absolute top-8 right-8 rotate-12 opacity-10"><Zap size={120} fill="currentColor"/></div>
            <h4 className="text-xl font-black uppercase italic mb-8">{t.pricing.pro}</h4>
            <div className="text-5xl font-black mb-10 italic">49€ <span className="text-sm font-normal text-blue-200 tracking-normal">{t.pricing.perMonth}</span></div>
            <ul className="space-y-5 mb-12 text-sm font-bold uppercase tracking-widest">
              <li className="flex gap-2 items-center"><Check size={16}/> {t.pricing.f4}</li>
              <li className="flex gap-2 items-center"><Check size={16}/> {t.pricing.f5}</li>
              <li className="flex gap-2 items-center"><Check size={16}/> {t.pricing.f6}</li>
            </ul>
            <button className="w-full py-5 bg-white text-blue-600 rounded-3xl font-black uppercase text-xs shadow-xl">{t.pricing.cta}</button>
          </div>
          {/* Card Enterprise */}
          <div className="p-12 bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
            <h4 className="text-xl font-black uppercase italic mb-8">{t.pricing.enterprise}</h4>
            <div className="text-5xl font-black mb-10 italic">Sur devis</div>
            <ul className="space-y-5 mb-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> {t.pricing.f7}</li>
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> {t.pricing.f8}</li>
              <li className="flex gap-2 items-center text-green-500"><Check size={16}/> {t.pricing.f9}</li>
            </ul>
            <button className="w-full py-5 bg-white dark:bg-slate-800 rounded-3xl font-black uppercase text-xs shadow-sm">{t.pricing.cta}</button>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-dark rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative z-10">
            <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-10">Passez à la vitesse <span className="text-blue-500 italic">Supérieure.</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/client" className="bg-blue-600 text-white px-12 py-6 rounded-[2.5rem] font-black uppercase shadow-xl hover:scale-105 transition-all">Démarrer gratuitement</a>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 px-12 py-6 rounded-[2.5rem] font-black uppercase hover:bg-white/20 transition-all">Parler à un expert</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-32 pb-16 px-6 max-w-7xl mx-auto border-t border-slate-50 dark:border-slate-800 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          <div className="col-span-2">
             <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Zap size={18} fill="currentColor"/></div>
                <span className="text-lg font-black tracking-tighter uppercase italic text-blue-900 dark:text-white">PWA <span className="text-blue-600">Easy Rental</span></span>
             </div>
             <p className="normal-case tracking-normal font-medium leading-relaxed max-w-xs text-slate-500 dark:text-slate-400 mb-10">{t.footer.desc}</p>
             <div className="flex gap-6">
                {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm"><Icon size={20}/></div>
                ))}
             </div>
          </div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">Produit</h5><ul className="space-y-5"><li>Features</li><li>Solutions</li><li>API</li></ul></div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">Ressources</h5><ul className="space-y-5"><li>Docs</li><li>Support</li><li>Status</li></ul></div>
          <div><h5 className="text-slate-900 dark:text-white mb-10 italic">Société</h5><ul className="space-y-5"><li>Blog</li><li>Carrières</li><li>Contact</li></ul></div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-50 dark:border-slate-800 text-[9px] font-[900] text-slate-300 dark:text-slate-700 tracking-[0.5em] uppercase italic">
          <span>{t.footer.copy}</span>
          <div className="flex gap-10 mt-8 md:mt-0"><span>Privacy Policy</span><span>Terms & Conditions</span></div>
        </div>
      </footer>
    </div>
  );
}