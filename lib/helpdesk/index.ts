/**
 * Módulo de helpdesk: corazón del sistema.
 *
 * Expone dominio (transiciones), API (tickets e incidentes), hooks,
 * componentes y tipos. El resto del sistema no debe importar directamente
 * desde subcarpetas — todo pasa por este índice.
 */

// Domain
export { canTransition, getValidTransitions } from './domain/transitions';

// API
export {
  getHelpDesks, getHelpDesk, createHelpDesk, changeStatus, closeHelpDesk,
  assignHelpDesk, resolveHelpDesk, uploadAttachment, addUrlAttachment,
  deleteAttachment, getComments, addComment, getMonitor,
} from './api/helpdesk.api';

export {
  getIncidents, getIncident, createIncident, linkTickets,
} from './api/incident.api';

// Hooks
export { useHelpDeskList } from './hooks/use-helpdesk-list';
export { useHelpDesk } from './hooks/use-helpdesk';
export { useIncidentList } from './hooks/use-incident-list';
export { useIncident } from './hooks/use-incident';

// Components
export { default as HDTable } from './components/HDTable';
export { default as HelpDeskInfo } from './components/HelpDeskInfo';
export { StatusBadge, PriorityBadge } from './components/HDBadge';
export { default as StatusStepper } from './components/StatusStepper';
export { default as CommentThread } from './components/CommentThread';
export { default as AttachmentUploader } from './components/AttachmentUploader';
export { default as AssignModal } from './components/AssignModal';
export { default as ResolveModal } from './components/ResolveModal';
export { default as MasterTicketBanner } from './components/MasterTicketBanner';
export { default as LinkedTicketsSection } from './components/LinkedTicketsSection';
export { default as CreateIncidentModal } from './components/CreateIncidentModal';
export { default as LinkTicketsModal } from './components/LinkTicketsModal';
export { default as IncidentMonitor } from './components/IncidentMonitor';

// Types
export type { HelpDesk, HDComment, HDAttachment, Status, Priority, Origin, Impact, AttachmentType, IncidentRef, LinkedTicket, Incident, MonitorCandidate, MonitorResponse } from './types';
export { STATUS_LABELS, PRIORITY_LABELS, ORIGIN_LABELS, IMPACT_LABELS } from './types';
