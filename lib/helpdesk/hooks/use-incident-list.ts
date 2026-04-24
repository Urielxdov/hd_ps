'use client';

import { useState, useEffect, useCallback } from 'react';
import { getIncidents } from '../api/incident.api';
import type { Incident } from '../types';

export function useIncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const data = await getIncidents(params);
      setIncidents(data.results);
      setCount(data.count);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return { incidents, count, loading, statusFilter, setStatusFilter, load };
}
