import type { Status } from '../types';

/**
 * Mapa de transiciones válidas entre estados de un ticket.
 *
 * Reglas de negocio:
 * - `open` solo puede avanzar a `in_progress` — el ticket debe ser
 *   tomado por un técnico antes de cualquier otra acción.
 * - `on_hold` puede resolverse directamente sin volver a `in_progress`,
 *   por si el problema se resuelve durante la espera.
 * - `closed` es estado terminal — no hay salida.
 *
 * No se exporta: los consumidores deben usar `canTransition` o
 * `getValidTransitions` para no acoplarse a la estructura interna.
 */
const VALID_TRANSITIONS: Record<Status, Status[]> = {
  open: ['in_progress'],
  in_progress: ['on_hold', 'resolved'],
  on_hold: ['in_progress', 'resolved'],
  resolved: ['closed'],
  closed: [],
};

/**
 * Verifica si una transición entre dos estados es válida.
 * Devuelve `false` para cualquier estado desconocido en lugar de lanzar error.
 */
export function canTransition(from: Status, to: Status): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Devuelve los estados a los que puede transicionar un ticket desde `from`.
 * Se usa para renderizar solo los botones de acción válidos en la UI.
 */
export function getValidTransitions(from: Status): Status[] {
  return VALID_TRANSITIONS[from] ?? [];
}
