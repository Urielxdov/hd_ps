import type { TechnicianListState, SLAConfigListState, ServiceQueueState } from './types';

export const technicianListInitialState: TechnicianListState = {
  items: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
  filters: {
    active: '',
    department: '',
    search: '',
  },
};

export const slaConfigListInitialState: SLAConfigListState = {
  items: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
};

export const serviceQueueInitialState: ServiceQueueState = {
  items: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
};
