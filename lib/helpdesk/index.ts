// Domain
export { canTransition, getValidTransitions } from './domain/transitions';

// API
export {
  getHelpDesks, getHelpDesk, createHelpDesk, changeStatus, closeHelpDesk,
  assignHelpDesk, resolveHelpDesk, uploadAttachment, addUrlAttachment,
  deleteAttachment, getComments, addComment,
} from './api/helpdesk.api';

// Hooks
export { useHelpDeskList } from './hooks/use-helpdesk-list';
export { useHelpDesk } from './hooks/use-helpdesk';

// Components
export { default as HDTable } from './components/HDTable';
export { StatusBadge, PriorityBadge } from './components/HDBadge';
export { default as StatusStepper } from './components/StatusStepper';
export { default as CommentThread } from './components/CommentThread';
export { default as AttachmentUploader } from './components/AttachmentUploader';
export { default as AssignModal } from './components/AssignModal';
export { default as ResolveModal } from './components/ResolveModal';

// Types
export type { HelpDesk, HDComment, HDAttachment, Status, Priority, Origin, AttachmentType } from './types';
export { STATUS_LABELS, PRIORITY_LABELS, ORIGIN_LABELS } from './types';
