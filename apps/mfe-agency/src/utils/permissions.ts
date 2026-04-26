/* eslint-disable @typescript-eslint/no-explicit-any */

export const hasPermission = (userData: any, staffPermissions: any, tag: string): boolean => {
  if (!userData) return false;

  if (['ORGANIZATION_OWNER', 'ADMIN'].includes(userData.role)) {
    return true;
  }

  if (!Array.isArray(staffPermissions)) return false;

  // console.log(tag, staffPermissions.some((p: any) => p.tag === tag), staffPermissions);

  return staffPermissions.some((p: any) => p.tag === tag);
};