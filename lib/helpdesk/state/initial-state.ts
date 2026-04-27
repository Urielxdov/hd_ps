import type { HelpDeskListState } from './types';

/**
 * Estado inicial del listado de tickets.
 * Los filtros arrancan vacíos (`''`) — el hook omite los filtros vacíos
 * al construir los query params para no contaminar la petición al backend.
 */
export const helpDeskListInitialState: HelpDeskListState = {
  items: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    assignee_id: '',
    department: '',
  },
};
