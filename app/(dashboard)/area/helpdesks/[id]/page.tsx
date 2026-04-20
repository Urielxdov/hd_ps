'use client';

import { useState, use } from 'react';
import {
  useHelpDesk,
  closeHelpDesk,
  StatusBadge, StatusStepper,
  CommentThread, AttachmentUploader,
  AssignModal, HelpDeskInfo,
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
          className="cursor-pointer px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
        >
          {hd.assignee_id ? 'Reasignar Tecnico' : 'Asignar Tecnico'}
        </button>
        {hd.status === 'resolved' && (
          <button
            onClick={handleClose}
            className="cursor-pointer px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cerrar ticket
          </button>
        )}
      </div>

      <HelpDeskInfo hd={hd} showRequester showAssignee />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <AttachmentUploader helpDeskId={hd.id} attachments={hd.attachments} onUpdate={reload} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CommentThread helpDeskId={hd.id} showInternal />
      </div>

      <AssignModal open={assignOpen} onClose={() => setAssignOpen(false)} helpDeskId={hd.id} onAssigned={reload} currentAssigneeId={hd.assignee_id} />
    </div>
  );
}
