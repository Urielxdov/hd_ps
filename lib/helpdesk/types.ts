/**
 * Ciclo de vida de un ticket. Las transiciones válidas entre estados
 * están definidas en `domain/transitions.ts` — no se deben asumir
 * transiciones directas sin consultarlo.
 * Los valores deben coincidir exactamente con los del backend.
 */
export type Status = 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';

/**
 * Cómo llegó el ticket al sistema. Usado para análisis y reportes
 * (ej. cuántos errores vs solicitudes por período).
 * No afecta la lógica de asignación ni la urgencia directamente.
 */
export type Origin = 'error' | 'request' | 'inquiry' | 'maintenance';

/** Urgencia del ticket. Influye en la priorización de la cola junto con `Impact`. */
export type Priority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Alcance del problema. Heredado de `service.impact` al crear el ticket;
 * un `area_admin` puede sobreescribirlo al asignar (`PATCH /api/helpdesks/{id}/assign/`).
 *
 * Tiene peso directo en el SLA: los scores `score_individual/area/company`
 * determinan el orden en cola — un ticket `company` sube antes que uno
 * `individual` con el mismo vencimiento.
 *
 * Nota: existe un tipo equivalente (`ServiceImpact`) en el módulo catalog
 * para el impacto del servicio en catálogo. Se mantienen separados porque
 * en helpdesk el impacto tiene semántica de SLA adicional.
 */
export type Impact = 'individual' | 'area' | 'company';

export const IMPACT_LABELS: Record<Impact, string> = {
  individual: 'Individual',
  area: 'Área',
  company: 'Empresa',
};

/**
 * Tipo de adjunto. `value` contiene la ruta del archivo si es `file`,
 * o la URL directa si es `url`.
 */
export type AttachmentType = 'file' | 'url';

/** Etiquetas de presentación en UI para cada estado del ticket. */
export const STATUS_LABELS: Record<Status, string> = {
  open: 'Abierto',
  in_progress: 'En progreso',
  on_hold: 'En espera',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

/** Etiquetas de presentación en UI para el origen del ticket. */
export const ORIGIN_LABELS: Record<Origin, string> = {
  error: 'Error',
  request: 'Solicitud',
  inquiry: 'Consulta',
  maintenance: 'Mantenimiento',
};

/** Etiquetas de presentación en UI para la prioridad del ticket. */
export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Critica',
};

export interface HDAttachment {
  id: number;
  /** Determina si `value` es una ruta de archivo o una URL externa. */
  type: AttachmentType;
  name: string;
  value: string;
  created_at: string;
}

export interface HDComment {
  id: number;
  /** Null cuando el comentario es generado automáticamente por el sistema
   *  (ej. al declarar un incidente o cambiar de estado). */
  author_id: number | null;
  content: string;
  /** Si es true, el comentario solo es visible para técnicos — no para el solicitante. */
  is_internal: boolean;
  created_at: string;
}

/** Referencia ligera al incidente desde la perspectiva del ticket hijo. */
export interface IncidentRef {
  id: number;
  master_folio: string;
  master_status: Status;
  master_description: string;
  master_due_date: string | null;
}

/** Referencia ligera a un ticket vinculado desde la perspectiva del incidente. */
export interface LinkedTicket {
  id: number;
  folio: string;
  requester_id: number;
  status: Status;
  assigned_at: string | null;
}

export interface HelpDesk {
  id: number;
  /** Identificador legible por humanos (ej. "HD-2024-001"). Generado por el backend. */
  folio: string;
  requester_id: number | null;
  assignee_id: number | null;
  service: number;
  /** Desnormalizado desde el servicio para evitar joins adicionales en la UI. */
  service_name: string;
  /** Indica si el solicitante puede cerrar su propio ticket. Heredado del servicio. */
  service_client_close: boolean;
  origin: Origin;
  priority: Priority;
  status: Status;
  impact: Impact;
  problem_description: string;
  /** Null hasta que el ticket es resuelto. */
  solution_description: string | null;
  assigned_at: string | null;
  due_date: string | null;
  resolved_at: string | null;
  estimated_hours: number;
  attachments: HDAttachment[];
  created_at: string;
  updated_at: string;
  /** Null cuando el ticket no pertenece a ningún incidente. */
  incident: IncidentRef | null;
}

/**
 * Servicio candidato a convertirse en incidente.
 *
 * Un servicio es candidato cuando su cantidad de tickets activos no vinculados
 * supera el `threshold`. Ese umbral proviene de `SLAConfig.incident_threshold`
 * con tres niveles de fallback:
 *   1. SLAConfig del departamento específico
 *   2. SLAConfig global (department=null)
 *   3. Hardcodeado en settings (`INCIDENT_CANDIDATE_THRESHOLD`, default 5)
 */
export interface MonitorCandidate {
  service_id: number;
  service_name: string;
  department_id: number;
  department_name: string;
  open_tickets: number;
  threshold: number;
  ticket_ids: number[];
  folios: string[];
}

export interface MonitorResponse {
  /** Umbral global del sistema cuando no hay SLAConfig por departamento. */
  system_default_threshold: number;
  /** Total de tickets activos que aún no están vinculados a ningún incidente. */
  total_active_unlinked: number;
  candidates: MonitorCandidate[];
}

/**
 * Incidente declarado: agrupa tickets del mismo servicio bajo un ticket maestro.
 *
 * `master_ticket` es el ticket coordinador — gestiona el incidente completo.
 * `linked_tickets` son referencias ligeras a los tickets afectados para evitar
 * anidar objetos `HelpDesk` completos.
 */
export interface Incident {
  id: number;
  master_ticket: HelpDesk;
  linked_tickets: LinkedTicket[];
  linked_tickets_count: number;
  created_by_id: number;
  created_at: string;
}
