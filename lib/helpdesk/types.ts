export type Estado = 'abierto' | 'en_progreso' | 'en_espera' | 'resuelto' | 'cerrado';

export type Origen = 'error' | 'solicitud' | 'consulta' | 'mantenimiento';

export type Prioridad = 'baja' | 'media' | 'alta' | 'critica';

export type TipoAdjunto = 'archivo' | 'url';

export const ESTADO_LABELS: Record<Estado, string> = {
  abierto: 'Abierto',
  en_progreso: 'En progreso',
  en_espera: 'En espera',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

export const ORIGEN_LABELS: Record<Origen, string> = {
  error: 'Error',
  solicitud: 'Solicitud',
  consulta: 'Consulta',
  mantenimiento: 'Mantenimiento',
};

export const PRIORIDAD_LABELS: Record<Prioridad, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Critica',
};

export interface HDAttachment {
  id: number;
  tipo: TipoAdjunto;
  nombre: string;
  valor: string;
  created_at: string;
}

export interface HDComment {
  id: number;
  autor_id: number | null;
  contenido: string;
  es_interno: boolean;
  created_at: string;
}

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
