import type { Estado, Prioridad } from '../types';
import { ESTADO_LABELS, PRIORIDAD_LABELS } from '../types';

const ESTADO_COLORS: Record<Estado, string> = {
  abierto: 'bg-blue-100 text-blue-800',
  en_progreso: 'bg-yellow-100 text-yellow-800',
  en_espera: 'bg-orange-100 text-orange-800',
  resuelto: 'bg-green-100 text-green-800',
  cerrado: 'bg-slate-100 text-slate-800',
};

const PRIORIDAD_COLORS: Record<Prioridad, string> = {
  baja: 'bg-slate-100 text-slate-700',
  media: 'bg-blue-100 text-blue-700',
  alta: 'bg-orange-100 text-orange-700',
  critica: 'bg-red-100 text-red-700',
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[estado]}`}>
      {ESTADO_LABELS[estado]}
    </span>
  );
}

export function PrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORIDAD_COLORS[prioridad]}`}>
      {PRIORIDAD_LABELS[prioridad]}
    </span>
  );
}
