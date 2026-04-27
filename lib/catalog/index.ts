/**
 * Módulo de catálogo: categorías, servicios y palabras clave.
 *
 * Expone las funciones de API, hooks de caché y tipos del dominio.
 * El resto del sistema no debe importar directamente desde subcarpetas
 * — todo pasa por este índice.
 */

// API
export {
  getDepartmentCategories, createServiceCategory, updateServiceCategory,
  getDepartmentServices, getCategoryServices, getService, createService, updateService,
  toggleService, getServiceKeywords, createServiceKeyword,
} from './api/catalog.api';

// Hooks
export { useCategoryCache } from './hooks/use-category-cache';
export { useServiceCache } from './hooks/use-service-cache';
export { useServicesByDepartment } from './hooks/use-services-by-department';

// Types
export type { ServiceCategory, Service, ServiceImpact } from './types';
