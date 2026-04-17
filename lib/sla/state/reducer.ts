import type {
  TechnicianListState, TechnicianListAction,
  SLAConfigListState, SLAConfigListAction,
  ServiceQueueState, ServiceQueueAction,
} from './types';

export function technicianListReducer(
  state: TechnicianListState,
  action: TechnicianListAction
): TechnicianListState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.results,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
      };

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value },
      };

    case 'RESET_FILTERS':
      return { ...state, filters: { active: '', department: '', search: '' } };

    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items], count: state.count + 1 };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) => item.id === action.payload.id ? action.payload : item),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        count: Math.max(0, state.count - 1),
      };

    default:
      return state;
  }
}

export function slaConfigListReducer(
  state: SLAConfigListState,
  action: SLAConfigListAction
): SLAConfigListState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.results,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
      };

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items], count: state.count + 1 };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) => item.id === action.payload.id ? action.payload : item),
      };

    default:
      return state;
  }
}

export function serviceQueueReducer(
  state: ServiceQueueState,
  action: ServiceQueueAction
): ServiceQueueState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.results,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
      };

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
