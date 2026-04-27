'use client';

import { useState, useEffect } from 'react';
import { getDepartmentServices } from '../api/catalog.api';
import type { Service } from '../types';

/**
 * Obtiene todos los servicios de un departamento sin caché.
 *
 * A diferencia de `useServiceCache`, este hook no persiste los datos
 * entre renders — cada cambio de `deptId` dispara un nuevo fetch.
 * Se usa en contextos donde se necesita la lista plana de servicios
 * del departamento completo, sin importar la categoría (ej. crear ticket).
 *
 * Pasar `null` como `deptId` limpia la lista sin hacer fetch,
 * útil cuando aún no hay departamento seleccionado.
 *
 * Los errores de red se silencian y devuelven lista vacía — no hay
 * estado de error expuesto intencionalmente para simplificar el contrato.
 */
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
