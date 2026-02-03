import React from 'react';
import { WifiOff, MapPin, FileText, Zap, LayoutGrid } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Features = ({ t }: any) => (
  <section id="features" className="py-32 bg-slate-50 dark:bg-slate-900/50 scroll-mt-10">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
      <div>
        <h2 className="text-6xl font-[900] italic leading-none tracking-tighter text-slate-900 dark:text-white mb-8 uppercase">
          Technologie <br /><span className="text-blue-600">PWA First</span>
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed">{t.desc}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-8">
        {[
          { icon: <WifiOff className="text-blue-600"/>, t: t.f1, d: t.f1d },
          { icon: <MapPin className="text-orange-500"/>, t: t.f2, d: t.f2d },
          { icon: <FileText className="text-blue-600"/>, t: t.f3, d: t.f3d },
          { icon: <Zap className="text-orange-500"/>, t: t.f4, d: t.f4d },
        ].map((f, i) => (
          <div key={i} className="bg-white flex gap-2 dark:bg-slate-800 p-5 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-slate-100">
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-inner">{f.icon}</div>
            <div>
              <h4 className="text-md font-black  italic text-slate-900 dark:text-white mb-3">{f.t}</h4>
              <p className="text-sm font-bold text-slate-400  tracking-widest leading-relaxed">{f.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);