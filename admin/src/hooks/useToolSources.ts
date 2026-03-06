import { useState, useEffect, useCallback, useMemo } from 'react';
import { PLUGIN_ID } from '../pluginId';
import { getToken, getBackendURL } from '../utils/auth';

const STORAGE_KEY = `${PLUGIN_ID}:enabledToolSources`;

export interface ToolSource {
  id: string;
  label: string;
  toolCount: number;
  tools: string[];
}

export function useToolSources() {
  const [sources, setSources] = useState<ToolSource[]>([]);
  const [enabledSources, setEnabledSources] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return new Set(JSON.parse(stored));
    } catch { /* ignore */ }
    return new Set<string>();
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = getToken();
    fetch(`${getBackendURL()}/${PLUGIN_ID}/tool-sources`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((json) => {
        const data: ToolSource[] = json.data ?? [];
        setSources(data);

        // On first load, if nothing stored, enable all by default
        setEnabledSources((prev) => {
          if (prev.size === 0) {
            const all = new Set(data.filter((s) => s.id !== 'built-in').map((s) => s.id));
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...all]));
            return all;
          }
          return prev;
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const toggleSource = useCallback((id: string) => {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const enabledToolSources = useMemo(
    () => (loaded ? [...enabledSources] : undefined),
    [enabledSources, loaded]
  );

  return { sources, enabledSources, enabledToolSources, toggleSource, loaded };
}
