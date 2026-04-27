import type { HelpDeskListAction, HelpDeskListState } from './types';

/**
 * Reducer del listado paginado de tickets.
 *
 * `LOAD_SUCCESS` mapea `results` de la respuesta paginada del backend
 * a `items` en el estado local — el resto de campos de paginación
 * (`count`, `next`, `previous`) se preservan para navegación futura.
 *
 * `UPDATE_ITEM` permite reflejar cambios en un ticket (estado, asignación,
 * resolución) sin recargar toda la lista desde el backend.
 */
export function helpDeskListReducer(
  state: HelpDeskListState,
  action: HelpDeskListAction
): HelpDeskListState {
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

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { status: '', priority: '', assignee_id: '', department: '' },
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
      };

    default:
      return state;
  }
}
