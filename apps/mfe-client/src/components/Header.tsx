/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from "react";
import {Sun,Moon,LogOut,Car,Home,Ticket,Bell} from "lucide-react";
import { nb } from "date-fns/locale";
import { notifService } from "@shared-services/api";

export const Header = ({isAuth,userData,currentView,setCurrentView,toggleTheme,darkMode,lang,setLang,onLogout}: any) => {
  const [nbNotifications, setNbNotifications] = React.useState<any>(0);
  useEffect(() => {
   const nbNotifications = notifService.countUnreadClient(userData?.id).then(res => {
      console.log("Nombre de notifications non lues :", res);
    }).catch(err => {
      console.error("Erreur lors du comptage des notifications non lues :", err);
    });
   setNbNotifications(nbNotifications);
  }, [userData]);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 px-6 md:px-12 flex items-center justify-between z-[100] bg-white/70 dark:bg-[#0f1323]/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-10">

        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("HOME")}>
          <div className="size-10 bg-[#0528d6] rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="font-semibold italic text-lg">E</span>
          </div>

          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            Easy<span className="text-[#0528d6]">Rental</span>
          </span>
        </div>

        {/* NAV */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavLink label="Accueil"  active={currentView === "HOME"}  onClick={() => setCurrentView("HOME")}  icon={<Home size={16} />}/>
          <NavLink  label="Catalogue"  active={currentView === "CATALOG"}  onClick={() => setCurrentView("CATALOG")}  icon={<Car size={16} />}/>
          <NavLink  label="Mes trajets"  active={currentView === "MY_BOOKINGS"}  onClick={() => setCurrentView("MY_BOOKINGS")}  icon={<Ticket size={16} />}/>
          <NavLink  label="Réservations"  active={currentView === "MY_RESERVATIONS"}  onClick={() => setCurrentView("MY_RESERVATIONS")}  icon={<Ticket size={16} />}/>
        </nav>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLang(lang === "FR" ? "EN" : "FR")}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {lang}
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {isAuth ? (
          <>
            <button 
              onClick={()=> setCurrentView("NOTIFICATIONS")}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <Bell size={20} />
              {nbNotifications != 0? (<span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5 py-[1px]">
                {nbNotifications}
              </span>):(<></>)}
            </button>

            {/* PROFILE */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">

              <button
                onClick={() => setCurrentView("PROFILE")}
                className="flex items-center gap-3"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{userData?.firstname}</p>
                  <p className="text-xs text-slate-500">  Client </p>
                </div>

                <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-medium text-[#0528d6]">
                  {userData?.firstname?.charAt(0)}
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <LogOut size={20} />
              </button>

            </div>
          </>
        ) : (
          <button
            onClick={() => setCurrentView("AUTH")}
            className="px-5 py-2.5 bg-[#0528d6] text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition"
          >
            Connexion
          </button>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ label, active, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-sm font-medium transition-colors
      ${
        active
          ? "text-[#0528d6]"
          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
      }`}
  >
    {icon}
    {label}
  </button>
);
