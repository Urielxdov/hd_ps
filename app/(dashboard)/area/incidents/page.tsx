'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Zap } from 'lucide-react';
import { useIncidentList, StatusBadge, CreateIncidentModal, IncidentMonitor, type MonitorCandidate } from '@/lib/helpdesk';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'open', label: 'Abierto' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'on_hold', label: 'En espera' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'closed', label: 'Cerrado' },
];

export default function IncidentesPage() {
  const { incidents, count, loading, statusFilter, setStatusFilter, load } = useIncidentList();
  const [createOpen, setCreateOpen] = useState(false);
  const [monitorPreset, setMonitorPreset] = useState<MonitorCandidate | null>(null);

  function handleCreateFromCandidate(candidate: MonitorCandidate) {
    setMonitorPreset(candidate);
    setCreateOpen(true);
  }

  const activos = incidents.filter(
    (i) => i.master_ticket.status === 'open' || i.master_ticket.status === 'in_progress'
  ).length;
  const resueltos = incidents.filter(
    (i) => i.master_ticket.status === 'resolved' || i.master_ticket.status === 'closed'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={22} className="text-amber-500" />
          <h1 className="text-2xl font-bold text-slate-900">Incidentes</h1>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo incidente
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{count}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Activos</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{activos}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Resueltos</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{resueltos}</p>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Estado</label>
        <div className="flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-colors ${
                statusFilter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Zap size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay incidentes registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Folio</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Descripción</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Tickets</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Creado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/area/incidents/${incident.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {incident.master_ticket.folio}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                    {incident.master_ticket.problem_description}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{incident.linked_tickets_count}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={incident.master_ticket.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(incident.created_at).toLocaleDateString('es-MX')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <IncidentMonitor onCreateFromCandidate={handleCreateFromCandidate} />

      <CreateIncidentModal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setMonitorPreset(null); }}
        onCreated={load}
        initialValues={monitorPreset ? {
          service: monitorPreset.service_id,
          ticketIds: monitorPreset.ticket_ids,
          description: `Múltiples tickets en ${monitorPreset.service_name}`,
        } : undefined}
      />
    </div>
  );
}
