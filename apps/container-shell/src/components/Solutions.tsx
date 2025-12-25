import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MFE_URLS } from '../config/mfe-urls';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Solutions = ({ t }: any) => {
  const cards = [
    { img: "https://images.unsplash.com/photo-1542362567-b05eef11f94d", label: "HQ View", title: t.org, desc: t.orgDesc, url: MFE_URLS.organisation },
    { img: "https://images.unsplash.com/photo-1556740758-90de374c12ad", label: "Manager View", title: t.agency, desc: t.agencyDesc, url: MFE_URLS.agency },
    { img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42", label: "User App", title: t.client, desc: t.clientDesc, url: MFE_URLS.client },
  ];

  return (
    <section id="solutions" className="py-32 max-w-7xl mx-auto px-6 scroll-mt-20">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-[900] italic tracking-tighter uppercase text-slate-900 dark:text-white mb-4">{t.title}</h2>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{t.subtitle}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        {cards.map((item, i) => (
          <div key={i} className="group card-pwa p-5 dark:bg-slate-800 dark:border-slate-700 hover:border-blue-600 transition-all">
            <div className="h-72 rounded-[2.5rem] overflow-hidden mb-8 bg-slate-100 relative">
              <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="img" />
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-[10px] font-black uppercase italic text-blue-600">{item.label}</div>
            </div>
            <h3 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white mb-3">{item.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed h-12">{item.desc}</p>
            <button 
              onClick={() => window.location.href = item.url}
              className="w-full py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl text-blue-600 font-black text-xs uppercase italic flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
            >
              {t.cta} <ArrowRight size={14}/>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};