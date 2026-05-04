'use client';

import { useEffect } from 'react';
import { HDTable, useHelpDeskList } from '@/lib/helpdesk';
import { useDepartmentList } from '@/lib/department';
import { useServicesByDepartment } from '@/lib/catalog';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'open', label: 'Abierto' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'on_hold', label: 'En espera' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'closed', label: 'Cerrado' },
];

const PRIORITY_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Critica' },
];

const selectClass =
  'px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white';

export default function PanelArea() {
  const { state, setFilter } = useHelpDeskList();
  const { state: deptState } = useDepartmentList();

  const selectedDeptId = state.filters.department ? Number(state.filters.department) : null;
  const { services, loading: servicesLoading } = useServicesByDepartment(selectedDeptId);

  useEffect(() => {
    setFilter('service', '');
  }, [state.filters.department]);

  const hoy = new Date().toDateString();
  const abiertos = state.items.filter((h) => h.status === 'open').length;
  const enProgreso = state.items.filter((h) => h.status === 'in_progress').length;
  const resueltosHoy = state.items.filter(
    (h) => h.status === 'resolved' && h.resolved_at && new Date(h.resolved_at).toDateString() === hoy
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
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter('status', f.value)}
                className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-colors ${
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
                className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-colors ${
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

        <div>
          <label className="block text-xs text-slate-500 mb-1">Tecnico (ID)</label>
          <input
            type="number"
            min="1"
            value={state.filters.assignee_id}
            onChange={(e) => setFilter('assignee_id', e.target.value)}
            placeholder="Todos"
            className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Departamento</label>
          <select
            value={state.filters.department}
            onChange={(e) => setFilter('department', e.target.value)}
            className={selectClass}
            disabled={deptState.loading}
          >
            <option value="">Todos</option>
            {deptState.items.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Servicio</label>
          <select
            value={state.filters.service}
            onChange={(e) => setFilter('service', e.target.value)}
            className={selectClass}
            disabled={!selectedDeptId || servicesLoading}
          >
            <option value="">Todos</option>
            {services.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <HDTable helpdesks={state.items} basePath="/area/helpdesks" showTechnician showPriority />
      )}
    </div>
  );
}
