import { PLUGIN_ID } from '../pluginId';
import { getToken, getBackendURL } from './auth';

const BASE = () => `${getBackendURL()}/${PLUGIN_ID}/public-memories`;

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

export interface PublicMemory {
  documentId: string;
  content: string;
  category: string;
  createdAt: string;
}

export function fetchPublicMemories(): Promise<PublicMemory[]> {
  return request<PublicMemory[]>(BASE());
}

export function createPublicMemory(data: { content: string; category?: string }): Promise<PublicMemory> {
  return request<PublicMemory>(BASE(), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePublicMemory(
  documentId: string,
  data: { content?: string; category?: string }
): Promise<PublicMemory> {
  return request<PublicMemory>(`${BASE()}/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePublicMemory(documentId: string): Promise<void> {
  return request<void>(`${BASE()}/${documentId}`, { method: 'DELETE' });
}
