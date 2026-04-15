'use client';

import { useCallback, useReducer } from 'react';
import { api } from '../api';
import { serviceCacheInitialState } from './initial-state';
import { serviceCacheReducer } from './reducer';
import type { Service } from './types';

export function useServiceCache() {
  const [state, dispatch] = useReducer(
    serviceCacheReducer,
    serviceCacheInitialState
  );

  const loadByCat = useCallback(
    async (catId: number) => {
      if (state.items[catId]) return;

      dispatch({ type: 'LOAD_START', payload: { catId } });

      try {
        const items = await api.getCategoryServices(catId);
        dispatch({ type: 'LOAD_SUCCESS', payload: { catId, items } });
      } catch (error) {
        dispatch({
          type: 'LOAD_ERROR',
          payload: {
            catId,
            error:
              error instanceof Error
                ? error.message
                : 'Ocurrió un error al cargar los servicios.',
          },
        });
      }
    },
    [state.items]
  );

  const addItem = useCallback((catId: number, item: Service) => {
    dispatch({ type: 'ADD_ITEM', payload: { catId, item } });
  }, []);

  const updateItem = useCallback((item: Service) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((catId: number, id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { catId, id } });
  }, []);

  return {
    state,
    dispatch,
    loadByCat,
    addItem,
    updateItem,
    removeItem,
  };
}
