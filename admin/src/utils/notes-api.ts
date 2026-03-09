import { PLUGIN_ID } from '../pluginId';
import { getToken, getBackendURL } from './auth';

const BASE = () => `${getBackendURL()}/${PLUGIN_ID}/notes`;

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

export interface Note {
  documentId: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  source: string;
  createdAt: string;
}

export function fetchNotes(): Promise<Note[]> {
  return request<Note[]>(BASE());
}

export function createNote(data: {
  title?: string;
  content: string;
  category?: string;
  tags?: string;
  source?: string;
}): Promise<Note> {
  return request<Note>(BASE(), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateNote(
  documentId: string,
  data: { title?: string; content?: string; category?: string; tags?: string; source?: string }
): Promise<Note> {
  return request<Note>(`${BASE()}/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteNote(documentId: string): Promise<void> {
  return request<void>(`${BASE()}/${documentId}`, { method: 'DELETE' });
}

export function clearAllNotes(): Promise<{ deleted: number }> {
  return request<{ deleted: number }>(`${BASE()}/clear`, { method: 'DELETE' });
}
