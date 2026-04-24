import type { Status, Priority, HelpDesk } from '../types';
import type { PaginatedResponse } from '@/lib/shared/types';

export type { HelpDesk };

export type HelpDeskFilters = {
  status: Status | string;
  priority: Priority | string;
  assignee_id: string;
  department: string;
};

export type HelpDeskListState = {
  items: HelpDesk[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  filters: HelpDeskFilters;
};

export type HelpDeskListAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS';
      payload: PaginatedResponse<HelpDesk>;
    }
  | {
      type: 'LOAD_ERROR';
      payload: string;
    }
  | {
      type: 'SET_FILTER';
      payload: {
        key: keyof HelpDeskFilters;
        value: string;
      };
    }
  | {
      type: 'SET_FILTERS';
      payload: Partial<HelpDeskFilters>;
    }
  | { type: 'RESET_FILTERS' }
  | {
      type: 'UPDATE_ITEM';
      payload: HelpDesk;
    }
  | {
      type: 'REMOVE_ITEM';
      payload: number;
    };
