import { PLUGIN_ID } from '../pluginId';
import { getToken, getBackendURL } from './auth';

const BASE = () => `${getBackendURL()}/${PLUGIN_ID}/memories`;

function headers(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: headers(), ...init });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export interface Memory {
  documentId: string;
  content: string;
  category: string;
  createdAt: string;
}

export function fetchMemories(): Promise<Memory[]> {
  return request<Memory[]>(BASE());
}

export function createMemory(data: { content: string; category?: string }): Promise<Memory> {
  return request<Memory>(BASE(), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateMemory(
  documentId: string,
  data: { content?: string; category?: string }
): Promise<Memory> {
  return request<Memory>(`${BASE()}/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteMemory(documentId: string): Promise<void> {
  return request<void>(`${BASE()}/${documentId}`, { method: 'DELETE' });
}
