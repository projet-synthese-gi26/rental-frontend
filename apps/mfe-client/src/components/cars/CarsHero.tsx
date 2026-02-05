import React from 'react';
import { Search } from 'lucide-react';

interface CarsHeroProps {
    lang: 'FR' | 'EN';
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function CarsHero({ lang, searchTerm, onSearchChange }: CarsHeroProps) {
    return (
        <section className="w-full px-4 md:px-10 py-4 md:py-6">
            <div className="w-full max-w-[1440px] mx-auto relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden min-h-[280px] lg:h-[320px] flex items-center justify-center text-center px-4">
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="cars" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
                <div className="relative z-10 w-full max-w-4xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4 drop-shadow-2xl">
                        {lang === 'FR' ? 'Trouvez le véhicule parfait' : 'Find the perfect vehicle'}
                    </h1>
                    <p className="text-white/70 font-medium text-sm md:text-base tracking-wide mb-8 max-w-xl mx-auto">
                        {lang === 'FR' ? 'Large sélection de véhicules pour tous vos besoins' : 'Wide selection of vehicles for all your needs'}
                    </p>

                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder={lang === 'FR' ? 'Rechercher par nom, marque ou modèle...' : 'Search by name, brand or model...'}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
