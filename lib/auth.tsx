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

function getStoredAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('auth_user');
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.setToken(user?.token ?? null);
  }, [user]);

  const login = useCallback(async (userId: number, role: Role) => {
    const response = await api.login(userId, role);
    console.log('LOGIN RESPONSE =>', response);

    const token = response.access; // Si llegan a cambiar la respuesta de DJango cambiemos esto
    const authUser: AuthUser = { user_id: userId, role, token: token };

    localStorage.setItem('auth_user', JSON.stringify(authUser));
    setUser(authUser);
    router.push(ROLE_HOME[role]);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user');
    setUser(null);
    api.setToken(null);
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