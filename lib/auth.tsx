'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';
import type { AuthUser, Role } from './types';

interface AuthContextType {
  user: AuthUser | null;
  login: (userId: number, role: Role) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ROLE_HOME: Record<Role, string> = {
  user: '/helpdesks',
  technician: '/queue',
  area_admin: '/area/helpdesks',
  super_admin: '/area/helpdesks',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
        api.setToken(parsed.token);
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (userId: number, role: Role) => {
    const { token } = await api.login(userId, role);
    const authUser: AuthUser = { user_id: userId, role, token };
    localStorage.setItem('auth_user', JSON.stringify(authUser));
    api.setToken(token);
    setUser(authUser);
    router.push(ROLE_HOME[role]);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user');
    api.setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLE_HOME };
