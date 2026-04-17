export type Impact = 'individual' | 'area' | 'company';

export const IMPACT_LABELS: Record<Impact, string> = {
  individual: 'Individual',
  area: 'Área',
  company: 'Empresa',
};

export interface TechnicianProfile {
  id: number;
  user_id: number;
  department: number;
  department_name: string;
  active: boolean;
  created_at: string;
}

export interface SLAConfig {
  id: number;
  department: number | null;
  department_name: string;
  max_load: number;
  score_overdue: number;
  score_company: number;
  score_area: number;
  score_individual: number;
  score_critical: number;
  score_high: number;
  score_medium: number;
  score_low: number;
}

export interface ServiceQueueEntry {
  id: number;
  folio: string;
  priority: string;
  impact: Impact;
  department: string;
  due_date: string | null;
  urgency_score: number;
  queued_at: string;
}
