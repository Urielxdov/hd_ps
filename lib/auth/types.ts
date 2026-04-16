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
