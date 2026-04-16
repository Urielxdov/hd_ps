import type { Department } from '../types';
import type { PaginatedResponse } from '@/lib/shared/types';

export type { Department, PaginatedResponse };

export type DepartmentFilters = {
  activo: string;
  search: string;
};

export type DepartmentListState = {
  items: Department[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  filters: DepartmentFilters;
};

export type DepartmentListAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: PaginatedResponse<Department> }
  | { type: 'LOAD_ERROR'; payload: string }
  | {
      type: 'SET_FILTER';
      payload: {
        key: keyof DepartmentFilters;
        value: string;
      };
    }
  | { type: 'SET_FILTERS'; payload: Partial<DepartmentFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_ITEM'; payload: Department }
  | { type: 'UPDATE_ITEM'; payload: Department }
  | { type: 'REMOVE_ITEM'; payload: number };
