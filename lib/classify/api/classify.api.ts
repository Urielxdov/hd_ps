import { apiClient } from '@/lib/shared/api/client';

export interface ClassifySuggestion {
  service_id: number;
  service_name: string;
  category_id: number;
  category_name: string;
  department_id: number;
  department_name: string;
  score: number;
}

export interface ClassifyResponse {
  suggestions: ClassifySuggestion[];
}

export async function classifyText(text: string): Promise<ClassifyResponse> {
  return apiClient.request('/classify/', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function sendClassifyFeedback(data: {
  problem_description: string;
  suggested_service: number | null;
  chosen_service: number;
  accepted: boolean;
}): Promise<void> {
  return apiClient.request('/classify/feedback/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
