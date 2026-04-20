export interface ServiceCategory {
  id: number;
  name: string;
  department: number;
  department_name: string;
  active: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category: number;
  category_name: string;
  estimated_hours: number;
  client_close: boolean;
  impact: string;
  active: boolean;
  created_at: string;
}
