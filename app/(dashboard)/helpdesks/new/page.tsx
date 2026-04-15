'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useDepartmentList } from '@/lib/departaments/use-helpdesk-list';
import type { Service } from '@/lib/types';

export default function NuevoHelpDesk() {
  const router = useRouter();
  const { user } = useAuth();
  const { state: deptState } = useDepartmentList();

  const [departmentId, setDepartmentId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!departmentId) {
      setServices([]);
      setServiceId('');
      return;
    }

    setLoadingServices(true);
    setServiceId('');
    api
      .getDepartmentServices(Number(departmentId))
      .then((data) => setServices(data))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, [departmentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId) return;

    setSubmitting(true);
    setError('');

    try {
      await api.createHelpDesk({
        service: Number(serviceId),
        origen: 'solicitud',
        prioridad: 'media',
        descripcion_problema: '',
      });
      router.push('/helpdesks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el ticket.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Nuevo Ticket</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Solicitante
          </label>
          <input
            type="text"
            readOnly
            value={user ? `Usuario #${user.user_id}` : ''}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-500"
          />
        </div>

        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Departamento
          </label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            disabled={deptState.loading}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {deptState.loading ? 'Cargando...' : 'Selecciona un departamento'}
            </option>
            {deptState.items.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Servicio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Servicio
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            disabled={!departmentId || loadingServices}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {!departmentId
                ? 'Selecciona un departamento primero'
                : loadingServices
                  ? 'Cargando servicios...'
                  : 'Selecciona un servicio'}
            </option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.nombre}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!serviceId || submitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creando...' : 'Crear Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
