import { apiClient } from '@/lib/shared/api/client';
import type { PaginatedResponse } from '@/lib/shared/types';
import type { Incident } from '../types';

export async function getIncidents(
  params?: Record<string, string>
): Promise<PaginatedResponse<Incident>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/helpdesks/incidents/${query}`);
}

export async function getIncident(id: number): Promise<Incident> {
  return apiClient.request(`/helpdesks/incidents/${id}/`);
}

export async function createIncident(data: {
  service: number;
  description_problema: string;
  due_date?: string;
  ticket_ids?: number[];
}): Promise<Incident> {
  return apiClient.request('/helpdesks/incidents/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function linkTickets(
  incidentId: number,
  ticket_ids: number[]
): Promise<Incident> {
  return apiClient.request(`/helpdesks/incidents/${incidentId}/link/`, {
    method: 'POST',
    body: JSON.stringify({ ticket_ids }),
  });
}
