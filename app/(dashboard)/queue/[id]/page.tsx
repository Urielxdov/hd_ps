'use client';

import { useState, use } from 'react';
import {
  useHelpDesk,
  changeStatus, getValidTransitions,
  STATUS_LABELS,
  StatusBadge, StatusStepper,
  CommentThread, AttachmentUploader, ResolveModal,
  HelpDeskInfo,
  type Status,
} from '@/lib/helpdesk';

export default function DetalleTecnico({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { hd, loading, reload } = useHelpDesk(Number(id));
  const [resolveOpen, setResolveOpen] = useState(false);

  async function handleStatusChange(newStatus: Status) {
    try {
      await changeStatus(Number(id), newStatus);
      await reload();
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

  const transitions = getValidTransitions(hd.status).filter((s) => s !== 'resolved' && s !== 'closed');
  const canResolve = hd.status === 'in_progress' || hd.status === 'on_hold';
  const canEditResolution = hd.status === 'resolved';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{hd.folio}</h1>
        <div className="flex items-center gap-2">
          <StatusBadge status={hd.status} />
        </div>
      </div>

      <StatusStepper status={hd.status} />

      <div className="flex gap-2">
        {transitions.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className="px-4 py-2 bg-white border border-slate-300 text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cambiar a {STATUS_LABELS[s]}
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
        {canEditResolution && (
          <button
            onClick={() => setResolveOpen(true)}
            className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
          >
            Cambiar resolución
          </button>
        )}
      </div>

      <HelpDeskInfo hd={hd} showRequester />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <AttachmentUploader helpDeskId={hd.id} attachments={hd.attachments} onUpdate={reload} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CommentThread helpDeskId={hd.id} showInternal />
      </div>

      <ResolveModal
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        helpDeskId={hd.id}
        onResolved={reload}
      />
    </div>
  );
}
