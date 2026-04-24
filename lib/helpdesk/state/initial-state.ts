import type { HelpDeskListState } from './types';

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
