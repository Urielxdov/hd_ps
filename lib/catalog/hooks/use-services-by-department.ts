'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDepartmentServices } from '../api/catalog.api';
import type { Service } from '../types';

// In-memory cache por deptId. Persiste durante la vida de la app — reusable entre componentes.
// Limpia automáticamente si la fetch falla (error marcado en cache).
const departmentServicesCache = new Map<number, { services: Service[]; isError?: boolean }>();

/**
 * Obtiene servicios del departamento con caché en memoria.
 *
 * A diferencia de versión anterior, cachea resultados por deptId.
 * Mismo deptId = sin refetch (reutiliza cached). Si deptId cambia, refetch.
 * El cache persiste entre renders y componentes.
 *
 * Pasar `null` como `deptId` limpia UI sin fetch, útil cuando no hay dept seleccionado.
 *
 * Errores de red: silencian y devuelven lista vacía. Cache marca error
 * para reintentar en próxima solicitud del mismo deptId.
 */
export function useServicesByDepartment(deptId: number | null) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoiza la clave de cache y el estado cached para evitar efectos innecesarios
  const cacheEntry = useMemo(() => {
    return deptId ? departmentServicesCache.get(deptId) : null;
  }, [deptId]);

  useEffect(() => {
    if (!deptId) {
      setServices([]);
      return;
    }

    // Si está en cache y sin error, usa directamente
    if (cacheEntry && !cacheEntry.isError) {
      setServices(cacheEntry.services);
      return;
    }

    setLoading(true);
    getDepartmentServices(deptId)
      .then((data) => {
        departmentServicesCache.set(deptId, { services: data });
        setServices(data);
      })
      .catch(() => {
        departmentServicesCache.set(deptId, { services: [], isError: true });
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, [deptId, cacheEntry]);

  return { services, loading };
}
