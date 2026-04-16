import { apiClient } from '@/lib/shared/api/client';
import type { ServiceCategory, Service } from '../types';

// Categories
export async function getDepartmentCategories(
  departmentId: number
): Promise<ServiceCategory[]> {
  return apiClient.request(`/departments/${departmentId}/categories/`);
}

export async function createServiceCategory(
  data: { nombre: string; department: number }
): Promise<ServiceCategory> {
  return apiClient.request('/service-categories/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateServiceCategory(
  id: number,
  data: Partial<ServiceCategory>
): Promise<ServiceCategory> {
  return apiClient.request(`/service-categories/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Services
export async function getDepartmentServices(
  departmentId: number
): Promise<Service[]> {
  return apiClient.request(`/departments/${departmentId}/services/`);
}

export async function getCategoryServices(
  categoryId: number
): Promise<Service[]> {
  return apiClient.request(`/service-categories/${categoryId}/services/`);
}

export async function createService(
  data: { nombre: string; descripcion: string; category: number; tiempo_estimado_default: number }
): Promise<Service> {
  return apiClient.request('/services/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateService(
  id: number,
  data: Partial<Service>
): Promise<Service> {
  return apiClient.request(`/services/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function toggleService(id: number): Promise<Service> {
  return apiClient.request(`/services/${id}/toggle/`, { method: 'PATCH' });
}
