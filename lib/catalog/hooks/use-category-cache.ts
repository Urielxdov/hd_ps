'use client';

import { useCallback, useReducer } from 'react';
import { getDepartmentCategories } from '../api/catalog.api';
import { categoryCacheInitialState, categoryCacheReducer } from '../state/category-reducer';
import type { ServiceCategory } from '../types';

/**
 * Caché de categorías indexado por departamento.
 *
 * Evita peticiones redundantes al backend: si las categorías de un
 * departamento ya están en estado, `loadByDept` retorna sin hacer fetch.
 * Los métodos `addItem`, `updateItem` y `removeItem` permiten reflejar
 * cambios CRUD en el estado local sin necesidad de recargar desde el servidor.
 */
export function useCategoryCache() {
  const [state, dispatch] = useReducer(
    categoryCacheReducer,
    categoryCacheInitialState
  );

  /**
   * Carga las categorías de un departamento si aún no están en caché.
   * La comprobación es por existencia de la clave — un array vacío
   * se considera cargado y no genera una nueva petición.
   */
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

  /** Elimina una categoría del estado local. Solo usar tras confirmar la desactivación en el backend. */
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
