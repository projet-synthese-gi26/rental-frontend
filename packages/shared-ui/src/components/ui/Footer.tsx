'use client';
import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1220]">

        <div className=" p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          
          <p>
            © {new Date().getFullYear()} Easy-Rent. Tous droits réservés.
          </p>

          <div className="flex gap-4">
            <span className="hover:text-[#0528d6] cursor-pointer">
              Confidentialité
            </span>
            <span className="hover:text-[#0528d6] cursor-pointer">
              Conditions
            </span>
          </div>

        </div>
    </footer>
  );
};
