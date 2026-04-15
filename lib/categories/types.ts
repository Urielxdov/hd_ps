import type { ServiceCategory } from '../types';

export type { ServiceCategory };

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
