// // 'use client';
// // import React, { useState, useEffect } from 'react';
// // import {
// //   Search, MapPin, Calendar, Heart, Star,
// //   ChevronRight
// // } from 'lucide-react';
// //
// // import { fr } from '../locales/fr';
// // import { en } from '../locales/en';
// // import { AppFooter } from '../components/AppNavbar';
// //
// // const ALL_VEHICLES = [
// //   { id: 1, cat: 'sport', title: "Porsche 911 GT3", price: 299, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600", rating: 4.9, tag: "Hits" },
// //   { id: 2, cat: 'electric', title: "Tesla Model 3", price: 85, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600", rating: 4.8, tag: "Eco" },
// //   { id: 3, cat: 'suv', title: "Range Rover Sport", price: 150, img: "https://images.unsplash.com/photo-1506469717960-433cebe3f181?w=600", rating: 4.7, tag: "Popular" },
// //   { id: 4, cat: 'compact', title: "Mini Cooper S", price: 55, img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600", rating: 4.5, tag: "City" },
// // ];
// //
// // export default function ClientPortal() {
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [lang] = useState<'FR' | 'EN'>('FR');
// //   const [activeCat, setActiveCat] = useState('all');
// //
// //   const t = lang === 'FR' ? fr : en;
// //
// //   useEffect(() => {
// //     setIsLoading(false);
// //   }, []);
// //
// //   const filteredVehicles = activeCat === 'all' ? ALL_VEHICLES : ALL_VEHICLES.filter(v => v.cat === activeCat);
// //
// //   if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0f1323] font-semibold text-blue-600 animate-pulse tracking-wide text-sm">{t.auth.verifying}</div>;
// //
// //   return (
// //       <div className="w-full min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">
// //
// //         {/* --- HERO SECTION --- */}
// //         <section className="w-full px-4 md:px-10 py-4 md:py-6">
// //           <div className="w-full max-w-[1440px] mx-auto relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden min-h-[420px] lg:h-[480px] flex items-center justify-center text-center px-4">
// //             <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="road" />
// //             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />
// //             <div className="relative z-10 w-full max-w-4xl">
// //               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4 drop-shadow-2xl">
// //                 {t.hero.title} <br /><span className="text-blue-400">{t.hero.accent}</span>
// //               </h1>
// //               <p className="text-white/70 font-medium text-sm md:text-base tracking-wide mb-10 max-w-xl mx-auto">{t.hero.sub}</p>
// //               <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] md:rounded-full p-1.5 shadow-2xl flex flex-col lg:flex-row items-center max-w-4xl mx-auto border-2 border-white/10">
// //                 <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-100 dark:border-slate-800">
// //                   <MapPin size={22} className="text-blue-600 shrink-0" />
// //                   <div className="text-left w-full">
// //                     <label className="block text-xs font-semibold text-slate-400 tracking-wide leading-none mb-1">{t.hero.loc}</label>
// //                     <input className="bg-transparent outline-none font-medium text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.locPlace} />
// //                   </div>
// //                 </div>
// //                 <div className="flex-1 flex items-center gap-3 px-6 py-3">
// //                   <Calendar size={22} className="text-blue-600 shrink-0" />
// //                   <div className="text-left flex-1">
// //                     <label className="block text-xs font-semibold text-slate-400 tracking-wide leading-none mb-1">{t.hero.dates}</label>
// //                     <input className="bg-transparent outline-none font-medium text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.datesPlace} />
// //                   </div>
// //                   <button className="hidden lg:flex bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-sm items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
// //                     <Search size={18} strokeWidth={3} /> {t.hero.cta}
// //                   </button>
// //                 </div>
// //                 <button className="lg:hidden w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
// //                   <Search size={18} strokeWidth={3} /> {t.hero.cta}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //
// //         {/* --- CATEGORIES --- */}
// //         <div className="w-full flex gap-3 md:gap-4 overflow-x-auto px-6 md:px-10 py-8 no-scrollbar max-w-7xl mx-auto md:justify-center">
// //           {Object.keys(t.cats).map((key, i) => (
// //               <button
// //                   key={i}
// //                   onClick={() => setActiveCat(key)}
// //                   className={`px-8 py-3.5 rounded-full whitespace-nowrap font-semibold text-sm tracking-wide border transition-all flex items-center gap-3 ${
// //                       activeCat === key
// //                           ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20'
// //                           : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-600'
// //                   }`}
// //               >
// //                 {t.cats[key as keyof typeof t.cats]}
// //               </button>
// //           ))}
// //         </div>
// //
// //         {/* --- LISTING --- */}
// //         <section className="w-full px-6 md:px-10 py-12 max-w-7xl mx-auto">
// //           <div className="flex justify-between items-end mb-16">
// //             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">{t.rentals.title}</h2>
// //             <a href="/client/cars" className="text-blue-600 font-semibold text-sm flex items-center gap-2">{t.rentals.viewAll} <ChevronRight size={14} /></a>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// //             {filteredVehicles.map((item) => (
// //                 <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 border border-slate-50 dark:border-slate-800 hover:shadow-2xl transition-all">
// //                   <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative shadow-inner bg-slate-50 dark:bg-[#0f1323]">
// //                     <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#0f1323]/95 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 z-10 shadow-sm">{item.tag}</div>
// //                     <div className="absolute top-4 right-4 z-10 p-2.5 bg-white/60 backdrop-blur rounded-full text-slate-900 cursor-pointer hover:bg-red-500 hover:text-white transition-all"><Heart size={16} /></div>
// //                     <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="v" />
// //                   </div>
// //                   <div className="flex justify-between items-start mb-2 px-1 text-slate-900 dark:text-white">
// //                     <h3 className="font-bold text-base tracking-tight leading-none">{item.title}</h3>
// //                     <div className="flex items-center gap-1 text-sm font-semibold text-orange-500 shrink-0"><Star size={12} fill="currentColor" /> {item.rating}</div>
// //                   </div>
// //                   <p className="text-xs font-medium text-slate-400 tracking-wide mb-8 px-1 leading-none">Full Insurance • Bastos Hub</p>
// //                   <div className="flex items-center justify-between px-1">
// //                     <div className="text-slate-900 dark:text-white">
// //                       <span className="text-2xl font-bold text-blue-600 leading-none">${item.price}</span>
// //                       <span className="text-xs font-medium text-slate-300 ml-1">/ {t.rentals.day}</span>
// //                     </div>
// //                     <button className="bg-slate-50 dark:bg-[#1a1d2d] text-blue-600 dark:text-blue-400 px-6 py-2.5 rounded-2xl font-semibold text-xs hover:bg-blue-600 hover:text-white transition-all">{t.rentals.book}</button>
// //                   </div>
// //                 </div>
// //             ))}
// //           </div>
// //         </section>
// //
// //         {/* --- FOOTER --- */}
// //         <AppFooter />
// //       </div>
// //   );
// // }
//
// 'use client';
// import React, { useState, useEffect } from 'react';
// import {
//   Search, MapPin, Calendar, Heart, Star, ChevronRight
// } from 'lucide-react';
//
// import { fr } from '../locales/fr';
// import { en } from '../locales/en';
// import { AppFooter } from '../components/AppNavbar';
// import { catalogService } from '@/services/catalogService';
// import { ApiVehicle, VehicleCategory } from '@/types/apiVehicleType';
// import Link from 'next/link';
//
// export default function ClientPortal() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [lang] = useState<'FR' | 'EN'>('FR');
//   const [activeCat, setActiveCat] = useState('all');
//   const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
//   const [categories, setCategories] = useState<VehicleCategory[]>([]);
//
//   const t = lang === 'FR' ? fr : en;
//
//   useEffect(() => {
//     loadData();
//   }, []);
//
//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const [vehiclesData, categoriesData] = await Promise.all([
//         catalogService.getAvailableVehicles(),
//         catalogService.getAllCategories()
//       ]);
//       setVehicles(vehiclesData);
//       setCategories(categoriesData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const getCategoryName = (categoryId: string) => {
//     const category = categories.find(cat => cat.id === categoryId);
//     return category ? category.name : 'Unknown';
//   };
//
//   // Filter vehicles by category and limit to 4 items for landing page
//   const filteredVehicles = activeCat === 'all'
//       ? vehicles.slice(0, 4)
//       : vehicles.filter(v => v.categoryId === activeCat).slice(0, 4);
//
//   // Get vehicle tag based on price and year
//   const getVehicleTag = (vehicle: ApiVehicle) => {
//     const price = vehicle.pricing?.pricePerDay || 0;
//     const year = new Date(vehicle.yearProduction).getFullYear();
//     const currentYear = new Date().getFullYear();
//
//     if (year >= currentYear - 1) return lang === 'FR' ? 'Nouveau' : 'New';
//     if (price > 100000) return lang === 'FR' ? 'Premium' : 'Premium';
//     if (vehicle.functionalities?.air_condition && vehicle.functionalities?.gps) return 'Popular';
//     return lang === 'FR' ? 'Économique' : 'Eco';
//   };
//
//   // Calculate average rating from functionalities (mock rating based on features)
//   const getVehicleRating = (vehicle: ApiVehicle) => {
//     if (!vehicle.functionalities) return 4.5;
//
//     const features = Object.values(vehicle.functionalities).filter(Boolean).length;
//     const totalFeatures = Object.keys(vehicle.functionalities).length;
//     const rating = 3.5 + (features / totalFeatures) * 1.5;
//
//     return Math.min(5, Math.round(rating * 10) / 10);
//   };
//
//   if (isLoading) {
//     return (
//         <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0f1323] font-semibold text-blue-600 animate-pulse tracking-wide text-sm">
//           {t.auth.verifying}
//         </div>
//     );
//   }
//
//   return (
//       <div className="w-full min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">
//
//         {/* --- HERO SECTION --- */}
//         <section className="w-full px-4 md:px-10 py-4 md:py-6">
//           <div className="w-full max-w-[1440px] mx-auto relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden min-h-[420px] lg:h-[480px] flex items-center justify-center text-center px-4">
//             <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="road" />
//             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />
//             <div className="relative z-10 w-full max-w-4xl">
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4 drop-shadow-2xl">
//                 {t.hero.title} <br /><span className="text-blue-400">{t.hero.accent}</span>
//               </h1>
//               <p className="text-white/70 font-medium text-sm md:text-base tracking-wide mb-10 max-w-xl mx-auto">{t.hero.sub}</p>
//               <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] md:rounded-full p-1.5 shadow-2xl flex flex-col lg:flex-row items-center max-w-4xl mx-auto border-2 border-white/10">
//                 <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-100 dark:border-slate-800">
//                   <MapPin size={22} className="text-blue-600 shrink-0" />
//                   <div className="text-left w-full">
//                     <label className="block text-xs font-semibold text-slate-400 tracking-wide leading-none mb-1">{t.hero.loc}</label>
//                     <input className="bg-transparent outline-none font-medium text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.locPlace} />
//                   </div>
//                 </div>
//                 <div className="flex-1 flex items-center gap-3 px-6 py-3">
//                   <Calendar size={22} className="text-blue-600 shrink-0" />
//                   <div className="text-left flex-1">
//                     <label className="block text-xs font-semibold text-slate-400 tracking-wide leading-none mb-1">{t.hero.dates}</label>
//                     <input className="bg-transparent outline-none font-medium text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.datesPlace} />
//                   </div>
//                   <Link href="/client/cars" className="hidden lg:flex bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-sm items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
//                     <Search size={18} strokeWidth={3} /> {t.hero.cta}
//                   </Link>
//                 </div>
//                 <Link href="/client/cars" className="lg:hidden w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
//                   <Search size={18} strokeWidth={3} /> {t.hero.cta}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//
//         {/* --- CATEGORIES --- */}
//         <div className="w-full flex gap-3 md:gap-4 overflow-x-auto px-6 md:px-10 py-8 no-scrollbar max-w-7xl mx-auto md:justify-center">
//           <button
//               onClick={() => setActiveCat('all')}
//               className={`px-8 py-3.5 rounded-full whitespace-nowrap font-semibold text-sm tracking-wide border transition-all flex items-center gap-3 ${
//                   activeCat === 'all'
//                       ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20'
//                       : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-600'
//               }`}
//           >
//             {lang === 'FR' ? 'Tous' : 'All'}
//           </button>
//           {categories.slice(0, 6).map((category) => (
//               <button
//                   key={category.id}
//                   onClick={() => setActiveCat(category.id)}
//                   className={`px-8 py-3.5 rounded-full whitespace-nowrap font-semibold text-sm tracking-wide border transition-all flex items-center gap-3 ${
//                       activeCat === category.id
//                           ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20'
//                           : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-600'
//                   }`}
//               >
//                 {category.name}
//               </button>
//           ))}
//         </div>
//
//         {/* --- LISTING --- */}
//         <section className="w-full px-6 md:px-10 py-12 max-w-7xl mx-auto">
//           <div className="flex justify-between items-end mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">{t.rentals.title}</h2>
//             <Link href="/client/cars" className="text-blue-600 font-semibold text-sm flex items-center gap-2">
//               {t.rentals.viewAll} <ChevronRight size={14} />
//             </Link>
//           </div>
//
//           {filteredVehicles.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-slate-400 text-sm">
//                   {lang === 'FR' ? 'Aucun véhicule disponible dans cette catégorie' : 'No vehicles available in this category'}
//                 </p>
//               </div>
//           ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                 {filteredVehicles.map((vehicle) => (
//                     <Link key={vehicle.id} href={`/client/cars/${vehicle.id}`}>
//                       <div className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 border border-slate-50 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer">
//                         <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative shadow-inner bg-slate-50 dark:bg-[#0f1323]">
//                           <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#0f1323]/95 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 z-10 shadow-sm">
//                             {getVehicleTag(vehicle)}
//                           </div>
//                           <div className="absolute top-4 right-4 z-10 p-2.5 bg-white/60 backdrop-blur rounded-full text-slate-900 cursor-pointer hover:bg-red-500 hover:text-white transition-all">
//                             <Heart size={16} />
//                           </div>
//                           <img
//                               src={vehicle.images?.[0] || 'https://via.placeholder.com/600x600/e2e8f0/64748b?text=No+Image'}
//                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                               alt={`${vehicle.brand} ${vehicle.model}`}
//                               onError={(e) => {
//                                 e.currentTarget.src = 'https://via.placeholder.com/600x600/e2e8f0/64748b?text=No+Image';
//                               }}
//                           />
//                         </div>
//                         <div className="flex justify-between items-start mb-2 px-1 text-slate-900 dark:text-white">
//                           <h3 className="font-bold text-base tracking-tight leading-none">
//                             {vehicle.brand} {vehicle.model}
//                           </h3>
//                           <div className="flex items-center gap-1 text-sm font-semibold text-orange-500 shrink-0">
//                             <Star size={12} fill="currentColor" /> {getVehicleRating(vehicle)}
//                           </div>
//                         </div>
//                         <p className="text-xs font-medium text-slate-400 tracking-wide mb-8 px-1 leading-none">
//                           {getCategoryName(vehicle.categoryId)} • {vehicle.transmission}
//                         </p>
//                         <div className="flex items-center justify-between px-1">
//                           <div className="text-slate-900 dark:text-white">
//                       <span className="text-2xl font-bold text-blue-600 leading-none">
//                         {vehicle.pricing?.pricePerDay?.toLocaleString() || 'N/A'} FCFA
//                       </span>
//                             <span className="text-xs font-medium text-slate-300 ml-1">/ {t.rentals.day}</span>
//                           </div>
//                           <button className="bg-slate-50 dark:bg-[#1a1d2d] text-blue-600 dark:text-blue-400 px-6 py-2.5 rounded-2xl font-semibold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
//                             {t.rentals.book}
//                           </button>
//                         </div>
//                       </div>
//                     </Link>
//                 ))}
//               </div>
//           )}
//         </section>
//
//         {/* --- FOOTER --- */}
//         <AppFooter />
//       </div>
//   );
// }

