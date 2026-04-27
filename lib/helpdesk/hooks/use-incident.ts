'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIncident } from '../api/incident.api';
import type { Incident } from '../types';

/**
 * Obtiene y mantiene el estado de un incidente individual.
 *
 * `reload` se expone para refrescar tras vincular tickets o cambios
 * en el ticket maestro.
 *
 * `error` es un mensaje legible cuando el fetch falla — la página consumidora
 * decide cómo presentarlo. `incident` queda en `null` mientras `loading` o `error`.
 */
export function useIncident(id: number) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncident(id);
      setIncident(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar el incidente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { incident, loading, error, reload };
}
