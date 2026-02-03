/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Shield, LayoutGrid, Loader2, AlertCircle, Clock, Zap } from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';
import { PlanCard } from './subscription/PlanCard';

export const SubscriptionView = ({ orgData }: any) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [realAgenciesCount, setRealAgenciesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadSubscriptionData(); }, [orgData?.id]);

  const loadSubscriptionData = async () => {
    if (!orgData?.id) return;
    setLoading(true);
    try {
      const [plansRes, subRes, agenciesRes] = await Promise.all([
        orgService.getPlans(),
        orgService.getSubscription(orgData.id),
        orgService.getAgencies(orgData.id)
      ]);
      
      if (plansRes.ok) setPlans(plansRes.data);
      if (subRes.ok) setCurrentSub(subRes.data);
      if (agenciesRes.ok) setRealAgenciesCount(agenciesRes.data?.length || 0);
      
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planName: string) => {
    if (!orgData?.id) return;
    const isCancellation = planName === 'FREE';
    if (isCancellation && !window.confirm("Voulez-vous vraiment repasser au plan gratuit ? Certains accès seront limités.")) return;

    setActionLoading(planName);
    try {
      const res = await orgService.upgradePlan(orgData.id, planName as any);
      if (res.ok) {
        await loadSubscriptionData();
        alert(isCancellation ? "Retour au plan FREE effectué." : `Félicitations ! Vous êtes passé au plan ${planName}`);
      }
    } catch {
      alert("Erreur lors du changement de plan.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  const isFreePlan = currentSub?.planName === 'FREE';

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      
      {/* SECTION 1 : STATUT ACTUEL */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <Shield className="text-[#0528d6]" size={20} />
          <h4 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">État de la licence</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte Plan Actuel */}
          <div className="lg:col-span-1 bg-[#0528d6] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
            <Zap size={180} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
            <div className="relative z-10 space-y-4">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                Licence active
              </span>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">
                {currentSub?.planName || "---"}
              </h3>
              <div className="flex items-center gap-2 text-blue-100 text-[11px] font-bold uppercase tracking-tight italic pt-2">
                <Clock size={14} /> 
                {currentSub?.expiresAt ? `Expire le ${new Date(currentSub.expiresAt).toLocaleDateString()}` : "Validité illimitée"}
              </div>
            </div>
          </div>

          {/* Jauge d'évolution des Quotas */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2d] p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-tight">
              <div className="flex items-center gap-3 text-[#0528d6]">
                <LayoutGrid size={20}/> Consommation des points de vente
              </div>
              <span className="text-slate-400 text-sm font-black">{realAgenciesCount} / {currentSub?.maxAgencies || 1}</span>
            </div>
            
            <div className="h-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
              <div 
                className={`h-full transition-all duration-1000 rounded-full ${ (realAgenciesCount / (currentSub?.maxAgencies || 1)) >= 0.85 ? 'bg-[#F76513]' : 'bg-[#0528d6]'}`} 
                style={{ width: `${Math.min((realAgenciesCount / (currentSub?.maxAgencies || 1)) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-4 text-[10px] font-medium text-slate-400 italic">
              Cette jauge indique le nombre d&apos;agences physiques actives sur votre réseau par rapport à votre limite autorisée.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 : CATALOGUE */}
      <section className="space-y-8">
        <div className="text-center space-y-1">
          <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none italic">Plans disponibles</h4>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Optimisez votre infrastructure réseau</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              isCurrent={currentSub?.planName === plan.name}
              onSelect={handlePlanChange}
              loading={actionLoading === plan.name}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3 : ANNULATION (Zone de danger) */}
      {!isFreePlan && (
        <section className="bg-red-50/30 dark:bg-red-950/10 p-8 rounded-[2rem] border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 shadow-inner shrink-0">
              <AlertCircle size={28} />
            </div>
            <div className="text-left">
              <h5 className="text-lg font-bold text-red-600 tracking-tight">Zone de danger</h5>
              <p className="text-xs text-slate-500 max-w-sm font-medium italic leading-relaxed">
                Le passage au plan FREE désactivera les fonctionnalités premium (Chat, Geofencing) et pourrait bloquer la création de nouvelles agences.
              </p>
            </div>
          </div>
          <button 
            onClick={() => handlePlanChange('FREE')}
            disabled={!!actionLoading}
            className="px-8 py-3 bg-white text-red-500 rounded-xl font-bold text-xs uppercase shadow-sm border border-red-100 hover:bg-red-500 hover:text-white transition-all shrink-0"
          >
            {actionLoading === 'FREE' ? <Loader2 className="animate-spin size-4" /> : "Résilier l'abonnement"}
          </button>
        </section>
      )}

    </div>
  );
};