'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Calendar, Heart, Star, ChevronRight, ChevronLeft
} from 'lucide-react';

import { fr } from '../locales/fr';
import { en } from '../locales/en';
import { AppFooter } from '../components/AppNavbar';
import { catalogService } from '@/services/catalogService';
import { ApiVehicle, VehicleCategory } from '@/types/apiVehicleType';
import Link from 'next/link';

export default function ClientPortal() {
  const [isLoading, setIsLoading] = useState(true);
  const [lang] = useState<'FR' | 'EN'>('FR');
  const [activeCat, setActiveCat] = useState('all');
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const t = lang === 'FR' ? fr : en;

  // Categories carousel settings
  const CATEGORIES_PER_PAGE = 4;
  const allCategories = [
    { id: 'all', name: lang === 'FR' ? 'Tous' : 'All' },
    ...categories
  ];
  const totalCategoryPages = Math.ceil(allCategories.length / CATEGORIES_PER_PAGE);
  const visibleCategories = allCategories.slice(
      currentCategoryPage * CATEGORIES_PER_PAGE,
      (currentCategoryPage + 1) * CATEGORIES_PER_PAGE
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesData, categoriesData] = await Promise.all([
        catalogService.getAvailableVehicles(),
        catalogService.getAllCategories()
      ]);
      setVehicles(vehiclesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Filter vehicles by category and limit to 4 items for landing page
  const filteredVehicles = activeCat === 'all'
      ? vehicles.slice(0, 4)
      : vehicles.filter(v => v.categoryId === activeCat).slice(0, 4);

  // Get vehicle tag based on price and year
  const getVehicleTag = (vehicle: ApiVehicle) => {
    const price = vehicle.pricing?.pricePerDay || 0;
    const year = new Date(vehicle.yearProduction).getFullYear();
    const currentYear = new Date().getFullYear();

    if (year >= currentYear - 1) return lang === 'FR' ? 'Nouveau' : 'New';
    if (price > 100000) return lang === 'FR' ? 'Premium' : 'Premium';
    if (vehicle.functionalities?.air_condition && vehicle.functionalities?.gps) return 'Popular';
    return lang === 'FR' ? 'Économique' : 'Eco';
  };

  // Calculate average rating from functionalities (mock rating based on features)
  const getVehicleRating = (vehicle: ApiVehicle) => {
    if (!vehicle.functionalities) return 4.5;

    const features = Object.values(vehicle.functionalities).filter(Boolean).length;
    const totalFeatures = Object.keys(vehicle.functionalities).length;
    const rating = 3.5 + (features / totalFeatures) * 1.5;

    return Math.min(5, Math.round(rating * 10) / 10);
  };

  const nextCategoryPage = () => {
    if (currentCategoryPage < totalCategoryPages - 1) {
      setCurrentCategoryPage(prev => prev + 1);
    }
  };

  const prevCategoryPage = () => {
    if (currentCategoryPage > 0) {
      setCurrentCategoryPage(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0f1323] font-semibold text-blue-600 animate-pulse tracking-wide text-sm">
          {t.auth.verifying}
        </div>
    );
  }

  return (
      <div className="w-full min-h-screen bg-white dark:bg-[#0f1323] text-slate-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">

        {/* --- HERO SECTION --- */}
        <section className="w-full px-4 md:px-10 py-4 md:py-6">
          <div className="w-full max-w-[1440px] mx-auto relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden min-h-[420px] lg:h-[480px] flex items-center justify-center text-center px-4">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="road" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />
            <div className="relative z-10 w-full max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4 drop-shadow-2xl">
                {t.hero.title} <br /><span className="text-blue-400">{t.hero.accent}</span>
              </h1>
              <p className="text-white/70 font-medium text-sm md:text-base tracking-wide mb-10 max-w-xl mx-auto">{t.hero.sub}</p>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] md:rounded-full p-1.5 shadow-2xl flex flex-col lg:flex-row items-center max-w-4xl mx-auto border-2 border-white/10">
                <div className="flex-1 flex items-center gap-3 px-6 py-3 lg:border-r border-slate-100 dark:border-slate-800">
                  <MapPin size={22} className="text-blue-600 shrink-0" />
                  <div className="text-left w-full">
                    <label className="block text-xs font-semibold text-slate-400 tracking-wide leading-none mb-1">{t.hero.loc}</label>
                    <input className="bg-transparent outline-none font-medium text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.locPlace} />
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 px-6 py-3">
                  <Calendar size={22} className="text-blue-600 shrink-0" />
                  <div className="text-left flex-1">
                    <label className="block text-xs font-semibold text-slate-400 tracking-wide leading-none mb-1">{t.hero.dates}</label>
                    <input className="bg-transparent outline-none font-medium text-slate-900 dark:text-white w-full text-sm" placeholder={t.hero.datesPlace} />
                  </div>
                  <Link href="/client/cars" className="hidden lg:flex bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-sm items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
                    <Search size={18} strokeWidth={3} /> {t.hero.cta}
                  </Link>
                </div>
                <Link href="/client/cars" className="lg:hidden w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
                  <Search size={18} strokeWidth={3} /> {t.hero.cta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- CATEGORIES CAROUSEL --- */}
        <div className="w-full px-6 md:px-10 py-8 max-w-7xl mx-auto">
          <div className="relative flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
                onClick={prevCategoryPage}
                disabled={currentCategoryPage === 0}
                className={`p-3 rounded-full border transition-all ${
                    currentCategoryPage === 0
                        ? 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-600'
                }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Categories Container */}
            <div className="flex-1 overflow-hidden" ref={carouselRef}>
              <div className="flex gap-3 md:gap-4 justify-center transition-all duration-300">
                {visibleCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCat(category.id)}
                        className={`px-8 py-3.5 rounded-full whitespace-nowrap font-semibold text-sm tracking-wide border transition-all flex items-center gap-3 flex-1 justify-center ${
                            activeCat === category.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-600'
                        }`}
                    >
                      {category.name}
                    </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
                onClick={nextCategoryPage}
                disabled={currentCategoryPage === totalCategoryPages - 1}
                className={`p-3 rounded-full border transition-all ${
                    currentCategoryPage === totalCategoryPages - 1
                        ? 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-600'
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Pagination Dots */}
          {totalCategoryPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(totalCategoryPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentCategoryPage(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            currentCategoryPage === index
                                ? 'bg-blue-600 w-6'
                                : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                    />
                ))}
              </div>
          )}
        </div>

        {/* --- LISTING --- */}
        <section className="w-full px-6 md:px-10 py-12 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">{t.rentals.title}</h2>
            <Link href="/client/cars" className="text-blue-600 font-semibold text-sm flex items-center gap-2">
              {t.rentals.viewAll} <ChevronRight size={14} />
            </Link>
          </div>

          {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">
                  {lang === 'FR' ? 'Aucun véhicule disponible dans cette catégorie' : 'No vehicles available in this category'}
                </p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredVehicles.map((vehicle) => (
                    <Link key={vehicle.id} href={`/client/cars/${vehicle.id}`}>
                      <div className="group bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 border border-slate-50 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer">
                        <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative shadow-inner bg-slate-50 dark:bg-[#0f1323]">
                          <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#0f1323]/95 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 z-10 shadow-sm">
                            {getVehicleTag(vehicle)}
                          </div>
                          <div className="absolute top-4 right-4 z-10 p-2.5 bg-white/60 backdrop-blur rounded-full text-slate-900 cursor-pointer hover:bg-red-500 hover:text-white transition-all">
                            <Heart size={16} />
                          </div>
                          <img
                              src={vehicle.images?.[0] || 'https://via.placeholder.com/600x600/e2e8f0/64748b?text=No+Image'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/600x600/e2e8f0/64748b?text=No+Image';
                              }}
                          />
                        </div>
                        <div className="flex justify-between items-start mb-2 px-1 text-slate-900 dark:text-white">
                          <h3 className="font-bold text-base tracking-tight leading-none">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <div className="flex items-center gap-1 text-sm font-semibold text-orange-500 shrink-0">
                            <Star size={12} fill="currentColor" /> {getVehicleRating(vehicle)}
                          </div>
                        </div>
                        <p className="text-xs font-medium text-slate-400 tracking-wide mb-8 px-1 leading-none">
                          {getCategoryName(vehicle.categoryId)} • {vehicle.transmission}
                        </p>
                        <div className="flex items-center justify-between px-1">
                          <div className="text-slate-900 dark:text-white">
                      <span className="text-2xl font-bold text-blue-600 leading-none">
                        {vehicle.pricing?.pricePerDay?.toLocaleString() || 'N/A'} FCFA
                      </span>
                            <span className="text-xs font-medium text-slate-300 ml-1">/ {t.rentals.day}</span>
                          </div>
                          <button className="bg-slate-50 dark:bg-[#1a1d2d] text-blue-600 dark:text-blue-400 px-6 py-2.5 rounded-2xl font-semibold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {t.rentals.book}
                          </button>
                        </div>
                      </div>
                    </Link>
                ))}
              </div>
          )}
        </section>

        {/* --- FOOTER --- */}
        <AppFooter />
      </div>
  );
}