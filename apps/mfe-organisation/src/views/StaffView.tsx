/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Plus, Search, Loader2, MapPin, UserCheck } from 'lucide-react';
import { agencyService, staffService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { StaffCard } from './staff/StaffCard';
import { StaffFormModal } from './staff/StaffFormModal';

export const StaffView = ({ orgData }: { orgData: any }) => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [postes, setPostes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!orgData?.id) return;
    setLoading(true);
    try {
      const [staffRes, agRes, postRes] = await Promise.all([
        staffService.getStaffByOrg(orgData.id),
        agencyService.getAgencies(orgData.id),
        staffService.getPostes(orgData.id)
      ]);
      if (staffRes.ok) setStaffList(staffRes.data || []);
      if (agRes.ok) setAgencies(agRes.data || []);
      if (postRes.ok) setPostes(postRes.data || []);
    } finally { setLoading(false); }
  }, [orgData?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (formData: any) => {
    setModalLoading(true);
    try {
      const res = editingStaff 
        ? await staffService.updateStaff(editingStaff.id, {
            firstname: formData.firstname,
            lastname: formData.lastname,
            agencyId: formData.agencyId,
            posteId: formData.posteId,
            status: formData.status
          })
        : await staffService.addStaff(orgData.id, {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            agencyId: formData.agencyId,
            posteId: formData.posteId
          });
      
      if (res.ok) { setIsModalOpen(false); loadData(); }
      else { alert(res.data?.message || "Erreur lors de l'opération"); }
    } finally { setModalLoading(false); }
  };

  const filteredStaff = useMemo(() => staffList.filter(s => {
    const nameMatch = `${s.firstname} ${s.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const agencyMatch = selectedAgency === 'all' || s.agencyId === selectedAgency;
    return nameMatch && agencyMatch;
  }), [staffList, searchTerm, selectedAgency]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. STATS RÉELLES (DTO: OrgResponseDTO) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Effectif total" value={staffList.length} icon={<Users />} />
        <StatCard label="Agences couvertes" value={new Set(staffList.map(s => s.agencyId)).size} icon={<MapPin />} />
        <StatCard label="Contrats actifs" value={staffList.filter(s => s.status === 'ACTIVE').length} icon={<UserCheck className="text-green-500"/>} />
      </div>

      {/* 2. ACTIONS & FILTRES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row flex-1 w-full gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
            <input placeholder="Rechercher un membre ou un email..." className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0528d6]/20 font-medium dark:text-white" 
                   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs font-bold uppercase italic outline-none focus:ring-2 focus:ring-[#0528d6]/20">
            <option value="all">🏢 Toutes les agences</option>
            {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <button onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
                className="w-full xl:w-auto px-6 py-3 bg-[#0528d6] text-white rounded-lg font-bold text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
          <Plus size={18} /> Recruter staff
        </button>
      </div>

      {/* 3. GRILLE STAFF */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.map(staff => (
          <StaffCard key={staff.id} staff={staff} agencies={agencies}
                     onEdit={(s: any) => { setEditingStaff(s); setIsModalOpen(true); }} 
                     onDelete={async (id: string) => { if(confirm('Supprimer cet accès ?')) { await staffService.deleteStaff(id); loadData(); } }}
                     onView={(s: any) => alert(`Détails de ${s.firstname} (Fonctionnalité en cours)`)} />
        ))}
      </div>

      {/* 4. MODAL FORMULAIRE */}
      {isModalOpen && (
        <StaffFormModal 
          editingStaff={editingStaff}
          agencies={agencies}
          postes={postes}
          initialData={editingStaff ? { ...editingStaff, posteId: editingStaff.poste?.id } 
                                    : { firstname: '', lastname: '', email: '', agencyId: '', posteId: '', status: 'ACTIVE' }}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          modalLoading={modalLoading}
        />
      )}
    </div>
  );
};