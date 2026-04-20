import { apiClient } from './client';

export interface Choices {
  impact: string[];
  priority: string[];
  origin: string[];
  status: string[];
}

export async function getChoices(): Promise<Choices> {
  return apiClient.request('/choices/');
}
