// FILE: apps/mfe-agency/src/utils/permissions.ts

/* 
  Structure attendue de userData basée sur votre interface staff :
  {
    role: string,
    poste: {
      permissions: [{ tag: string, ... }]
    }
  }
*/

export const hasPermission = (userData: any, tag: string): boolean => {
  if (!userData) return false;

  // 1. Les rôles de haut niveau ont accès à tout par défaut
  if (userData.role === 'ORGANIZATION_OWNER' || userData.role === 'ADMIN') {
    return true;
  }

  // 2. Vérification dans la structure de "poste" pour le staff d'agence
  if (!userData.poste || !userData.poste.permissions) {
    return false;
  }

  // Vérifie si l'un des tags de permission correspond
  return userData.poste.permissions.some((p: any) => p.tag === tag);
};