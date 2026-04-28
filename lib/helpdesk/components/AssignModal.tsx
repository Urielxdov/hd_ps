'use client';

import { useState, useEffect } from 'react';
import Modal from '@/lib/shared/components/Modal';
import { assignHelpDesk } from '../api/helpdesk.api';

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  helpDeskId: number;
  /** Callback tras asignación exitosa — el padre decide si recargar o hacer UPDATE_ITEM. */
  onAssigned: () => void;
  /**
   * Pre-rellena el input cuando ya hay un técnico asignado (reasignación).
   *
   * @todo Reemplazar el input de ID manual por un selector de usuarios
   * una vez integrado el sistema corporativo.
   */
  currentAssigneeId?: number | null;
}

export default function AssignModal({ open, onClose, helpDeskId, onAssigned, currentAssigneeId }: AssignModalProps) {
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) setAssigneeId(currentAssigneeId ? String(currentAssigneeId) : '');
  }, [open, currentAssigneeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assigneeId) return;
    setLoading(true);
    setError('');
    try {
      await assignHelpDesk(helpDeskId, {
        assignee_id: Number(assigneeId),
        due_date: dueDate || undefined,
      });
      onAssigned();
      onClose();
      setAssigneeId('');
      setDueDate('');
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
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
