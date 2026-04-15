import { Department, PaginatedResponse } from './departaments/types';
import { HelpDesk, PaginatedResponseHD } from './helpdesk/types';
import type {
  ServiceCategory,
  Service,
  HDAttachment,
  HDComment,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(res.status, body.error || res.statusText, body.code);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  // Auth
  async login(userId: number, role: string): Promise<{ access: string }> {
    return this.request('/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, role }),
    });
  }

  // Departments
  async getDepartments(
    params?: Record<string, string>
  ): Promise<PaginatedResponse<Department>> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/departments/${query}`);
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    return this.request('/departments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(id: number, data: Partial<Department>): Promise<Department> {
    return this.request(`/departments/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getDepartmentCategories(departmentId: number): Promise<ServiceCategory[]> {
    return this.request(`/departments/${departmentId}/categories/`);
  }

  // Service Categories
  async createServiceCategory(data: { nombre: string; department: number }): Promise<ServiceCategory> {
    return this.request('/service-categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServiceCategory(id: number, data: Partial<ServiceCategory>): Promise<ServiceCategory> {
    return this.request(`/service-categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getCategoryServices(categoryId: number): Promise<Service[]> {
    return this.request(`/service-categories/${categoryId}/services/`);
  }

  // Services
  async createService(data: { nombre: string; descripcion: string; category: number; tiempo_estimado_default: number }): Promise<Service> {
    return this.request('/services/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    return this.request(`/services/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleService(id: number): Promise<Service> {
    return this.request(`/services/${id}/toggle/`, { method: 'PATCH' });
  }

  // Help Desks
  async getHelpDesks(
    params?: Record<string, string>
  ): Promise<PaginatedResponseHD<HelpDesk>> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/helpdesks/${query}`);
  }

  async getHelpDesk(id: number): Promise<HelpDesk> {
    return this.request(`/helpdesks/${id}/`);
  }

  async createHelpDesk(data: {
    service: number;
    origen: string;
    prioridad: string;
    descripcion_problema: string;
    tiempo_estimado?: number;
  }): Promise<HelpDesk> {
    return this.request('/helpdesks/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changeStatus(id: number, estado: string): Promise<HelpDesk> {
    return this.request(`/helpdesks/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    });
  }

  async assignHelpDesk(id: number, data: { responsable_id: number; fecha_compromiso?: string }): Promise<HelpDesk> {
    return this.request(`/helpdesks/${id}/assign/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async resolveHelpDesk(id: number, descripcion_solucion: string): Promise<HelpDesk> {
    return this.request(`/helpdesks/${id}/resolve/`, {
      method: 'PATCH',
      body: JSON.stringify({ descripcion_solucion }),
    });
  }

  // Attachments
  async uploadAttachment(helpDeskId: number, file: File, nombre: string): Promise<HDAttachment> {
    const formData = new FormData();
    formData.append('tipo', 'archivo');
    formData.append('nombre', nombre);
    formData.append('archivo', file);
    return this.request(`/helpdesks/${helpDeskId}/attachments/`, {
      method: 'POST',
      body: formData,
    });
  }

  async addUrlAttachment(helpDeskId: number, nombre: string, url: string): Promise<HDAttachment> {
    return this.request(`/helpdesks/${helpDeskId}/attachments/`, {
      method: 'POST',
      body: JSON.stringify({ tipo: 'url', nombre, valor: url }),
    });
  }

  async deleteAttachment(helpDeskId: number, attachmentId: number): Promise<void> {
    return this.request(`/helpdesks/${helpDeskId}/attachments/${attachmentId}/`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getComments(helpDeskId: number): Promise<HDComment[]> {
    return this.request(`/helpdesks/${helpDeskId}/comments/`);
  }

  async addComment(helpDeskId: number, contenido: string, es_interno: boolean = false): Promise<HDComment> {
    return this.request(`/helpdesks/${helpDeskId}/comments/`, {
      method: 'POST',
      body: JSON.stringify({ contenido, es_interno }),
    });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export const api = new ApiClient();
