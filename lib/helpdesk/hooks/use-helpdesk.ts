'use client';

import { useState, useEffect, useCallback } from 'react';
import { getHelpDesk } from '../api/helpdesk.api';
import type { HelpDesk } from '../types';

/**
 * Obtiene y mantiene el estado de un ticket individual.
 *
 * `reload` se expone para que los componentes puedan refrescar manualmente
 * tras mutaciones (cambio de estado, asignación, resolución, comentarios).
 *
 * `error` es un mensaje legible cuando el fetch falla — la página consumidora
 * decide cómo presentarlo. `hd` queda en `null` mientras `loading` o `error`.
 */
export function useHelpDesk(id: number) {
  const [hd, setHd] = useState<HelpDesk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHelpDesk(id);
      setHd(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar el ticket.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { hd, loading, error, reload };
}
