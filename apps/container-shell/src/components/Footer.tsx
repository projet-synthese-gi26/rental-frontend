import React from 'react';
import { Zap, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Footer = ({ t, nav }: any) => (
  <footer className="pt-32 pb-16 px-6 max-w-7xl mx-auto border-t border-slate-50 dark:border-slate-800 mt-20">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
      <div className="col-span-2">
         <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Zap size={18} fill="currentColor"/></div>
            <span className="text-lg font-black tracking-tighter uppercase italic text-blue-900 dark:text-white">PWA <span className="text-blue-600">Easy Rental</span></span>
         </div>
         <p className="normal-case tracking-normal font-medium leading-relaxed max-w-xs text-slate-500 dark:text-slate-400 mb-10">{t.desc}</p>
         <div className="flex gap-6">
            {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm"><Icon size={20}/></div>
            ))}
         </div>
      </div>
      <div><h5 className="text-slate-900 dark:text-white mb-10 italic">{nav.features}</h5><ul className="space-y-5"><li>PWA First</li><li>Offline Sync</li><li>Real-time GPS</li></ul></div>
      <div><h5 className="text-slate-900 dark:text-white mb-10 italic">Docs</h5><ul className="space-y-5"><li>API Guides</li><li>SDKs</li><li>Status</li></ul></div>
      <div><h5 className="text-slate-900 dark:text-white mb-10 italic">Connect</h5><ul className="space-y-5"><li>Support</li><li>Careers</li><li>Press</li></ul></div>
    </div>
    <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-50 dark:border-slate-800 text-[9px] font-[900] text-slate-300 dark:text-slate-700 tracking-[0.5em] uppercase italic text-center">
      <span>{t.copy}</span>
      <div className="flex gap-10 mt-8 md:mt-0"><span>{t.privacy}</span><span>{t.terms}</span></div>
    </div>
  </footer>
);