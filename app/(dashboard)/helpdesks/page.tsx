'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { HelpDesk, Estado } from '@/lib/types';
import HDTable from '@/components/HDTable';

const ESTADO_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'abierto', label: 'Abierto' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'en_espera', label: 'En espera' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'cerrado', label: 'Cerrado' },
];

export default function MisHelpDesks() {
  const [helpdesks, setHelpdesks] = useState<HelpDesk[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoFilter, setEstadoFilter] = useState('');

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (estadoFilter) params.estado = estadoFilter;
      const data = await api.getHelpDesks(params);
      setHelpdesks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [estadoFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mis Help Desks</h1>
        <Link
          href="/helpdesks/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuevo HD
        </Link>
      </div>

      <div className="flex gap-2">
        {ESTADO_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setEstadoFilter(f.value)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              estadoFilter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <HDTable
          helpdesks={helpdesks}
          basePath="/helpdesks"
          showTechnician
        />
      )}
    </div>
  );
}
