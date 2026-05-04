'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { getHelpDesks } from '../api/helpdesk.api';
import { helpDeskListInitialState } from '../state/initial-state';
import { helpDeskListReducer } from '../state/reducer';
import type { HelpDeskFilters } from '../state/types';

/**
 * Listado paginado de tickets con filtros reactivos.
 *
 * Cada vez que cambia un filtro (`setFilter`, `setFilters`, `resetFilters`),
 * el hook recarga automáticamente — el cambio de filtros actualiza las deps
 * de `load`, lo que dispara el `useEffect`.
 *
 * Los filtros vacíos (`''`) se omiten al construir los query params para
 * no contaminar la petición al backend.
 *
 * `dispatch` se expone para que los componentes puedan hacer `UPDATE_ITEM`
 * directamente tras mutaciones sin recargar toda la lista.
 */
export function useHelpDeskList() {
  const [state, dispatch] = useReducer(
    helpDeskListReducer,
    helpDeskListInitialState
  );

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });

    try {
      const params: Record<string, string> = {};

      if (state.filters.status) params.status = state.filters.status;
      if (state.filters.priority) params.priority = state.filters.priority;
      if (state.filters.assignee_id) params.assignee_id = state.filters.assignee_id;
      if (state.filters.department) params.department = state.filters.department;
      if (state.filters.service) params.service = state.filters.service;

      const data = await getHelpDesks(params);
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        payload:
          error instanceof Error
            ? error.message
            : 'Ocurrio un error al cargar los help desks.',
      });
    }
  }, [
    state.filters.status,
    state.filters.priority,
    state.filters.assignee_id,
    state.filters.department,
    state.filters.service,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = useCallback(
    (key: keyof HelpDeskFilters, value: string) => {
      dispatch({ type: 'SET_FILTER', payload: { key, value } });
    },
    []
  );

  const setFilters = useCallback((filters: Partial<HelpDeskFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return { state, dispatch, load, setFilter, setFilters, resetFilters };
}
