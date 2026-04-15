import type { CategoryCacheAction, CategoryCacheState } from './types';

export function categoryCacheReducer(
  state: CategoryCacheState,
  action: CategoryCacheAction
): CategoryCacheState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.deptId]: true },
        error: { ...state.error, [action.payload.deptId]: null },
      };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.deptId]: false },
        error: { ...state.error, [action.payload.deptId]: null },
        items: { ...state.items, [action.payload.deptId]: action.payload.items },
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.deptId]: false },
        error: { ...state.error, [action.payload.deptId]: action.payload.error },
      };

    case 'ADD_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.deptId]: [
            action.payload.item,
            ...(state.items[action.payload.deptId] ?? []),
          ],
        },
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: Object.fromEntries(
          Object.entries(state.items).map(([deptId, cats]) => [
            deptId,
            cats.map((cat) =>
              cat.id === action.payload.id ? action.payload : cat
            ),
          ])
        ),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.deptId]: (
            state.items[action.payload.deptId] ?? []
          ).filter((cat) => cat.id !== action.payload.id),
        },
      };

    default:
      return state;
  }
}
