import { Estado, HDAttachment, Origen, Prioridad } from "../types";

export interface HelpDesk {
  id: number;
  folio: string;
  solicitante_id: number | null;
  responsable_id: number | null;
  service: number;
  service_nombre: string;
  origen: Origen;
  prioridad: Prioridad;
  estado: Estado;
  descripcion_problema: string;
  descripcion_solucion: string | null;
  fecha_asignacion: string | null;
  fecha_compromiso: string | null;
  fecha_efectividad: string | null;
  tiempo_estimado: number;
  attachments: HDAttachment[];
  created_at: string;
  updated_at: string;
}

export type PaginatedResponseHD<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type HelpDeskFilters = {
  estado: Estado | string;
  prioridad: Prioridad | string;
  responsable_id: string;
};

export type HelpDeskListState = {
  items: HelpDesk[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  filters: HelpDeskFilters;
};

export type HelpDeskListAction =
  | { type: 'LOAD_START' }
  | {
      type: 'LOAD_SUCCESS';
      payload: PaginatedResponseHD<HelpDesk>;
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