import type { DepartmentListState } from './types';

export const departmentListInitialState: DepartmentListState = {
  items: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
  filters: {
    activo: '',
    search: '',
  },
};