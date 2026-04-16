import { apiClient } from '@/lib/shared/api/client';
import type { PaginatedResponse } from '@/lib/shared/types';
import type { Department } from '../types';

export async function getDepartments(
  params?: Record<string, string>
): Promise<PaginatedResponse<Department>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/departments/${query}`);
}

export async function createDepartment(
  data: Partial<Department>
): Promise<Department> {
  return apiClient.request('/departments/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDepartment(
  id: number,
  data: Partial<Department>
): Promise<Department> {
  return apiClient.request(`/departments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
