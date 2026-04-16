'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/auth';

const ROLES: { value: Role; label: string }[] = [
  { value: 'user', label: 'Usuario' },
  { value: 'technician', label: 'Tecnico' },
  { value: 'area_admin', label: 'Admin de area' },
  { value: 'super_admin', label: 'Super Admin' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [userId, setUserId] = useState('1');
  const [role, setRole] = useState<Role>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(Number(userId), role);
    } catch {
      setError('Error al iniciar sesion. Verifica que el backend este corriendo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Help Desk</h1>
          <p className="text-slate-500 mt-1">Pro Servicio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-1">
              ID de Usuario
            </label>
            <input
              id="userId"
              type="number"
              min="1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
              Rol
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
