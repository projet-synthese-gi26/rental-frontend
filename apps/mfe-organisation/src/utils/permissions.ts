// FILE: apps/mfe-organisation/src/utils/permissions.ts

export const hasPermission = (userData: any, tag: string): boolean => {
  if (!userData) return false;

  // Le propriétaire de l'organisation et l'Admin système ont tous les droits
  if (userData.role === 'ORGANIZATION_OWNER' || userData.role === 'ADMIN') {
    return true;
  }

  // Vérification pour le staff (via le poste et ses permissions)
  if (!userData.poste || !userData.poste.permissions) {
    return false;
  }

  return userData.poste.permissions.some((p: any) => p.tag === tag);
};