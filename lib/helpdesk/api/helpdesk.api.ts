import { apiClient } from '@/lib/shared/api/client';
import type { PaginatedResponse } from '@/lib/shared/types';
import type { HelpDesk, HDAttachment, HDComment, MonitorResponse, Status, Origin, Priority, Impact } from '../types';

/**
 * Lista tickets con filtros opcionales.
 *
 * Filtros soportados:
 * - `status`      — estado del ticket (open, in_progress, on_hold, resolved, closed)
 * - `priority`    — prioridad (low, medium, high, critical)
 * - `service`     — ID del servicio
 * - `assignee_id` — ID del técnico asignado
 * - `department`  — ID del departamento
 */
export async function getHelpDesks(
  params?: Record<string, string>
): Promise<PaginatedResponse<HelpDesk>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/helpdesks/${query}`);
}

/**
 * Obtiene un ticket completo por ID.
 * La respuesta incluye adjuntos, comentarios e incidente vinculado (si existe).
 */
export async function getHelpDesk(id: number): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/`);
}

/**
 * Crea un nuevo ticket.
 *
 * `estimated_hours` es opcional — si no se envía, hereda el valor del servicio.
 * `impact` se hereda del servicio pero puede sobreescribirse aquí al crear.
 */
export async function createHelpDesk(data: {
  service: number;
  origin: Origin;
  priority: Priority;
  problem_description: string;
  impact: Impact;
  estimated_hours?: number;
}): Promise<HelpDesk> {
  return apiClient.request('/helpdesks/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Cambia el estado de un ticket siguiendo la máquina de estados.
 *
 * Permiso: técnicos y admins únicamente (`IsTechnicianOrAdmin`).
 * Los técnicos no pueden resolver ni cerrar directamente — para resolver
 * deben usar `resolveHelpDesk`; el cierre lo hace el solicitante con `closeHelpDesk`.
 * Usar `canTransition` de `domain/transitions.ts` para validar antes de llamar.
 */
export async function changeStatus(id: number, status: Status): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Cierra un ticket resuelto desde el lado del solicitante.
 *
 * Permiso: cualquier usuario autenticado, pero el backend valida que:
 * - El usuario sea el solicitante del ticket (`requester_id == user.user_id`)
 * - El servicio permita cierre por el solicitante (`service.client_close == true`)
 * - El ticket esté en estado `resolved`
 *
 * Los técnicos están bloqueados explícitamente en este endpoint.
 * No confundir con `changeStatus` — ese es para técnicos/admins.
 */
export async function closeHelpDesk(id: number): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/close/`, {
    method: 'PATCH',
  });
}

/**
 * Asigna un técnico al ticket y opcionalmente establece fecha de vencimiento.
 *
 * @todo La sobreescritura de `impact` por `area_admin` en este endpoint
 * aún no está implementada en el backend.
 */
export async function assignHelpDesk(
  id: number,
  data: { assignee_id: number; due_date?: string }
): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/assign/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Resuelve un ticket. Requiere descripción de la solución aplicada.
 * Transiciona el estado a `resolved` — solo el solicitante puede cerrar después.
 */
export async function resolveHelpDesk(
  id: number,
  solution_description: string
): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/resolve/`, {
    method: 'PATCH',
    body: JSON.stringify({ solution_description }),
  });
}

/**
 * Sube un archivo adjunto al ticket usando multipart/form-data.
 * El `apiClient` omite el Content-Type para que el navegador genere
 * el boundary de multipart automáticamente.
 */
export async function uploadAttachment(
  helpDeskId: number,
  file: File,
  name: string
): Promise<HDAttachment> {
  const formData = new FormData();
  formData.append('type', 'file');
  formData.append('name', name);
  formData.append('file', file);
  return apiClient.request(`/helpdesks/${helpDeskId}/attachments/`, {
    method: 'POST',
    body: formData,
  });
}

/**
 * Registra una URL como adjunto del ticket.
 *
 * @param url - URL externa a asociar al ticket.
 */
export async function addUrlAttachment(
  helpDeskId: number,
  name: string,
  url: string
): Promise<HDAttachment> {
  return apiClient.request(`/helpdesks/${helpDeskId}/attachments/`, {
    method: 'POST',
    body: JSON.stringify({ type: 'url', name, value: url }),
  });
}

/**
 * Elimina un adjunto del ticket. Es un DELETE físico — los adjuntos
 * no tienen soft-delete porque no hay integridad referencial que preservar.
 */
export async function deleteAttachment(
  helpDeskId: number,
  attachmentId: number
): Promise<void> {
  return apiClient.request(`/helpdesks/${helpDeskId}/attachments/${attachmentId}/`, {
    method: 'DELETE',
  });
}

/**
 * Obtiene los servicios candidatos a incidente según el umbral de tickets activos.
 *
 * Filtros soportados:
 * - `threshold`  — override puntual del umbral (ignora SLAConfig para esta consulta)
 * - `department` — restringe el monitoreo a un departamento específico
 */
export async function getMonitor(
  params?: Record<string, string>
): Promise<MonitorResponse> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/helpdesks/monitor/${query}`);
}

/** Obtiene todos los comentarios de un ticket, incluidos los internos y los del sistema. */
export async function getComments(helpDeskId: number): Promise<HDComment[]> {
  return apiClient.request(`/helpdesks/${helpDeskId}/comments/`);
}

/**
 * Agrega un comentario al ticket.
 *
 * @param is_internal - Si es `true`, el comentario solo es visible para técnicos.
 *                      Por defecto es público (`false`).
 */
export async function addComment(
  helpDeskId: number,
  content: string,
  is_internal: boolean = false
): Promise<HDComment> {
  return apiClient.request(`/helpdesks/${helpDeskId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ content, is_internal }),
  });
}
