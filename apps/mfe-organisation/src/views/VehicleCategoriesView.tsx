'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, Plus, Search, Lock, Edit3, Trash2, 
  X, Loader2, CheckCircle2 
} from 'lucide-react';
import { orgService } from '@pwa-easy-rental/shared-services';

export const VehicleCategoriesView = ({ orgData, t }: { orgData: any, t: any }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'SYSTEM' | 'CUSTOM'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { 
    if (orgData?.id) loadData(); 
  }, [orgData?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // On passe l'ID de l'organisation pour récupérer le mix Système + Custom
      const res = await orgService.getVehicleCategories(orgData.id);
      if (res.ok) setCategories(res.data || []);
      console.log('Loaded categories:', res.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           cat.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isSystem = cat.organizationId === null;
      if (filterTab === 'SYSTEM') return matchesSearch && isSystem;
      if (filterTab === 'CUSTOM') return matchesSearch && !isSystem;
      return matchesSearch;
    });
  }, [categories, searchTerm, filterTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = editingCat 
        ? await orgService.updateCategory(editingCat.id, formData)
        : await orgService.createCategory(orgData.id, formData);
      
      if (res.ok) {
        setIsModalOpen(false);
        setEditingCat(null);
        setFormData({ name: '', description: '' });
        loadData();
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.categories.deleteConfirm)) {
      await orgService.deleteCategory(id);
      loadData();
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-primary size-12" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-4xl font-[900] italic uppercase text-slate-900 dark:text-white leading-none tracking-tighter">
            {t.categories.title}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">
            {t.categories.subtitle}
          </p>
        </div>
        <button 
          onClick={() => { setEditingCat(null); setFormData({name:'', description:''}); setIsModalOpen(true); }}
          className="px-8 py-4 bg-[#F76513] text-white rounded-2xl font-[900] uppercase italic text-xs shadow-xl shadow-orange-200 dark:shadow-none hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> {t.categories.addBtn}
        </button>
      </div>

      {/* FILTRES & RECHERCHE */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full lg:w-auto border border-slate-200 dark:border-slate-800">
          {[
            { id: 'ALL', label: t.categories.filterAll },
            { id: 'SYSTEM', label: t.categories.filterSystem },
            { id: 'CUSTOM', label: t.categories.filterCustom }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-[10px] font-[900] uppercase italic transition-all ${filterTab === tab.id ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t.categories.searchPlaceholder}
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-sm dark:text-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* GRILLE DES CATÉGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const isSystem = cat.organizationId === null;
          return (
            <div key={cat.id} className={`bg-white dark:bg-[#1a1d2d] rounded-[3rem] p-8 border-2 ${isSystem ? 'border-blue-50 dark:border-blue-900/20' : 'border-slate-50 dark:border-slate-800'} shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col`}>
              
              <div className="flex justify-between items-start mb-6">
                <div className={`size-14 rounded-2xl flex items-center justify-center ${isSystem ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-50 dark:bg-slate-800 text-primary'} transition-colors`}>
                  <LayoutGrid size={28} />
                </div>
                <div className="flex gap-2">
                  {!isSystem ? (
                    <>
                      <button onClick={() => { setEditingCat(cat); setFormData({name:cat.name, description:cat.description}); setIsModalOpen(true); }} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-300 hover:text-primary transition-colors"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </>
                  ) : (
                    <div className="p-2 text-slate-200" title="Standard Système"><Lock size={18} /></div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-[900] italic uppercase text-slate-900 dark:text-white leading-none">{cat.name}</h4>
                    {isSystem && <CheckCircle2 size={14} className="text-blue-500" />}
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  {cat.description || "Aucune description spécifiée."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                 <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isSystem ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-[#F76513]'}`}>
                    {isSystem ? t.categories.systemLabel : t.categories.customLabel}
                 </span>
                 <span className="text-[10px] font-black text-slate-200 dark:text-slate-800">#{cat.id.substring(0,4)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL (DRAWER PLEINE HAUTEUR) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <form onSubmit={handleSubmit} className="relative w-full max-w-md h-full bg-white dark:bg-[#1a1d2d] p-10 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="flex justify-between items-center mb-12">
                <h3 className="text-3xl font-[900] italic uppercase text-slate-900 dark:text-white leading-none tracking-tighter">
                    {editingCat ? t.categories.modal.edit : t.categories.modal.add}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full dark:text-white"><X size={24}/></button>
            </div>

            <div className="space-y-8 flex-1">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 italic tracking-widest">{t.categories.modal.name}</label>
                    <input 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary dark:text-white transition-all" 
                      placeholder="ex: Premium SUV"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 italic tracking-widest">{t.categories.modal.desc}</label>
                    <textarea 
                      rows={5}
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary dark:text-white transition-all" 
                      placeholder="Décrivez les critères de cette catégorie..."
                    />
                </div>
            </div>

            <button 
                disabled={modalLoading}
                className="w-full py-6 bg-[#F76513] text-white rounded-[2rem] font-[900] uppercase italic text-sm shadow-xl shadow-orange-200 dark:shadow-none flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95"
            >
                {modalLoading ? <Loader2 className="animate-spin" /> : t.categories.modal.submit}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};