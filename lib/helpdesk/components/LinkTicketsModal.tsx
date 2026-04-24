'use client';

import { useState } from 'react';
import { linkTickets } from '../api/incident.api';

interface Props {
  open: boolean;
  incidentId: number;
  onClose: () => void;
  onLinked: () => void;
}

export default function LinkTicketsModal({ open, incidentId, onClose, onLinked }: Props) {
  const [ticketIds, setTicketIds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const ids = ticketIds
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    if (ids.length === 0) {
      setError('Ingresa al menos un ID de ticket válido');
      return;
    }

    setLoading(true);
    try {
      await linkTickets(incidentId, ids);
      setTicketIds('');
      onLinked();
      onClose();
    } catch {
      setError('Error al vincular los tickets');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Vincular tickets</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              IDs de tickets (separados por coma)
            </label>
            <input
              type="text"
              value={ticketIds}
              onChange={(e) => setTicketIds(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 10, 11, 12"
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
              {loading ? 'Vinculando...' : 'Vincular'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
