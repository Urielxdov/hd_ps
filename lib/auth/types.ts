/**
 * Roles disponibles en el sistema.
 *
 * Los valores deben coincidir exactamente con los que emite el backend
 * en el JWT — cualquier discrepancia rompe la sesión silenciosamente.
 * El orden en la unión no implica jerarquía; esa la define ROLE_HIERARCHY.
 */
export type Role = 'user' | 'technician' | 'area_admin' | 'super_admin';

/**
 * Representa la sesión activa del usuario almacenada en el contexto.
 *
 * `role` es siempre el rol real del usuario, nunca un override.
 * El rol activo (cuando hay switch) se gestiona por separado en el provider
 * para no mezclar identidad con vista.
 */
export interface AuthUser {
  user_id: number;
  role: Role;
  token: string;
}

/**
 * Ruta de inicio por rol tras autenticarse o cambiar de rol.
 *
 * `area_admin` y `super_admin` comparten la misma ruta por decisión
 * de negocio actual — aún no hay requerimientos que los diferencien.
 */
export const ROLE_HOME: Record<Role, string> = {
  user: '/helpdesks',
  technician: '/queue',
  area_admin: '/area/helpdesks',
  super_admin: '/area/helpdesks',
};

/**
 * Define qué roles puede asumir cada rol al hacer switch.
 *
 * Solo se listan roles de menor jerarquía — un rol nunca puede
 * asumir uno igual o superior. Array vacío significa sin acceso a switch.
 */
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  super_admin: ['area_admin', 'technician', 'user'],
  area_admin: ['technician', 'user'],
  technician: ['user'],
  user: [],
};

/** Etiquetas de presentación en UI para cada rol. */
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  area_admin: 'Admin Área',
  technician: 'Técnico',
  user: 'Usuario',
};
