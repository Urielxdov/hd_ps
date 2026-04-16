import { apiClient } from '@/lib/shared/api/client';

export async function login(
  userId: number,
  role: string
): Promise<{ access: string }> {
  return apiClient.request('/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, role }),
  });
}
