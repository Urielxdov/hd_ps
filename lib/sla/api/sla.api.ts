import { apiClient } from '@/lib/shared/api/client';
import type { PaginatedResponse } from '@/lib/shared/types';
import type { TechnicianProfile, SLAConfig, ServiceQueueEntry } from '../types';

// --- TechnicianProfile ---

export async function getTechnicianProfiles(
  params?: Record<string, string>
): Promise<PaginatedResponse<TechnicianProfile>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/technician-profiles/${query}`);
}

export async function createTechnicianProfile(                                                   
    data: Pick<TechnicianProfile, 'user_id' | 'department' | 'active'>
  ): Promise<TechnicianProfile> {                                                    
    console.log(data)              
    const res = await apiClient.request('/technician-profiles/', {
      method: 'POST',                                                                              
      body: JSON.stringify(data),                           
    });                                                                                            
    console.log(res);
    return res;                                                                                    
  }     

export async function updateTechnicianProfile(
  id: number,
  data: Partial<Pick<TechnicianProfile, 'user_id' | 'department' | 'active'>>
): Promise<TechnicianProfile> {
  return apiClient.request(`/technician-profiles/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTechnicianProfile(id: number): Promise<void> {
  return apiClient.request(`/technician-profiles/${id}/`, {
    method: 'DELETE',
  });
}

// --- SLAConfig ---

export async function getSLAConfigs(
  params?: Record<string, string>
): Promise<PaginatedResponse<SLAConfig>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/sla-config/${query}`);
}

export async function createSLAConfig(
  data: Omit<SLAConfig, 'id' | 'department_name'>
): Promise<SLAConfig> {
  return apiClient.request('/sla-config/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSLAConfig(
  id: number,
  data: Partial<Omit<SLAConfig, 'id' | 'department_name'>>
): Promise<SLAConfig> {
  return apiClient.request(`/sla-config/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// --- ServiceQueue ---

export async function getServiceQueue(
  params?: Record<string, string>
): Promise<PaginatedResponse<ServiceQueueEntry>> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.request(`/service-queue/${query}`);
}
