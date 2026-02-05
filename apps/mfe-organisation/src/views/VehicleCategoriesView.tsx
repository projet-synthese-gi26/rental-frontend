/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LayoutGrid, Plus, Search, Loader2, ShieldCheck, Box } from 'lucide-react';
import { vehicleService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { CategoryCard } from './categories/CategoryCard';
import { CategoryFormModal } from './categories/CategoryFormModal';

export const VehicleCategoriesView = ({ orgData }: { orgData: any }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'SYSTEM' | 'CUSTOM'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!orgData?.id) return;
    setLoading(true);
    try {
      const res = await vehicleService.getVehicleCategories(orgData.id);
      if (res.ok) setCategories(res.data || []);
    } finally {
      setLoading(false);
    }
  }, [orgData?.id]);

  useEffect(() => { loadData(); }, [loadData]);

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

  const handleSubmit = async (formData: any) => {
    setModalLoading(true);
    try {
      const res = editingCat 
        ? await vehicleService.updateCategory(editingCat.id, formData)
        : await vehicleService.createCategory(orgData.id, formData);
      
      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cette catégorie ? Les véhicules associés devront être réaffectés.")) {
      await vehicleService.deleteCategory(id);
      loadData();
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total catégories" value={categories.length} icon={<LayoutGrid />} />
        <StatCard label="Standards Rental" value={categories.filter(c => c.organizationId === null).length} icon={<ShieldCheck />} />
        <StatCard label="Mes personnalisées" value={categories.filter(c => c.organizationId !== null).length} icon={<Box />} />
      </div>

      {/* 2. FILTRES & ACTIONS */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white dark:bg-[#1a1d2d] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-full lg:w-auto">
          {[
            { id: 'ALL', label: 'Toutes' },
            { id: 'SYSTEM', label: 'Standards' },
            { id: 'CUSTOM', label: 'Mes types' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-6 py-2 rounded-md text-[11px] font-bold uppercase italic transition-all ${
                filterTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 text-[#0528d6] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input 
            placeholder="Rechercher une catégorie (Luxe, SUV...)"
            className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0528d6]/20 font-medium dark:text-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          onClick={() => { setEditingCat(null); setIsModalOpen(true); }}
          className="w-full lg:w-auto px-6 py-3 bg-[#0528d6] text-white rounded-lg font-bold text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus size={18} /> Nouvelle catégorie
        </button>
      </div>

      {/* 3. GRILLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            onEdit={(c: any) => { setEditingCat(c); setIsModalOpen(true); }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 4. MODAL */}
      {isModalOpen && (
        <CategoryFormModal 
          editingCat={editingCat}
          initialData={editingCat ? { name: editingCat.name, description: editingCat.description } : { name: '', description: '' }}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          modalLoading={modalLoading}
        />
      )}
    </div>
  );
};