'use client';
import React from 'react';
import { DownloadCloud } from 'lucide-react';
import { MFE_URLS } from '../config/mfe-urls';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Hero = ({ t, onInstall }: any) => (
  <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center ">
    <div>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black  tracking-[0.2em] mb-8 border border-blue-100 dark:border-blue-900 italic leading-none">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> {t.badge}
      </div>
      <h1 className="text-4xl md:text-6xl font-[900] italic leading-[0.85] tracking-tighter text-slate-900 dark:text-white mb-8 ">
        {t.title} {t.titleAccent}.
      </h1>
      <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mb-10">{t.desc}</p>
      
      <div className="flex flex-wrap gap-4 items-center">
        {/* BOUTON RÉSERVER */}
        <button onClick={() => window.location.href = MFE_URLS.client} className="bg-blue-600 text-white px-6 py-3 rounded-[2rem] font-black  text-sm shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-transform italic">
          {t.ctaReserve}
        </button>

        {/* BOUTON MANAGER */}
        <button onClick={() => window.location.href = MFE_URLS.organisation} className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-[2rem] font-black  text-sm hover:scale-105 transition-transform italic">
          {t.ctaManager}
        </button>

        {/* BOUTON INSTALLER APP */}
        <button onClick={onInstall} className="flex flex-col items-start px-6 py-3 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-blue-600 hover:scale-105 transition-transform group">
            <span className="flex items-center gap-2 font-black  text-[10px] text-slate-400 group-hover:text-blue-600 transition-colors">
                <DownloadCloud size={14} className="text-blue-600" /> {t.ctaInstall}
            </span>
            <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600  tracking-widest mt-0.5">{t.ctaInstallSub}</span>
        </button>
      </div>
    </div>

    <div className="relative group lg:block hidden">
      <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[120px] opacity-20" />
      <div className="relative bg-slate-900 rounded-[4rem] p-4 shadow-2xl border-8 border-slate-800 rotate-2 group-hover:rotate-0 transition-all duration-700">
         <div className="bg-white rounded-[3.2rem] overflow-hidden aspect-video">
            <Image src="/hero.avif" alt="Dashboard" width={100} height={100} className="w-full h-full object-cover" />
         </div>
      </div>
    </div>
  </section>
);