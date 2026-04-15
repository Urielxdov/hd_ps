import type { DepartmentListAction, DepartmentListState } from './types';

export function departmentListReducer(
  state: DepartmentListState,
  action: DepartmentListAction
): DepartmentListState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

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
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          activo: '',
          search: '',
        },
      };

    case 'ADD_ITEM':
      return {
        ...state,
        items: [action.payload, ...state.items],
        count: state.count + 1,
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
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