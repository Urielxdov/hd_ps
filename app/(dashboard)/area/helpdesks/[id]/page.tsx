'use client';

import { useState, use } from 'react';
import {
  useHelpDesk,
  closeHelpDesk,
  ORIGIN_LABELS,
  StatusBadge, PriorityBadge, StatusStepper,
  CommentThread, AttachmentUploader,
  AssignModal,
} from '@/lib/helpdesk';

export default function DetalleAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { hd, loading, reload } = useHelpDesk(Number(id));
  const [assignOpen, setAssignOpen] = useState(false);

  async function handleClose() {
    try {
      await closeHelpDesk(Number(id));
      await reload();
    } catch {
      alert('Error al cerrar el ticket');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!hd) {
    return <p className="text-center text-slate-500 py-12">Ticket no encontrado</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{hd.folio}</h1>
        <StatusBadge status={hd.status} />
      </div>

      <StatusStepper status={hd.status} />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setAssignOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
        >
          {hd.assignee_id ? 'Reasignar Tecnico' : 'Asignar Tecnico'}
        </button>
        {hd.status === 'resolved' && (
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cerrar ticket
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Informacion del Ticket</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Servicio</span>
            <p className="font-medium text-slate-800">{hd.service_name}</p>
          </div>
          <div>
            <span className="text-slate-500">Origen</span>
            <p className="font-medium text-slate-800">{ORIGIN_LABELS[hd.origin]}</p>
          </div>
          <div>
            <span className="text-slate-500">Prioridad</span>
            <div className="mt-0.5"><PriorityBadge priority={hd.priority} /></div>
          </div>
          <div>
            <span className="text-slate-500">Solicitante</span>
            <p className="font-medium text-slate-800">
              {hd.requester_id ? `Usuario #${hd.requester_id}` : 'Desconocido'}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Tecnico asignado</span>
            <p className="font-medium text-slate-800">
              {hd.assignee_id ? `Tecnico #${hd.assignee_id}` : 'Sin asignar'}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Creado</span>
            <p className="font-medium text-slate-800">{new Date(hd.created_at).toLocaleString('es-MX')}</p>
          </div>
          <div>
            <span className="text-slate-500">Tiempo estimado</span>
            <p className="font-medium text-slate-800">{hd.estimated_hours}h</p>
          </div>
          {hd.assigned_at && (
            <div>
              <span className="text-slate-500">Fecha asignacion</span>
              <p className="font-medium text-slate-800">{new Date(hd.assigned_at).toLocaleString('es-MX')}</p>
            </div>
          )}
          {hd.due_date && (
            <div>
              <span className="text-slate-500">Fecha compromiso</span>
              <p className="font-medium text-slate-800">{new Date(hd.due_date).toLocaleString('es-MX')}</p>
            </div>
          )}
          {hd.resolved_at && (
            <div>
              <span className="text-slate-500">Fecha resolucion</span>
              <p className="font-medium text-slate-800">{new Date(hd.resolved_at).toLocaleString('es-MX')}</p>
            </div>
          )}
        </div>

        <div>
          <span className="text-sm text-slate-500">Descripcion del problema</span>
          <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
            {hd.problem_description}
          </p>
        </div>

        {hd.solution_description && (
          <div>
            <span className="text-sm text-slate-500">Solucion aplicada</span>
            <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap bg-green-50 p-3 rounded-lg">
              {hd.solution_description}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <AttachmentUploader helpDeskId={hd.id} attachments={hd.attachments} onUpdate={reload} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CommentThread helpDeskId={hd.id} showInternal />
      </div>

      <AssignModal open={assignOpen} onClose={() => setAssignOpen(false)} helpDeskId={hd.id} onAssigned={reload} />
    </div>
  );
}
