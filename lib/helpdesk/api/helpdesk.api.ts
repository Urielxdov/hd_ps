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
  origin: string;
  priority: string;
  problem_description: string;
  impact: string;
  estimated_hours?: number;
}): Promise<HelpDesk> {
  return apiClient.request('/helpdesks/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function changeStatus(id: number, status: string): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function closeHelpDesk(id: number): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/close/`, {
    method: 'PATCH',
  });
}

export async function assignHelpDesk(
  id: number,
  data: { assignee_id: number; due_date?: string }
): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/assign/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function resolveHelpDesk(
  id: number,
  solution_description: string
): Promise<HelpDesk> {
  return apiClient.request(`/helpdesks/${id}/resolve/`, {
    method: 'PATCH',
    body: JSON.stringify({ solution_description }),
  });
}

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
  content: string,
  is_internal: boolean = false
): Promise<HDComment> {
  return apiClient.request(`/helpdesks/${helpDeskId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ content, is_internal }),
  });
}
