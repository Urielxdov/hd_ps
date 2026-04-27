import { apiClient } from '@/lib/shared/api/client';
import type { ServiceCategory, Service } from '../types';

// ─── Categorías ───────────────────────────────────────────────────────────────

/**
 * Obtiene todas las categorías de un departamento.
 *
 * @param departmentId - ID del departamento.
 */
export async function getDepartmentCategories(
  departmentId: number
): Promise<ServiceCategory[]> {
  return apiClient.request(`/departments/${departmentId}/categories/`);
}

/**
 * Crea una nueva categoría dentro de un departamento.
 *
 * @param data.name       - Nombre de la categoría.
 * @param data.department - ID del departamento al que pertenece.
 */
export async function createServiceCategory(
  data: { name: string; department: number }
): Promise<ServiceCategory> {
  return apiClient.request('/service-categories/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza parcialmente una categoría existente.
 *
 * @param id   - ID de la categoría a modificar.
 * @param data - Campos a actualizar.
 */
export async function updateServiceCategory(
  id: number,
  data: Partial<ServiceCategory>
): Promise<ServiceCategory> {
  return apiClient.request(`/service-categories/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── Servicios ────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los servicios de un departamento, sin importar la categoría.
 * Útil para vistas de resumen por departamento.
 *
 * @param departmentId - ID del departamento.
 */
export async function getDepartmentServices(
  departmentId: number
): Promise<Service[]> {
  return apiClient.request(`/departments/${departmentId}/services/`);
}

/**
 * Obtiene los servicios que pertenecen a una categoría específica.
 *
 * @param categoryId - ID de la categoría.
 */
export async function getCategoryServices(
  categoryId: number
): Promise<Service[]> {
  return apiClient.request(`/service-categories/${categoryId}/services/`);
}

/**
 * Obtiene el detalle de un servicio por su ID.
 *
 * @param id - ID del servicio.
 */
export async function getService(id: number): Promise<Service> {
  return apiClient.request(`/services/${id}/`);
}

/**
 * Crea un nuevo servicio dentro de una categoría.
 *
 * @param data.name            - Nombre del servicio.
 * @param data.description     - Descripción del servicio.
 * @param data.category        - ID de la categoría a la que pertenece.
 * @param data.estimated_hours - Horas estimadas de resolución por defecto.
 * @param data.client_close    - Si el solicitante puede cerrar el ticket.
 * @param data.impact          - Alcance del impacto: individual | area | company.
 */
export async function createService(
  data: { name: string; description: string; category: number; estimated_hours: number; client_close: boolean; impact: string }
): Promise<Service> {
  return apiClient.request('/services/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza parcialmente un servicio existente.
 * Usa PATCH — solo se envían los campos que cambian.
 *
 * @param id   - ID del servicio a modificar.
 * @param data - Campos a actualizar.
 */
export async function updateService(
  id: number,
  data: Partial<Service>
): Promise<Service> {
  return apiClient.request(`/services/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Elimina permanentemente un servicio.
 * No hay soft-delete — usar con precaución.
 *
 * @param id - ID del servicio a eliminar.
 */
export async function deleteService(id: number): Promise<void> {
  return apiClient.request(`/services/${id}/`, { method: 'DELETE' });
}

/**
 * Activa o desactiva un servicio (toggle).
 * El backend determina el nuevo estado según el estado actual del servicio.
 *
 * @param id - ID del servicio.
 */
export async function toggleService(id: number): Promise<Service> {
  return apiClient.request(`/services/${id}/toggle/`, { method: 'PATCH' });
}

// ─── Keywords ─────────────────────────────────────────────────────────────────

/**
 * Obtiene las palabras clave asociadas a un servicio.
 * Se usa para pre-cargar keywords en el formulario de edición.
 *
 * @param serviceId - ID del servicio.
 */
export async function getServiceKeywords(
  serviceId: number
): Promise<{ id: number; service: number; keyword: string; weight: number }[]> {
  return apiClient.request(`/service-keywords/?service=${serviceId}`);
}

/**
 * Asocia una palabra clave a un servicio con un peso de relevancia.
 * El peso determina la prioridad del clasificador automático de tickets.
 *
 * @param data.service - ID del servicio.
 * @param data.keyword - Palabra clave a registrar.
 * @param data.weight  - Peso de relevancia (1–10).
 */
export async function createServiceKeyword(
  data: { service: number; keyword: string; weight: number }
): Promise<void> {
  return apiClient.request('/service-keywords/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
