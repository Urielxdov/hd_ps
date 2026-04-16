'use client';

import { useState, useEffect } from 'react';
import { getDepartmentServices } from '../api/catalog.api';
import type { Service } from '../types';

export function useServicesByDepartment(deptId: number | null) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!deptId) {
      setServices([]);
      return;
    }

    setLoading(true);
    getDepartmentServices(deptId)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [deptId]);

  return { services, loading };
}
