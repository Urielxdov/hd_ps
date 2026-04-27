import { apiClient } from '@/lib/shared/api/client';
import type { Role } from '../types';

/**
 * Autentica al usuario y obtiene un JWT de acceso.
 *
 * El backend no usa credenciales tradicionales: recibe el ID del usuario
 * y el rol que desea asumir. La validación de identidad ocurre en el servidor.
 *
 * @param userId - ID numérico del usuario en el sistema.
 * @param role   - Rol con el que inicia sesión (ej. "technician", "area_admin").
 * @returns Token JWT de acceso a incluir en las peticiones subsecuentes.
 *
 * @todo DEUDA TÉCNICA — Mecanismo de autenticación provisional.
 * El `user_id` numérico se usa para pruebas de integración con el backend existente.
 * La implementación definitiva usará el ID corporativo que ya poseen los usuarios
 * de la empresa, lo que implicará cambiar tanto este endpoint como el flujo
 * de login en el provider y posiblemente el tipo `AuthUser`.
 */
export async function login(
  userId: number,
  role: string
): Promise<{ access: string }> {
  return apiClient.request('/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, role }),
  });
}

/**
 * Cambia el rol activo del usuario sin cerrar sesión.
 *
 * Solo disponible para roles de mayor jerarquía (area_admin, super_admin).
 * El override se codifica en el JWT resultante, por lo que el backend
 * siempre usa el rol real para permisos de escritura — el cambio solo
 * afecta la vista y el filtrado de datos.
 *
 * Pasar `null` revierte al rol real del usuario.
 *
 * @param role - Rol a asumir, o `null` para revertir al rol original.
 * @returns Nuevo token JWT junto con el rol real y el rol activo resultante.
 */
export async function switchRole(
  role: Role | null
): Promise<{ token: string; role: Role; active_role: Role | null }> {
  return apiClient.request('/auth/switch-role/', {
    method: 'POST',
    body: JSON.stringify({ active_role: role }),
  });
}

/**
 * Obtiene el perfil del usuario autenticado desde el servidor.
 *
 * Se llama en cada recarga de la app porque el backend es la fuente de
 * verdad del rol activo — el frontend no confía únicamente en el token
 * guardado en localStorage.
 *
 * @returns ID del usuario, rol real y rol activo actual (si hay override).
 */
export async function getMe(): Promise<{ user_id: number; role: Role; active_role: Role | null }> {
  return apiClient.request('/auth/me/');
}
