'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { getHelpDesks } from '../api/helpdesk.api';
import { helpDeskListInitialState } from '../state/initial-state';
import { helpDeskListReducer } from '../state/reducer';
import type { HelpDeskFilters } from '../state/types';

export function useHelpDeskList() {
  const [state, dispatch] = useReducer(
    helpDeskListReducer,
    helpDeskListInitialState
  );

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });

    try {
      const params: Record<string, string> = {};

      if (state.filters.estado) {
        params.estado = state.filters.estado;
      }

      if (state.filters.prioridad) {
        params.prioridad = state.filters.prioridad;
      }

      if (state.filters.responsable_id) {
        params.responsable_id = state.filters.responsable_id;
      }

      const data = await getHelpDesks(params);

      dispatch({
        type: 'LOAD_SUCCESS',
        payload: data,
      });
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
    state.filters.estado,
    state.filters.prioridad,
    state.filters.responsable_id,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = useCallback(
    (key: keyof HelpDeskFilters, value: string) => {
      dispatch({
        type: 'SET_FILTER',
        payload: { key, value },
      });
    },
    []
  );

  const setFilters = useCallback((filters: Partial<HelpDeskFilters>) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: filters,
    });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return {
    state,
    dispatch,
    load,
    setFilter,
    setFilters,
    resetFilters,
  };
}
