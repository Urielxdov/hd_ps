import type { Service } from '../types';

export type { Service };

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
