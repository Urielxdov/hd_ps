'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/shared/api/client';
import { login as apiLogin, switchRole as apiSwitchRole, getMe } from './api/auth.api';
import type { AuthUser, Role } from './types';
import { ROLE_HOME } from './types';

/**
 * Contrato del contexto de autenticación.
 *
 * `user.role` es siempre el rol real del usuario.
 * `activeRole` es el rol efectivo para filtrado de datos y navegación —
 * puede diferir de `user.role` cuando hay un switch activo.
 */
interface AuthContextType {
  user: AuthUser | null;
  activeRole: Role | null;
  switchRole: (role: Role | null) => Promise<void>;
  login: (userId: number, role: Role) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Proveedor de sesión. Debe envolver toda la aplicación autenticada.
 *
 * Al montar, intenta restaurar la sesión desde localStorage.
 * El backend es la fuente de verdad: aunque exista token local,
 * siempre se confirma el rol llamando a getMe().
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      apiClient.setToken(token);
      getMe()
        .then(({ user_id, role, active_role }) => {
          setUser({ user_id, role, token });
          // active_role es null cuando no hay override activo; se usa el rol real.
          setActiveRoleState(active_role ?? role);
        })
        .catch(() => {
          // Token inválido o expirado: se limpia el estado local.
          // El guard de rutas del dashboard redirige al login.
          //
          // @todo DEUDA TÉCNICA — Manejo de token expirado provisional.
          // Actualmente un token inválido fuerza al usuario a hacer login de nuevo.
          // Al integrarse con el sistema corporativo existente, esto debe
          // reemplazarse por un refresco silencioso del token sin intervención
          // del usuario, ya que es un sistema interno de uso continuo.
          localStorage.removeItem('auth_token');
          apiClient.setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      apiClient.setToken(null);
      setLoading(false);
    }
  }, []);

  /**
   * Cambia el rol activo y actualiza el token con el override del backend.
   * El servidor confirma el rol real — no se confía en el estado local previo.
   * Pasar `null` revierte al rol real del usuario.
   */
  const switchRole = useCallback(async (role: Role | null) => {
    const { token, role: confirmedRole, active_role } = await apiSwitchRole(role);
    localStorage.setItem('auth_token', token);
    apiClient.setToken(token);
    setUser((prev) => (prev ? { ...prev, token, role: confirmedRole } : null));
    setActiveRoleState(active_role ?? confirmedRole);
  }, []);

  /**
   * Autentica al usuario, confirma su rol desde el servidor y redirige.
   *
   * Se llama a getMe() tras recibir el token para obtener el rol real
   * confirmado por el backend, sin confiar en el rol enviado en el login.
   */
  const login = useCallback(async (userId: number, role: Role) => {
    const { access: token } = await apiLogin(userId, role);

    localStorage.setItem('auth_token', token);
    apiClient.setToken(token);

    const { user_id, role: confirmedRole, active_role } = await getMe();
    setUser({ user_id, role: confirmedRole, token });
    setActiveRoleState(active_role ?? confirmedRole);
    router.push(ROLE_HOME[confirmedRole]);
  }, [router]);

  /**
   * Cierra la sesión limpiando el estado local y redirigiendo al login.
   *
   * @todo DEUDA TÉCNICA — Sin invalidación de token en el backend.
   * El JWT no tiene claim `exp` (no expira), el backend no verifica firma
   * (`verify_signature=False`) y no existe blacklist ni endpoint de revocación.
   * Esta decisión es provisional mientras se entiende cómo funciona
   * el sistema de autenticación corporativo existente, con la intención
   * de adaptarlo una vez se tenga acceso a su implementación.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    apiClient.setToken(null);
    setUser(null);
    setActiveRoleState(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, activeRole, switchRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de autenticación.
 * Lanza un error en desarrollo si se usa fuera del AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
