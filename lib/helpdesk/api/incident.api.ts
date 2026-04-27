import { apiClient } from '@/lib/shared/api/client';
import type { PaginatedResponse } from '@/lib/shared/types';
import type { Incident, Origin, Priority } from '../types';

/** Lista incidentes con filtros opcionales vía query params. */
export async function getIncidents(
  params?: Record<string, string>
): Promise<PaginatedResponse<Incident>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/incidents/${query}`);
}

/**
 * Obtiene el detalle de un incidente incluyendo el ticket maestro
 * y la lista de tickets vinculados.
 */
export async function getIncident(id: number): Promise<Incident> {
  return apiClient.request(`/incidents/${id}/`);
}

/**
 * Declara un nuevo incidente creando un ticket maestro que agrupa
 * los tickets afectados del mismo servicio.
 *
 * `ticket_ids` es opcional — permite vincular tickets existentes en el
 * momento de la creación. Se pueden vincular más después con `linkTickets`.
 *
 * `due_date` y `estimated_hours` son opcionales; si no se envían,
 * el backend los hereda del servicio.
 */
export async function createIncident(data: {
  service: number;
  origin: Origin;
  priority: Priority;
  problem_description: string;
  due_date?: string;
  estimated_hours?: number;
  ticket_ids?: number[];
}): Promise<Incident> {
  return apiClient.request('/incidents/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Vincula tickets existentes a un incidente ya declarado.
 * Usado cuando aparecen nuevos tickets del mismo servicio tras crear el incidente.
 */
export async function linkTickets(
  incidentId: number,
  ticket_ids: number[]
): Promise<Incident> {
  return apiClient.request(`/incidents/${incidentId}/link/`, {
    method: 'POST',
    body: JSON.stringify({ ticket_ids }),
  });
}
