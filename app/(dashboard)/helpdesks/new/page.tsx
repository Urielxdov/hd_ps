'use client';

import { useState, useEffect, type SubmitEvent as ReactSubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { createHelpDesk, AttachmentUploader } from '@/lib/helpdesk';
import { useDepartmentList } from '@/lib/department';
import { useServicesByDepartment } from '@/lib/catalog';

export default function NuevoHelpDesk() {
  const router = useRouter();
  const { user } = useAuth();
  const { state: deptState } = useDepartmentList();

  const [departmentId, setDepartmentId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [description, setDescription] = useState('');
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { services, loading: loadingServices } = useServicesByDepartment(
    departmentId ? Number(departmentId) : null
  );

  useEffect(() => {
    setServiceId('');
    setDescription('');
  }, [departmentId]);

  async function handleSubmit(e: ReactSubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!serviceId) return;

    setSubmitting(true);
    setError('');

    try {
      const hd = await createHelpDesk({
        service: Number(serviceId),
        origin: 'request',
        priority: 'medium',
        problem_description: description.trim(),
      });
      setCreatedId(hd.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el ticket.');
    } finally {
      setSubmitting(false);
    }
  }

  if (createdId) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Ticket creado</h1>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <AttachmentUploader helpDeskId={createdId} attachments={[]} onUpdate={() => {}} />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => router.push(`/helpdesks/${createdId}`)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Ver ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Nuevo Ticket</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Solicitante</label>
          <input
            type="text"
            readOnly
            value={user ? `Usuario #${user.user_id}` : ''}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            disabled={deptState.loading}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{deptState.loading ? 'Cargando...' : 'Selecciona un departamento'}</option>
            {deptState.items.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Servicio</label>
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
              <option key={svc.id} value={svc.id}>{svc.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción del problema</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            placeholder="Describe el problema..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!serviceId || !description.trim() || submitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creando...' : 'Crear Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
