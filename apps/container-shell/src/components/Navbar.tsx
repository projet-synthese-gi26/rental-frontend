'use client';
import { Zap, Languages, Sun, Moon } from 'lucide-react';

export const Navbar = ({ t, lang, onLangToggle, darkMode, onThemeToggle, onAuthOpen }: any) => (
  <nav className="fixed top-0 w-full z-[100] bg-white/90 dark:bg-[#0f1323]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Zap size={24} fill="currentColor" /></div>
        <span className="text-xl font-black tracking-tighter uppercase italic text-blue-900 dark:text-white">PWA <span className="text-blue-600">Easy Rental</span></span>
      </div>
      
      <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        <a href="#features" className="hover:text-blue-600 transition-colors">{t.nav.features}</a>
        <a href="#solutions" className="hover:text-blue-600 transition-colors">{t.nav.solutions}</a>
        <a href="#pricing" className="hover:text-blue-600 transition-colors">{t.nav.pricing}</a>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-4 mr-4 text-[10px] font-black uppercase tracking-widest italic">
          <button onClick={() => onAuthOpen(null)} className="hover:text-blue-600 transition-colors">{t.nav.login}</button>
          <button onClick={() => onAuthOpen(null)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all">{t.nav.register}</button>
        </div>
        <button onClick={onLangToggle} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700">
          <Languages size={14} /> {lang}
        </button>
        <button onClick={onThemeToggle} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-yellow-400">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  </nav>
);