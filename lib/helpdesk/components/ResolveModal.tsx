'use client';

import { useState } from 'react';
import Modal from '@/lib/shared/components/Modal';
import { resolveHelpDesk } from '../api/helpdesk.api';

interface ResolveModalProps {
  open: boolean;
  onClose: () => void;
  helpDeskId: number;
  onResolved: () => void;
}

export default function ResolveModal({ open, onClose, helpDeskId, onResolved }: ResolveModalProps) {
  const [solutionDescription, setSolutionDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!solutionDescription.trim()) return;
    setLoading(true);
    setError('');
    try {
      await resolveHelpDesk(helpDeskId, solutionDescription.trim());
      onResolved();
      onClose();
      setSolutionDescription('');
    } catch {
      setError('Error al resolver. Verifica que el estado actual permita esta accion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Resolver Ticket">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descripcion de la solucion
          </label>
          <textarea
            value={solutionDescription}
            onChange={(e) => setSolutionDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe la solucion aplicada..."
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !solutionDescription.trim()}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Resolviendo...' : 'Resolver'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
