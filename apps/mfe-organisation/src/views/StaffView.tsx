/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Plus, Search, Loader2, MapPin, UserCheck, ChevronLeft, ChevronRight, Key } from 'lucide-react';
import { agencyService, staffService } from '@pwa-easy-rental/shared-services';
import { StatCard } from '../components/StatCard';
import { StaffCard } from './staff/StaffCard';
import { StaffFormModal } from './staff/StaffFormModal';
import { StaffDetailsModal } from './staff/StaffDetailsModal';
import { Portal } from '@/components/Portal';

const ITEMS_PER_PAGE = 6;

export const StaffView = ({ orgData, t }: { orgData: any, t: any }) => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [postes, setPostes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<'FORM' | 'DETAILS' | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

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

  const filteredStaff = useMemo(() => staffList.filter(s => 
    `${s.firstname} ${s.lastname} ${s.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [staffList, searchTerm]);

  const paginated = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);

  const handleSubmit = async (formData: any) => {
    setModalLoading(true);
    const isNew = !selectedStaff;
    try {
        const res = selectedStaff 
          ? await staffService.updateStaff(selectedStaff.id, formData)
          : await staffService.addStaff(orgData.id, formData);
        
        if (res.ok) { 
          setActiveModal(null); 
          loadData(); 
          if (isNew) setShowPasswordPopup(true);
        }
    } finally {
        setModalLoading(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#0528d6] size-10" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label={t.staff.statTotal} value={staffList.length} icon={<Users />} />
        <StatCard label={t.staff.statRoles} value={postes.length} icon={<MapPin className="text-orange-500" />} />
        <StatCard label={t.staff.statActive} value={staffList.filter(s => s.status === 'ACTIVE').length} icon={<UserCheck className="text-green-500"/>} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a1d2d] p-4 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-96 group text-left">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0528d6]" size={18} />
          <input placeholder={t.staff.searchPlaceholder} className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-black italic outline-none focus:ring-2 focus:ring-[#0528d6]/20 transition-all dark:text-white" 
                 value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
        </div>
        <button onClick={() => { setSelectedStaff(null); setActiveModal('FORM'); }} className="w-full md:w-auto px-6 py-3 bg-[#0528d6] text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all italic">
          <Plus size={18} /> {t.staff.recruitBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 text-left">
        {paginated.map(staff => (
          <StaffCard key={staff.id} staff={staff} agencies={agencies}
                     onView={(id: string) => { setSelectedStaff(id); setActiveModal('DETAILS'); }}
                     onEdit={(s: any) => { setSelectedStaff(s); setActiveModal('FORM'); }}
                     onDelete={async (id: string) => { if(confirm(t.staff.deleteConfirm)) { await staffService.deleteStaff(id); loadData(); } }}
                     t={t}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"><ChevronLeft/></button>
          <span className="text-[10px] font-black text-slate-500 uppercase italic px-4 tracking-widest">{t.common.page} {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="size-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"><ChevronRight/></button>
        </div>
      )}

      {/* POPUP SÉCURITÉ */}
      {showPasswordPopup && (
        <Portal>
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowPasswordPopup(false)} />
            <div className="relative w-full max-w-sm bg-white dark:bg-[#1a1d2d] rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in border border-white/20">
              <div className="size-20 bg-blue-50 dark:bg-blue-500/10 rounded-3xl flex items-center justify-center text-[#0528d6] mx-auto mb-6 shadow-inner">
                <Key size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-2 leading-none">{t.staff.popupTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-8">
                {t.staff.popupDesc}
                <span className="block mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-mono text-xl font-black text-[#0528d6] border-2 border-blue-100 dark:border-blue-900/50 shadow-sm">password123</span>
              </p>
              <button onClick={() => setShowPasswordPopup(false)} className="w-full py-4 bg-[#0528d6] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all italic">{t.staff.popupBtn}</button>
            </div>
          </div>
        </Portal>
      )}

      {activeModal === 'DETAILS' && <StaffDetailsModal staffId={selectedStaff} onClose={() => setActiveModal(null)} t={t} />}
      {activeModal === 'FORM' && (
        <StaffFormModal 
          t={t}
          editingStaff={selectedStaff} agencies={agencies} postes={postes}
          initialData={selectedStaff ? { ...selectedStaff, posteId: selectedStaff.poste?.id } : { firstname: '', lastname: '', email: '', agencyId: '', posteId: '', status: 'ACTIVE' }}
          onClose={() => setActiveModal(null)} onSubmit={handleSubmit} modalLoading={modalLoading}
        />
      )}
    </div>
  );
};