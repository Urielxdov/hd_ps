/**
 * Nivel de impacto de un servicio sobre la operación.
 * Los valores los define el backend — se usan en clasificación NLP futura.
 */
export type ServiceImpact = 'individual' | 'area' | 'company';

/**
 * Categoría que agrupa servicios dentro de un departamento.
 *
 * `department_name` es un campo desnormalizado de solo lectura que devuelve
 * el backend para evitar un join adicional en la UI.
 *
 * `active` implementa soft-delete: false significa que la categoría está
 * desactivada pero sus registros históricos (tickets) se preservan intactos.
 */
export interface ServiceCategory {
  id: number;
  name: string;
  department: number;
  department_name: string;
  active: boolean;
}

/**
 * Servicio del catálogo a partir del cual se crean tickets.
 *
 * `category_name` es un campo desnormalizado de solo lectura.
 *
 * `estimated_hours` es el tiempo de resolución por defecto que hereda
 * el ticket al crearse — el agente puede sobrescribirlo al abrir el ticket.
 *
 * `client_close` determina si el solicitante puede cerrar su propio ticket
 * sin intervención de un técnico.
 *
 * `active` implementa soft-delete: desactivar un servicio no elimina los
 * tickets existentes que lo referencian, preservando la integridad histórica.
 *
 * `created_at` es un string ISO 8601 en UTC emitido por el backend.
 */
export interface Service {
  id: number;
  name: string;
  description: string;
  category: number;
  category_name: string;
  estimated_hours: number;
  client_close: boolean;
  impact: ServiceImpact;
  active: boolean;
  created_at: string;
}
