import { useState, useEffect, useCallback } from 'react';
import {
  fetchNotes,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote,
  clearAllNotes as clearAllNotesApi,
  type Note,
} from '../utils/notes-api';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addNote = useCallback(async (data: { title?: string; content: string; category?: string; tags?: string; source?: string }) => {
    try {
      const created = await createNoteApi(data);
      setNotes((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  }, []);

  const editNote = useCallback(async (documentId: string, data: { title?: string; content?: string; category?: string; tags?: string; source?: string }) => {
    try {
      const updated = await updateNoteApi(documentId, data);
      setNotes((prev) =>
        prev.map((n) => (n.documentId === documentId ? { ...n, ...updated } : n))
      );
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  }, []);

  const removeNote = useCallback(async (documentId: string) => {
    try {
      await deleteNote(documentId);
      setNotes((prev) => prev.filter((n) => n.documentId !== documentId));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await clearAllNotesApi();
      setNotes([]);
    } catch (err) {
      console.error('Failed to clear notes:', err);
    }
  }, []);

  return { notes, loading, addNote, editNote, removeNote, clearAll, refresh: load };
}
