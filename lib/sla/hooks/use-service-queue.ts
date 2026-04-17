'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { getServiceQueue } from '../api/sla.api';
import { serviceQueueInitialState } from '../state/initial-state';
import { serviceQueueReducer } from '../state/reducer';

export function useServiceQueue() {
  const [state, dispatch] = useReducer(serviceQueueReducer, serviceQueueInitialState);

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const data = await getServiceQueue();
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: error instanceof Error ? error.message : 'Error al cargar la cola de servicio.',
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { state, dispatch, load };
}
