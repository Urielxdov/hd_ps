import type { Status } from '../types';

const VALID_TRANSITIONS: Record<Status, Status[]> = {
  open: ['in_progress'],
  in_progress: ['on_hold', 'resolved'],
  on_hold: ['in_progress', 'resolved'],
  resolved: ['closed'],
  closed: [],
};

export function canTransition(from: Status, to: Status): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getValidTransitions(from: Status): Status[] {
  return VALID_TRANSITIONS[from] ?? [];
}
