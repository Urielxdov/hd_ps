import { apiClient } from '@/lib/shared/api/client';
import type { PaginatedResponse } from '@/lib/shared/types';
import type { Incident } from '../types';

export async function getIncidents(
  params?: Record<string, string>
): Promise<PaginatedResponse<Incident>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/incidents/${query}`);
}

export async function getIncident(id: number): Promise<Incident> {
  return apiClient.request(`/incidents/${id}/`);
}

export async function createIncident(data: {
  service: number;
  origin: 'error' | 'request' | 'inquiry' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
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

export async function linkTickets(
  incidentId: number,
  ticket_ids: number[]
): Promise<Incident> {
  return apiClient.request(`/incidents/${incidentId}/link/`, {
    method: 'POST',
    body: JSON.stringify({ ticket_ids }),
  });
}
