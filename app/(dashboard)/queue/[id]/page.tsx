'use client';

import { useState, useEffect, use } from 'react';
import {
  getHelpDesk, changeStatus, getValidTransitions,
  ESTADO_LABELS, ORIGEN_LABELS,
  EstadoBadge, PrioridadBadge, StatusStepper,
  CommentThread, AttachmentUploader, ResolveModal,
  type HelpDesk, type Estado,
} from '@/lib/helpdesk';

export default function DetalleTecnico({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [hd, setHd] = useState<HelpDesk | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolveOpen, setResolveOpen] = useState(false);

  async function load() {
    try {
      const data = await getHelpDesk(Number(id));
      setHd(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleStatusChange(newStatus: Estado) {
    try {
      await changeStatus(Number(id), newStatus);
      await load();
    } catch {
      alert('Error al cambiar estado');
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

  const transitions = getValidTransitions(hd.estado).filter((s) => s !== 'resuelto');
  const canResolve = hd.estado === 'en_progreso' || hd.estado === 'en_espera';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{hd.folio}</h1>
        <div className="flex items-center gap-2">
          <EstadoBadge estado={hd.estado} />
        </div>
      </div>

      <StatusStepper estado={hd.estado} />

      {/* Actions */}
      <div className="flex gap-2">
        {transitions.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className="px-4 py-2 bg-white border border-slate-300 text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cambiar a {ESTADO_LABELS[s]}
          </button>
        ))}
        {canResolve && (
          <button
            onClick={() => setResolveOpen(true)}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            Resolver
          </button>
        )}
      </div>

      {/* Info */}
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
            <span className="text-slate-500">Solicitante</span>
            <p className="font-medium text-slate-800">
              {hd.solicitante_id ? `Usuario #${hd.solicitante_id}` : 'Desconocido'}
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
        <AttachmentUploader helpDeskId={hd.id} attachments={hd.attachments} onUpdate={load} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CommentThread helpDeskId={hd.id} showInternal />
      </div>

      <ResolveModal
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        helpDeskId={hd.id}
        onResolved={load}
      />
    </div>
  );
}
