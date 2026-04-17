import type { TechnicianProfile, SLAConfig, ServiceQueueEntry } from '../types';
import type { PaginatedResponse } from '@/lib/shared/types';

export type { TechnicianProfile, SLAConfig, ServiceQueueEntry, PaginatedResponse };

// --- TechnicianProfile ---

export type TechnicianFilters = {
  active: string;
  department: string;
  search: string;
};

export type TechnicianListState = {
  items: TechnicianProfile[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  filters: TechnicianFilters;
};

export type TechnicianListAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: PaginatedResponse<TechnicianProfile> }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: { key: keyof TechnicianFilters; value: string } }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_ITEM'; payload: TechnicianProfile }
  | { type: 'UPDATE_ITEM'; payload: TechnicianProfile }
  | { type: 'REMOVE_ITEM'; payload: number };

// --- SLAConfig ---

export type SLAConfigListState = {
  items: SLAConfig[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
};

export type SLAConfigListAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: PaginatedResponse<SLAConfig> }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_ITEM'; payload: SLAConfig }
  | { type: 'UPDATE_ITEM'; payload: SLAConfig };

// --- ServiceQueue ---

export type ServiceQueueState = {
  items: ServiceQueueEntry[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
};

export type ServiceQueueAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: PaginatedResponse<ServiceQueueEntry> }
  | { type: 'LOAD_ERROR'; payload: string };
