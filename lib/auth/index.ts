/**
 * Módulo de autenticación y gestión de roles.
 *
 * Expone el proveedor de contexto, el hook de sesión y las constantes
 * de jerarquía de roles. El resto del sistema no debe importar
 * directamente desde subcarpetas — todo pasa por este índice.
 */
export { AuthProvider, useAuth } from './provider';
export { ROLE_HOME, ROLE_HIERARCHY, ROLE_LABELS } from './types';
export type { AuthUser, Role } from './types';
