export interface ServiceCategory {
  id: number;
  nombre: string;
  department: number;
  department_nombre: string;
  activo: boolean;
}

export interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  category: number;
  category_nombre: string;
  tiempo_estimado_default: number;
  activo: boolean;
  created_at: string;
}
