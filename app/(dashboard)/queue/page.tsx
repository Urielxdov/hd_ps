'use client';

import {
  useHelpDeskList, changeStatus,
  HDTable, type Status,
} from '@/lib/helpdesk';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'open', label: 'Abierto' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'on_hold', label: 'En espera' },
  { value: 'resolved', label: 'Resuelto' },
];

const PRIORITY_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Critica' },
];

export default function MiCola() {
  const { state, setFilter, load } = useHelpDeskList();

  async function handleQuickStatusChange(id: number, newStatus: Status) {
    try {
      await changeStatus(id, newStatus);
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
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter('status', f.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  state.filters.status === f.value
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
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter('priority', f.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  state.filters.priority === f.value
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

      {state.loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <HDTable
          helpdesks={state.items}
          basePath="/queue"
          showPriority
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}
    </div>
  );
}
