export const ROLES = {
  ADMIN: 'ADMIN',
  RESOLVER: 'RESOLVER',
  COMPLAINANT: 'COMPLAINANT',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['all'],
  [ROLES.RESOLVER]: ['dashboard', 'complaints', 'resolver_tasks'],
  [ROLES.COMPLAINANT]: ['dashboard', 'complaints'],
};

export const can = (role: string, action: string) => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes('all') || permissions.includes(action);
};