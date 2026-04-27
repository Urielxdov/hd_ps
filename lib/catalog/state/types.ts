import type { ServiceCategory, Service } from '../types';

export type { ServiceCategory, Service };

// ─── Caché de categorías (indexado por deptId) ────────────────────────────────

export type CategoryCacheState = {
  items: Record<number, ServiceCategory[]>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;
};

/**
 * Acciones del reducer de categorías.
 *
 * `UPDATE_ITEM` no requiere `deptId` porque el reducer busca por `id`
 * en todos los departamentos — el ID de categoría es globalmente único.
 * `REMOVE_ITEM` sí requiere `deptId` para filtrar dentro de la clave correcta.
 */
export type CategoryCacheAction =
  | { type: 'LOAD_START'; payload: { deptId: number } }
  | { type: 'LOAD_SUCCESS'; payload: { deptId: number; items: ServiceCategory[] } }
  | { type: 'LOAD_ERROR'; payload: { deptId: number; error: string } }
  | { type: 'ADD_ITEM'; payload: { deptId: number; item: ServiceCategory } }
  | { type: 'UPDATE_ITEM'; payload: ServiceCategory }
  | { type: 'REMOVE_ITEM'; payload: { deptId: number; id: number } };

// ─── Caché de servicios (indexado por catId) ──────────────────────────────────

export type ServiceCacheState = {
  items: Record<number, Service[]>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;
};

/**
 * Acciones del reducer de servicios.
 *
 * Mismo patrón que `CategoryCacheAction`: `UPDATE_ITEM` busca por `id`
 * en todos los catId, mientras que `REMOVE_ITEM` requiere `catId` explícito.
 */
export type ServiceCacheAction =
  | { type: 'LOAD_START'; payload: { catId: number } }
  | { type: 'LOAD_SUCCESS'; payload: { catId: number; items: Service[] } }
  | { type: 'LOAD_ERROR'; payload: { catId: number; error: string } }
  | { type: 'ADD_ITEM'; payload: { catId: number; item: Service } }
  | { type: 'UPDATE_ITEM'; payload: Service }
  | { type: 'REMOVE_ITEM'; payload: { catId: number; id: number } };
