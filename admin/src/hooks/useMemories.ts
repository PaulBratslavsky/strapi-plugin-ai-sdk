import { useState, useEffect, useCallback } from 'react';
import { fetchMemories, createMemory as createMemoryApi, updateMemory as updateMemoryApi, deleteMemory, type Memory } from '../utils/memories-api';

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchMemories();
      setMemories(data);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addMemory = useCallback(async (data: { content: string; category?: string }) => {
    try {
      const created = await createMemoryApi(data);
      setMemories((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create memory:', err);
    }
  }, []);

  const editMemory = useCallback(async (documentId: string, data: { content?: string; category?: string }) => {
    try {
      const updated = await updateMemoryApi(documentId, data);
      setMemories((prev) =>
        prev.map((m) => (m.documentId === documentId ? { ...m, ...updated } : m))
      );
    } catch (err) {
      console.error('Failed to update memory:', err);
    }
  }, []);

  const removeMemory = useCallback(async (documentId: string) => {
    try {
      await deleteMemory(documentId);
      setMemories((prev) => prev.filter((m) => m.documentId !== documentId));
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  }, []);

  return { memories, loading, addMemory, editMemory, removeMemory, refresh: load };
}
