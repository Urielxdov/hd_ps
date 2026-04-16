import type { Estado } from '../types';

const VALID_TRANSITIONS: Record<Estado, Estado[]> = {
  abierto: ['en_progreso'],
  en_progreso: ['en_espera', 'resuelto'],
  en_espera: ['en_progreso', 'resuelto'],
  resuelto: ['cerrado'],
  cerrado: [],
};

export function canTransition(from: Estado, to: Estado): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getValidTransitions(from: Estado): Estado[] {
  return VALID_TRANSITIONS[from] ?? [];
}
