'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIncidents } from '../api/incident.api';
import type { Incident } from '../types';

/**
 * Listado paginado de incidentes con filtro de estado reactivo.
 *
 * Cambiar `setStatusFilter` dispara una recarga automática.
 * Filtro vacío (`''`) trae todos los incidentes sin restricción.
 * `load` se expone para forzar recarga tras declarar un nuevo incidente.
 */
export function useIncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const data = await getIncidents(params);
      setIncidents(data.results);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar los incidentes.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return { incidents, count, loading, error, statusFilter, setStatusFilter, load };
}
