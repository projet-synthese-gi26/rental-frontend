// FILE: apps/mfe-agency/src/utils/permissions.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export const hasPermission = (userData: any, tag: string): boolean => {
  if (!userData) return false;
  if (userData.role === 'ORGANIZATION_OWNER' || userData.role === 'ADMIN') return true;
  if (!userData.poste || !userData.poste.permissions) return true;//false;
  return userData.poste.permissions.some((p: any) => p.tag === tag);
};