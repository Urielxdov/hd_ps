'use client';

import { useState, useEffect } from 'react';
import { createIncident } from '../api/incident.api';

interface InitialValues {
  service: number;
  ticketIds: number[];
  description?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  initialValues?: InitialValues;
}

export default function CreateIncidentModal({ open, onClose, onCreated, initialValues }: Props) {
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [ticketIds, setTicketIds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && initialValues) {
      setService(String(initialValues.service));
      setTicketIds(initialValues.ticketIds.join(', '));
      setDescription(initialValues.description ?? '');
    }
    if (!open) {
      setService('');
      setDescription('');
      setDueDate('');
      setTicketIds('');
      setError(null);
    }
  }, [open, initialValues]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const serviceNum = parseInt(service, 10);
    if (!serviceNum || isNaN(serviceNum)) {
      setError('Ingresa un ID de servicio válido');
      return;
    }

    const ids = ticketIds
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    setLoading(true);
    try {
      await createIncident({
        service: serviceNum,
        description_problema: description,
        ...(dueDate ? { due_date: new Date(dueDate).toISOString() } : {}),
        ...(ids.length > 0 ? { ticket_ids: ids } : {}),
      });
      onCreated();
      onClose();
    } catch {
      setError('Error al crear el incidente');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Crear incidente</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              ID del servicio afectado <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 3"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Descripción del problema <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Caída del servidor de producción..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Fecha límite (opcional)
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Vincular tickets (IDs separados por coma, opcional)
            </label>
            <input
              type="text"
              value={ticketIds}
              onChange={(e) => setTicketIds(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 1, 2, 5, 8"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear incidente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
