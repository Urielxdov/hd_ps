import type { ServiceCacheAction, ServiceCacheState } from './types';

export const serviceCacheInitialState: ServiceCacheState = {
  items: {},
  loading: {},
  error: {},
};

/**
 * Reducer de caché de servicios indexado por categoría.
 *
 * Mismo patrón que `categoryCacheReducer`.
 * `UPDATE_ITEM` recorre todas las categorías en estado — se usa tras un
 * toggle para actualizar `active` en local sin refetch, manteniendo el
 * servicio visible en la lista independientemente de su estado.
 */
export function serviceCacheReducer(
  state: ServiceCacheState,
  action: ServiceCacheAction
): ServiceCacheState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.catId]: true },
        error: { ...state.error, [action.payload.catId]: null },
      };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.catId]: false },
        error: { ...state.error, [action.payload.catId]: null },
        items: { ...state.items, [action.payload.catId]: action.payload.items },
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.catId]: false },
        error: { ...state.error, [action.payload.catId]: action.payload.error },
      };

    case 'ADD_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.catId]: [
            action.payload.item,
            ...(state.items[action.payload.catId] ?? []),
          ],
        },
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: Object.fromEntries(
          Object.entries(state.items).map(([catId, services]) => [
            catId,
            services.map((svc) =>
              svc.id === action.payload.id ? action.payload : svc
            ),
          ])
        ),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.catId]: (
            state.items[action.payload.catId] ?? []
          ).filter((svc) => svc.id !== action.payload.id),
        },
      };

    default:
      return state;
  }
}
