import { useState, useEffect, useCallback } from 'react';
import { fetchPublicMemories, createPublicMemory as createApi, updatePublicMemory as updateApi, deletePublicMemory, type PublicMemory } from '../utils/public-memories-api';

export function usePublicMemories() {
  const [memories, setMemories] = useState<PublicMemory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchPublicMemories();
      setMemories(data);
    } catch (err) {
      console.error('Failed to load public memories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addMemory = useCallback(async (data: { content: string; category?: string }) => {
    try {
      const created = await createApi(data);
      setMemories((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create public memory:', err);
    }
  }, []);

  const editMemory = useCallback(async (documentId: string, data: { content?: string; category?: string }) => {
    try {
      const updated = await updateApi(documentId, data);
      setMemories((prev) =>
        prev.map((m) => (m.documentId === documentId ? { ...m, ...updated } : m))
      );
    } catch (err) {
      console.error('Failed to update public memory:', err);
    }
  }, []);

  const removeMemory = useCallback(async (documentId: string) => {
    try {
      await deletePublicMemory(documentId);
      setMemories((prev) => prev.filter((m) => m.documentId !== documentId));
    } catch (err) {
      console.error('Failed to delete public memory:', err);
    }
  }, []);

  return { memories, loading, addMemory, editMemory, removeMemory, refresh: load };
}
