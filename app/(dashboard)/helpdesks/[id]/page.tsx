'use client';

import { use } from 'react';
import {
  useHelpDesk,
  changeStatus,
  ORIGEN_LABELS, PRIORIDAD_LABELS,
  EstadoBadge, PrioridadBadge, StatusStepper,
  CommentThread, AttachmentUploader,
} from '@/lib/helpdesk';

export default function DetalleHelpDesk({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { hd, loading, reload } = useHelpDesk(Number(id));

  async function handleClose() {
    try {
      await changeStatus(Number(id), 'cerrado');
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
        <EstadoBadge estado={hd.estado} />
      </div>

      <StatusStepper estado={hd.estado} />

      {hd.estado === 'resuelto' && (
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
          >
            Confirmar cierre
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Informacion del Ticket</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Servicio</span>
            <p className="font-medium text-slate-800">{hd.service_nombre}</p>
          </div>
          <div>
            <span className="text-slate-500">Origen</span>
            <p className="font-medium text-slate-800">{ORIGEN_LABELS[hd.origen]}</p>
          </div>
          <div>
            <span className="text-slate-500">Prioridad</span>
            <div className="mt-0.5"><PrioridadBadge prioridad={hd.prioridad} /></div>
          </div>
          <div>
            <span className="text-slate-500">Tecnico asignado</span>
            <p className="font-medium text-slate-800">
              {hd.responsable_id ? `Tecnico #${hd.responsable_id}` : 'Sin asignar'}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Creado</span>
            <p className="font-medium text-slate-800">{new Date(hd.created_at).toLocaleString('es-MX')}</p>
          </div>
          <div>
            <span className="text-slate-500">Tiempo estimado</span>
            <p className="font-medium text-slate-800">{hd.tiempo_estimado}h</p>
          </div>
          {hd.fecha_compromiso && (
            <div>
              <span className="text-slate-500">Fecha compromiso</span>
              <p className="font-medium text-slate-800">{new Date(hd.fecha_compromiso).toLocaleString('es-MX')}</p>
            </div>
          )}
          {hd.fecha_efectividad && (
            <div>
              <span className="text-slate-500">Fecha resolucion</span>
              <p className="font-medium text-slate-800">{new Date(hd.fecha_efectividad).toLocaleString('es-MX')}</p>
            </div>
          )}
        </div>

        <div>
          <span className="text-sm text-slate-500">Descripcion del problema</span>
          <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
            {hd.descripcion_problema}
          </p>
        </div>

        {hd.descripcion_solucion && (
          <div>
            <span className="text-sm text-slate-500">Solucion aplicada</span>
            <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap bg-green-50 p-3 rounded-lg">
              {hd.descripcion_solucion}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <AttachmentUploader helpDeskId={hd.id} attachments={hd.attachments} onUpdate={reload} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CommentThread helpDeskId={hd.id} />
      </div>
    </div>
  );
}
