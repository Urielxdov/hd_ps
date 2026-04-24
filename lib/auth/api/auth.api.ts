import { apiClient } from '@/lib/shared/api/client';
import type { Role } from '../types';

export async function login(
  userId: number,
  role: string
): Promise<{ access: string }> {
  return apiClient.request('/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, role }),
  });
}

export async function switchRole(
  role: Role | null
): Promise<{ token: string; role: Role; active_role: Role | null }> {
  return apiClient.request('/auth/switch-role/', {
    method: 'POST',
    body: JSON.stringify({ active_role: role }),
  });
}

export async function getMe(): Promise<{ user_id: number; role: Role; active_role: Role | null }> {
  return apiClient.request('/auth/me/');
}
