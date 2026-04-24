'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/shared/api/client';
import { login as apiLogin, switchRole as apiSwitchRole, getMe } from './api/auth.api';
import type { AuthUser, Role } from './types';
import { ROLE_HOME } from './types';

interface AuthContextType {
  user: AuthUser | null;
  activeRole: Role | null;
  switchRole: (role: Role | null) => Promise<void>;
  login: (userId: number, role: Role) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
          setActiveRoleState(active_role ?? role);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          apiClient.setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      apiClient.setToken(null);
      setLoading(false);
    }
  }, []);

  const switchRole = useCallback(async (role: Role | null) => {
    const { token, role: confirmedRole, active_role } = await apiSwitchRole(role);
    localStorage.setItem('auth_token', token);
    apiClient.setToken(token);
    setUser((prev) => (prev ? { ...prev, token, role: confirmedRole } : null));
    setActiveRoleState(active_role ?? confirmedRole);
  }, []);

  const login = useCallback(async (userId: number, role: Role) => {
    const { access: token } = await apiLogin(userId, role);

    localStorage.setItem('auth_token', token);
    apiClient.setToken(token);

    const { user_id, role: confirmedRole, active_role } = await getMe();
    setUser({ user_id, role: confirmedRole, token });
    setActiveRoleState(active_role ?? confirmedRole);
    router.push(ROLE_HOME[confirmedRole]);
  }, [router]);

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
