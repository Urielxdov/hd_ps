// API
export {
  getDepartmentCategories, createServiceCategory, updateServiceCategory,
  getDepartmentServices, getCategoryServices, createService, updateService, toggleService,
} from './api/catalog.api';

// Hooks
export { useCategoryCache } from './hooks/use-category-cache';
export { useServiceCache } from './hooks/use-service-cache';
export { useServicesByDepartment } from './hooks/use-services-by-department';

// Types
export type { ServiceCategory, Service } from './types';
