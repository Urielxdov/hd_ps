'use client';

import { HDTable, useHelpDeskList } from '@/lib/helpdesk';

const ESTADO_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'abierto', label: 'Abierto' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'en_espera', label: 'En espera' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'cerrado', label: 'Cerrado' },
];

const PRIORIDAD_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Critica' },
];

export default function PanelArea() {
  const { state, setFilter } = useHelpDeskList();

  const abiertos = state.items.filter((h) => h.estado === 'abierto').length;
  const enProgreso = state.items.filter((h) => h.estado === 'en_progreso').length;
  const hoy = new Date().toDateString();

  const resueltosHoy = state.items.filter(
    (h) =>
      h.estado === 'resuelto' &&
      h.fecha_efectividad &&
      new Date(h.fecha_efectividad).toDateString() === hoy
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Panel del Area</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Abiertos</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{abiertos}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">En progreso</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{enProgreso}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Resueltos hoy</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{resueltosHoy}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Estado</label>
          <div className="flex gap-1">
            {ESTADO_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter('estado', f.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  state.filters.estado === f.value
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
                onClick={() => setFilter('prioridad', f.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  state.filters.prioridad === f.value
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
          <label className="block text-xs text-slate-500 mb-1">Tecnico (ID)</label>
          <input
            type="number"
            min="1"
            value={state.filters.responsable_id}
            onChange={(e) => setFilter('responsable_id', e.target.value)}
            placeholder="Todos"
            className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {state.loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <HDTable
          helpdesks={state.items}
          basePath="/area/helpdesks"
          showTechnician
          showPriority
        />
      )}
    </div>
  );
}
