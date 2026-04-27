import type { Status, Priority, HelpDesk } from '../types';
import type { PaginatedResponse } from '@/lib/shared/types';

export type { HelpDesk };

/**
 * Filtros aplicables al listado de tickets.
 *
 * `status` y `priority` admiten `string` además de su tipo estricto para
 * representar el estado vacío `''` (sin filtro activo). Cuando el filtro
 * está vacío el hook no lo envía al backend.
 *
 * @todo Reemplazar `| string` por un tipo más estricto (ej. `Status | ''`)
 * una vez se implementen los inputs de filtro en la UI.
 *
 * `assignee_id` y `department` se mantienen como `string` porque los valores
 * provienen de inputs/selects del formulario — la conversión a número ocurre
 * al construir los query params.
 */
export type HelpDeskFilters = {
  status: Status | string;
  priority: Priority | string;
  assignee_id: string;
  department: string;
};

/** Estado del listado paginado de tickets con filtros activos. */
export type HelpDeskListState = {
  items: HelpDesk[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  filters: HelpDeskFilters;
};

/**
 * Acciones del reducer de listado de tickets.
 *
 * `SET_FILTER` actualiza un solo filtro; `SET_FILTERS` aplica varios a la vez
 * (útil para restaurar filtros desde URL o localStorage).
 * `UPDATE_ITEM` reemplaza un ticket en la lista por ID — usado tras cambios
 * de estado, asignación o resolución sin recargar toda la lista.
 * `REMOVE_ITEM` recibe directamente el ID del ticket a eliminar.
 */
export type HelpDeskListAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS';
      payload: PaginatedResponse<HelpDesk>;
    }
  | {
      type: 'LOAD_ERROR';
      payload: string;
    }
  | {
      type: 'SET_FILTER';
      payload: {
        key: keyof HelpDeskFilters;
        value: string;
      };
    }
  | {
      type: 'SET_FILTERS';
      payload: Partial<HelpDeskFilters>;
    }
  | { type: 'RESET_FILTERS' }
  | {
      type: 'UPDATE_ITEM';
      payload: HelpDesk;
    }
  | {
      type: 'REMOVE_ITEM';
      payload: number;
    };
