'use client';

import { useState } from 'react';
import Modal from './Modal';
import { api } from '@/lib/api';

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  helpDeskId: number;
  onAssigned: () => void;
}

export default function AssignModal({ open, onClose, helpDeskId, onAssigned }: AssignModalProps) {
  const [responsableId, setResponsableId] = useState('');
  const [fechaCompromiso, setFechaCompromiso] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!responsableId) return;
    setLoading(true);
    setError('');
    try {
      await api.assignHelpDesk(helpDeskId, {
        responsable_id: Number(responsableId),
        fecha_compromiso: fechaCompromiso || undefined,
      });
      onAssigned();
      onClose();
      setResponsableId('');
      setFechaCompromiso('');
    } catch {
      setError('Error al asignar el ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Asignar Tecnico">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            ID del Tecnico
          </label>
          <input
            type="number"
            min="1"
            value={responsableId}
            onChange={(e) => setResponsableId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha compromiso (opcional)
          </label>
          <input
            type="datetime-local"
            value={fechaCompromiso}
            onChange={(e) => setFechaCompromiso(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Asignando...' : 'Asignar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
