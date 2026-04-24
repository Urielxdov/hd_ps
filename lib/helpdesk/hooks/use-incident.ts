'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIncident } from '../api/incident.api';
import type { Incident } from '../types';

export function useIncident(id: number) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIncident(id);
      setIncident(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { incident, loading, reload };
}
