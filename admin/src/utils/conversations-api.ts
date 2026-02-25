import { PLUGIN_ID } from '../pluginId';
import { getToken, getBackendURL } from './auth';

const BASE = () => `${getBackendURL()}/${PLUGIN_ID}/conversations`;

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

export interface ConversationSummary {
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation extends ConversationSummary {
  messages: unknown[];
}

export function fetchConversations(): Promise<ConversationSummary[]> {
  return request<ConversationSummary[]>(BASE());
}

export function fetchConversation(documentId: string): Promise<Conversation> {
  return request<Conversation>(`${BASE()}/${documentId}`);
}

export function createConversation(data: { title?: string; messages?: unknown[] }): Promise<Conversation> {
  return request<Conversation>(BASE(), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateConversation(
  documentId: string,
  data: { title?: string; messages?: unknown[] }
): Promise<Conversation> {
  return request<Conversation>(`${BASE()}/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteConversation(documentId: string): Promise<void> {
  return request<void>(`${BASE()}/${documentId}`, { method: 'DELETE' });
}
