'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { getTechnicianProfiles } from '../api/sla.api';
import { technicianListInitialState } from '../state/initial-state';
import { technicianListReducer } from '../state/reducer';
import type { TechnicianFilters } from '../state/types';

export function useTechnicianList() {
  const [state, dispatch] = useReducer(technicianListReducer, technicianListInitialState);

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const params: Record<string, string> = {};
      if (state.filters.active) params.active = state.filters.active;
      if (state.filters.department) params.department = state.filters.department;
      if (state.filters.search) params.search = state.filters.search;

      const data = await getTechnicianProfiles(params);
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Error al cargar técnicos.',
      });
    }
  }, [state.filters.active, state.filters.department, state.filters.search]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = useCallback((key: keyof TechnicianFilters, value: string) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return { state, dispatch, load, setFilter, resetFilters };
}
