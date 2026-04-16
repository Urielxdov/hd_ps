import { apiClient } from '@/lib/shared/api/client';
import type { PaginatedResponse } from '@/lib/shared/types';
import type { HelpDesk, HDAttachment, HDComment } from '../types';

export async function getHelpDesks(
  params?: Record<string, string>
): Promise<PaginatedResponse<HelpDesk>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/helpdesks/${query}`);
}

export async function getHelpDesk(id: number): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/`);
}

export async function createHelpDesk(data: {
  service: number;
  origen: string;
  prioridad: string;
  descripcion_problema: string;
  tiempo_estimado?: number;
}): Promise<HelpDesk> {
  return apiClient.request('/helpdesks/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function changeStatus(id: number, estado: string): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  });
}

export async function assignHelpDesk(
  id: number,
  data: { responsable_id: number; fecha_compromiso?: string }
): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/assign/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function resolveHelpDesk(
  id: number,
  descripcion_solucion: string
): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/resolve/`, {
    method: 'PATCH',
    body: JSON.stringify({ descripcion_solucion }),
  });
}

export async function uploadAttachment(
  helpDeskId: number,
  file: File,
  nombre: string
): Promise<HDAttachment> {
  const formData = new FormData();
  formData.append('tipo', 'archivo');
  formData.append('nombre', nombre);
  formData.append('archivo', file);
  return apiClient.request(`/helpdesks/${helpDeskId}/attachments/`, {
    method: 'POST',
    body: formData,
  });
}

export async function addUrlAttachment(
  helpDeskId: number,
  nombre: string,
  url: string
): Promise<HDAttachment> {
  return apiClient.request(`/helpdesks/${helpDeskId}/attachments/`, {
    method: 'POST',
    body: JSON.stringify({ tipo: 'url', nombre, valor: url }),
  });
}

export async function deleteAttachment(
  helpDeskId: number,
  attachmentId: number
): Promise<void> {
  return apiClient.request(`/helpdesks/${helpDeskId}/attachments/${attachmentId}/`, {
    method: 'DELETE',
  });
}

export async function getComments(helpDeskId: number): Promise<HDComment[]> {
  return apiClient.request(`/helpdesks/${helpDeskId}/comments/`);
}

export async function addComment(
  helpDeskId: number,
  contenido: string,
  es_interno: boolean = false
): Promise<HDComment> {
  return apiClient.request(`/helpdesks/${helpDeskId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ contenido, es_interno }),
  });
}
