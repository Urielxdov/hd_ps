'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/shared/api/client';
import { login as apiLogin } from './api/auth.api';
import type { AuthUser, Role } from './types';
import { ROLE_HOME, ROLE_HIERARCHY } from './types';

interface AuthContextType {
  user: AuthUser | null;
  activeRole: Role | null;
  setActiveRole: (role: Role) => void;
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
    const stored = localStorage.getItem('auth_user');

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
        apiClient.setToken(parsed.token ?? null);
      } catch {
        localStorage.removeItem('auth_user');
        apiClient.setToken(null);
      }
    } else {
      apiClient.setToken(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      apiClient.setToken(user?.token ?? null);
      setActiveRoleState(user?.role ?? null);
    }
  }, [user, loading]);

  const setActiveRole = useCallback((role: Role) => {
    if (!user) return;
    if (role === user.role || ROLE_HIERARCHY[user.role].includes(role)) {
      setActiveRoleState(role);
    }
  }, [user]);

  const login = useCallback(async (userId: number, role: Role) => {
    const response = await apiLogin(userId, role);
    console.log('LOGIN RESPONSE =>', response);

    const token = response.access;
    const authUser: AuthUser = { user_id: userId, role, token };

    localStorage.setItem('auth_user', JSON.stringify(authUser));
    apiClient.setToken(token);
    setUser(authUser);
    router.push(ROLE_HOME[role]);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user');
    apiClient.setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, activeRole, setActiveRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
