'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { getSLAConfigs } from '../api/sla.api';
import { slaConfigListInitialState } from '../state/initial-state';
import { slaConfigListReducer } from '../state/reducer';

export function useSLAConfigList() {
  const [state, dispatch] = useReducer(slaConfigListReducer, slaConfigListInitialState);

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const data = await getSLAConfigs();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Error al cargar configuraciones SLA.',
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { state, dispatch, load };
}
