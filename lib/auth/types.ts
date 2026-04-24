export type Role = 'user' | 'technician' | 'area_admin' | 'super_admin';

export interface AuthUser {
  user_id: number;
  role: Role;
  token: string;
}

export const ROLE_HOME: Record<Role, string> = {
  user: '/helpdesks',
  technician: '/queue',
  area_admin: '/area/helpdesks',
  super_admin: '/area/helpdesks',
};

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  super_admin: ['area_admin', 'technician', 'user'],
  area_admin: ['technician', 'user'],
  technician: ['user'],
  user: [],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  area_admin: 'Admin Área',
  technician: 'Técnico',
  user: 'Usuario',
};
