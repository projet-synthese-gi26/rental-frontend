'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';
import { extraService } from '@pwa-easy-rental/shared-services';

export const LogoUpload = ({ value, onUploadSuccess }: { value: string, onUploadSuccess: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Synchronisation de la preview locale si la valeur change de l'extérieur
  useEffect(() => {
    if (value) setLocalPreview(null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. LOG DE TEST (Doit apparaître dès la sélection)
    console.log("🔥 Fichier détecté :", file.name);

    // 2. Prévisualisation locale immédiate (FileReader)
    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 3. Préparation de l'envoi
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      console.log("📡 Envoi vers le serveur...");
      const res = await extraService.uploadMedia(formData);
      console.log("✅ Réponse serveur :", res);

      if (res.ok && res.data?.url) {
        let finalUrl = res.data.url;
        // Correction si l'URL est relative (Render)
        if (!finalUrl.startsWith('http')) {
            finalUrl = `https://apirental5gi-v2.onrender.com${finalUrl.startsWith('/') ? '' : '/'}${finalUrl}`;
        }
        console.log("🔗 URL finale :", finalUrl);
        onUploadSuccess(finalUrl);
      } else {
        throw new Error(res.data?.message || "Erreur serveur");
      }
    } catch (error) {
      console.error("❌ Échec de l'upload :", error);
      setLocalPreview(null); // On annule la preview si ça échoue
      alert("Erreur lors du téléchargement de l'image.");
    } finally {
      setUploading(false);
    }
  };

  // L'image à afficher est soit la preview locale (pendant l'upload) soit la valeur finale (value)
  const displayImage = localPreview || value;

  return (
    <div className="space-y-2 group w-full">
      <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider ml-1 italic">
        Logo de l&apos;organisation <span className="text-[#0528d6]">*</span>
      </label>
      
      {/* Conteneur principal */}
      <div className={`
        relative h-40 w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
        ${displayImage ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-slate-50 hover:border-[#0528d6] hover:bg-white'}
      `}>
        
        {/* L'INPUT EST ICI : Toujours présent, invisible, et au-dessus de tout (z-10) */}
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer z-20" 
          title=""
        />

        {/* AFFICHAGE CONDITIONNEL DU CONTENU (Z-0) */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4 pointer-events-none">
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-[#0528d6]" size={32} />
              <span className="text-[10px] font-black text-[#0528d6] uppercase tracking-widest">Upload en cours...</span>
            </div>
          ) : displayImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
               <img 
                src={displayImage} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain" 
               />
               <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-md border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={14} />
                  <span className="text-[9px] font-black uppercase text-slate-500">Prêt</span>
               </div>
            </div>
          ) : (
            <>
              <UploadCloud className="text-slate-300 mb-2 transition-colors group-hover:text-[#0528d6]" size={40} />
              <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Cliquer pour choisir</p>
                  <p className="text-[9px] text-slate-400 italic">PNG ou JPG (max. 2Mo)</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};