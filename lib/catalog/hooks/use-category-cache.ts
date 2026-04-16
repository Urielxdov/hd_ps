'use client';

import { useCallback, useReducer } from 'react';
import { getDepartmentCategories } from '../api/catalog.api';
import { categoryCacheInitialState, categoryCacheReducer } from '../state/category-reducer';
import type { ServiceCategory } from '../types';

export function useCategoryCache() {
  const [state, dispatch] = useReducer(
    categoryCacheReducer,
    categoryCacheInitialState
  );

  const loadByDept = useCallback(
    async (deptId: number) => {
      if (state.items[deptId]) return;

      dispatch({ type: 'LOAD_START', payload: { deptId } });

      try {
        const items = await getDepartmentCategories(deptId);
        dispatch({ type: 'LOAD_SUCCESS', payload: { deptId, items } });
      } catch (error) {
        dispatch({
          type: 'LOAD_ERROR',
          payload: {
            deptId,
            error:
              error instanceof Error
                ? error.message
                : 'Ocurrio un error al cargar las categorias.',
          },
        });
      }
    },
    [state.items]
  );

  const addItem = useCallback((deptId: number, item: ServiceCategory) => {
    dispatch({ type: 'ADD_ITEM', payload: { deptId, item } });
  }, []);

  const updateItem = useCallback((item: ServiceCategory) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((deptId: number, id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { deptId, id } });
  }, []);

  return {
    state,
    dispatch,
    loadByDept,
    addItem,
    updateItem,
    removeItem,
  };
}
