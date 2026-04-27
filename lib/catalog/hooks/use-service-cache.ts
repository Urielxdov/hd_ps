'use client';

import { useCallback, useReducer } from 'react';
import { getCategoryServices } from '../api/catalog.api';
import { serviceCacheInitialState, serviceCacheReducer } from '../state/service-reducer';
import type { Service } from '../types';

/**
 * Caché de servicios indexado por categoría.
 *
 * Mismo patrón que `useCategoryCache` pero para servicios.
 * El backend devuelve servicios activos e inactivos — la UI decide
 * cómo presentar cada estado usando `service.active`.
 * Usar `updateItem` tras un toggle para reflejar el cambio en local
 * sin refetch, manteniendo el servicio visible en la lista.
 */
export function useServiceCache() {
  const [state, dispatch] = useReducer(
    serviceCacheReducer,
    serviceCacheInitialState
  );

  /**
   * Carga los servicios de una categoría si aún no están en caché.
   * La comprobación es por existencia de la clave — un array vacío
   * se considera cargado y no genera una nueva petición.
   */
  const loadByCat = useCallback(
    async (catId: number) => {
      if (state.items[catId]) return;

      dispatch({ type: 'LOAD_START', payload: { catId } });

      try {
        const items = await getCategoryServices(catId);
        dispatch({ type: 'LOAD_SUCCESS', payload: { catId, items } });
      } catch (error) {
        dispatch({
          type: 'LOAD_ERROR',
          payload: {
            catId,
            error:
              error instanceof Error
                ? error.message
                : 'Ocurrio un error al cargar los servicios.',
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

  /** Elimina un servicio del estado local. Solo usar tras confirmar la desactivación en el backend. */
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
