// Domain
export { canTransition, getValidTransitions } from './domain/transitions';

// API
export {
  getHelpDesks, getHelpDesk, createHelpDesk, changeStatus,
  assignHelpDesk, resolveHelpDesk, uploadAttachment, addUrlAttachment,
  deleteAttachment, getComments, addComment,
} from './api/helpdesk.api';

// Hooks
export { useHelpDeskList } from './hooks/use-helpdesk-list';

// Components
export { default as HDTable } from './components/HDTable';
export { EstadoBadge, PrioridadBadge } from './components/HDBadge';
export { default as StatusStepper } from './components/StatusStepper';
export { default as CommentThread } from './components/CommentThread';
export { default as AttachmentUploader } from './components/AttachmentUploader';
export { default as AssignModal } from './components/AssignModal';
export { default as ResolveModal } from './components/ResolveModal';

// Types
export type { HelpDesk, HDComment, HDAttachment, Estado, Prioridad, Origen, TipoAdjunto } from './types';
export { ESTADO_LABELS, PRIORIDAD_LABELS, ORIGEN_LABELS } from './types';
