'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { api } from '../api';
import { departmentListInitialState } from './initial-state';
import { departmentListReducer } from './reducer';
import type { DepartmentFilters } from './types';

export function useDepartmentList() {
  const [state, dispatch] = useReducer(
    departmentListReducer,
    departmentListInitialState
  );

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });

    try {
      const params: Record<string, string> = {};

      if (state.filters.activo) {
        params.activo = state.filters.activo;
      }

      if (state.filters.search) {
        params.search = state.filters.search;
      }

      const data = await api.getDepartments(params);

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
            : 'Ocurrió un error al cargar los departamentos.',
      });
    }
  }, [state.filters.activo, state.filters.search]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = useCallback(
    (key: keyof DepartmentFilters, value: string) => {
      dispatch({
        type: 'SET_FILTER',
        payload: { key, value },
      });
    },
    []
  );

  const setFilters = useCallback((filters: Partial<DepartmentFilters>) => {
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