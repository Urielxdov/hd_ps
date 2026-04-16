import type { ServiceCategory, Service } from '../types';

export type { ServiceCategory, Service };

// Category cache
export type CategoryCacheState = {
  items: Record<number, ServiceCategory[]>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;
};

export type CategoryCacheAction =
  | { type: 'LOAD_START'; payload: { deptId: number } }
  | { type: 'LOAD_SUCCESS'; payload: { deptId: number; items: ServiceCategory[] } }
  | { type: 'LOAD_ERROR'; payload: { deptId: number; error: string } }
  | { type: 'ADD_ITEM'; payload: { deptId: number; item: ServiceCategory } }
  | { type: 'UPDATE_ITEM'; payload: ServiceCategory }
  | { type: 'REMOVE_ITEM'; payload: { deptId: number; id: number } };

// Service cache
export type ServiceCacheState = {
  items: Record<number, Service[]>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;
};

export type ServiceCacheAction =
  | { type: 'LOAD_START'; payload: { catId: number } }
  | { type: 'LOAD_SUCCESS'; payload: { catId: number; items: Service[] } }
  | { type: 'LOAD_ERROR'; payload: { catId: number; error: string } }
  | { type: 'ADD_ITEM'; payload: { catId: number; item: Service } }
  | { type: 'UPDATE_ITEM'; payload: Service }
  | { type: 'REMOVE_ITEM'; payload: { catId: number; id: number } };
