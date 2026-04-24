'use client';

import { useState, useCallback } from 'react';
import { Activity, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { getMonitor } from '../api/helpdesk.api';
import type { MonitorResponse, MonitorCandidate } from '../types';

interface Props {
  onCreateFromCandidate: (candidate: MonitorCandidate) => void;
}

export default function IncidentMonitor({ onCreateFromCandidate }: Props) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<MonitorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState('');

  const scan = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (threshold) params.threshold = threshold;
      setData(await getMonitor(params));
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !data) scan();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={handleToggle}
        className="cursor-pointer w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-slate-600" />
          <span className="font-semibold text-slate-800">Monitor de incidentes</span>
          {data && data.candidates.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
              {data.candidates.length} candidato{data.candidates.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 px-6 py-4 space-y-4">
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Umbral puntual (override, opcional)
              </label>
              <input
                type="number"
                min="1"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder={data ? String(data.system_default_threshold) : '—'}
                className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={scan}
              disabled={loading}
              className="cursor-pointer px-3 py-1.5 text-xs bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Escaneando...' : 'Escanear'}
            </button>
            {data && (
              <span className="text-xs text-slate-400">
                {data.total_active_unlinked} tickets activos sin incidente
              </span>
            )}
          </div>

          {loading && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          )}

          {!loading && data && data.candidates.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">
              Ningún servicio supera el umbral configurado
            </p>
          )}

          {!loading && data && data.candidates.length > 0 && (
            <div className="space-y-3">
              {data.candidates.map((c) => (
                <div
                  key={c.service_id}
                  className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{c.service_name}</span>
                      <span className="text-xs text-slate-500">— {c.department_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>
                        <span className="font-semibold text-amber-700">{c.open_tickets}</span> tickets abiertos
                        {' '}(umbral: {c.threshold})
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="truncate max-w-xs">{c.folios.slice(0, 3).join(', ')}{c.folios.length > 3 ? ` +${c.folios.length - 3}` : ''}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onCreateFromCandidate(c)}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 ml-4"
                  >
                    <Zap size={13} />
                    Crear incidente
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
