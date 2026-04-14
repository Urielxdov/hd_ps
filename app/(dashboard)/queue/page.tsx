'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { HelpDesk, Estado } from '@/lib/types';
import HDTable from '@/components/HDTable';

const ESTADO_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'abierto', label: 'Abierto' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'en_espera', label: 'En espera' },
  { value: 'resuelto', label: 'Resuelto' },
];

const PRIORIDAD_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Critica' },
];

export default function MiCola() {
  const [helpdesks, setHelpdesks] = useState<HelpDesk[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoFilter, setEstadoFilter] = useState('');
  const [prioridadFilter, setPrioridadFilter] = useState('');

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (estadoFilter) params.estado = estadoFilter;
      if (prioridadFilter) params.prioridad = prioridadFilter;
      const data = await api.getHelpDesks(params);
      setHelpdesks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [estadoFilter, prioridadFilter]);

  async function handleQuickStatusChange(id: number, newStatus: Estado) {
    try {
      await api.changeStatus(id, newStatus);
      await load();
    } catch {
      alert('Error al cambiar estado. Verifica la transicion.');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mi Cola</h1>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Estado</label>
          <div className="flex gap-1">
            {ESTADO_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setEstadoFilter(f.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  estadoFilter === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Prioridad</label>
          <div className="flex gap-1">
            {PRIORIDAD_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setPrioridadFilter(f.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  prioridadFilter === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <HDTable
          helpdesks={helpdesks}
          basePath="/queue"
          showPriority
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}
    </div>
  );
}
