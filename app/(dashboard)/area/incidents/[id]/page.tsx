'use client';

import { useState, use } from 'react';
import {
  useIncident,
  closeHelpDesk,
  StatusBadge, StatusStepper,
  CommentThread, AttachmentUploader,
  AssignModal, HelpDeskInfo,
  LinkedTicketsSection, LinkTicketsModal,
} from '@/lib/helpdesk';
import { Link2 } from 'lucide-react';

export default function DetalleIncidente({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { incident, loading, reload } = useIncident(Number(id));
  const [assignOpen, setAssignOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);

  async function handleClose() {
    try {
      await closeHelpDesk(incident!.master_ticket.id);
      await reload();
    } catch {
      alert('Error al cerrar el incidente');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!incident) {
    return <p className="text-center text-slate-500 py-12">Incidente no encontrado</p>;
  }

  const { master_ticket: hd } = incident;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Incidente</p>
          <h1 className="text-2xl font-bold text-slate-900">{hd.folio}</h1>
        </div>
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
        <button
          onClick={() => setLinkOpen(true)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-sm rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Link2 size={15} />
          Vincular tickets
        </button>
        {hd.status === 'resolved' && (
          <button
            onClick={handleClose}
            className="cursor-pointer px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cerrar incidente
          </button>
        )}
      </div>

      <HelpDeskInfo hd={hd} showRequester showAssignee />

      <LinkedTicketsSection
        linkedTickets={incident.linked_tickets}
        linkedTicketsCount={incident.linked_tickets_count}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <AttachmentUploader helpDeskId={hd.id} attachments={hd.attachments} onUpdate={reload} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CommentThread helpDeskId={hd.id} showInternal />
      </div>

      <AssignModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        helpDeskId={hd.id}
        onAssigned={reload}
        currentAssigneeId={hd.assignee_id}
      />

      <LinkTicketsModal
        open={linkOpen}
        incidentId={incident.id}
        onClose={() => setLinkOpen(false)}
        onLinked={reload}
      />
    </div>
  );
}
