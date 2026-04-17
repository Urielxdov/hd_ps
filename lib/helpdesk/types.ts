export type Status = 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';

export type Origin = 'error' | 'request' | 'inquiry' | 'maintenance';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type AttachmentType = 'file' | 'url';

export const STATUS_LABELS: Record<Status, string> = {
  open: 'Abierto',
  in_progress: 'En progreso',
  on_hold: 'En espera',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

export const ORIGIN_LABELS: Record<Origin, string> = {
  error: 'Error',
  request: 'Solicitud',
  inquiry: 'Consulta',
  maintenance: 'Mantenimiento',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Critica',
};

export interface HDAttachment {
  id: number;
  type: AttachmentType;
  name: string;
  value: string;
  created_at: string;
}

export interface HDComment {
  id: number;
  author_id: number | null;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface HelpDesk {
  id: number;
  folio: string;
  requester_id: number | null;
  assignee_id: number | null;
  service: number;
  service_name: string;
  service_client_close: boolean;
  origin: Origin;
  priority: Priority;
  status: Status;
  problem_description: string;
  solution_description: string | null;
  assigned_at: string | null;
  due_date: string | null;
  resolved_at: string | null;
  estimated_hours: number;
  attachments: HDAttachment[];
  created_at: string;
  updated_at: string;
}
