import { useCallback, useRef, useState } from 'react';
import { PLUGIN_ID } from '../pluginId';
import { getToken, getBackendURL } from '../utils/auth';

export interface AudioPlayerOptions {
  onPlayStart?: (duration: number) => void;
  onPlayEnded?: () => void;
}

/** Strip markdown syntax so Typecast gets clean prose */
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')        // code blocks
    .replace(/`([^`]+)`/g, '$1')           // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')        // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')  // links → text
    .replace(/#{1,6}\s*/g, '')              // headings
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/>\s?/g, '')                   // blockquotes
    .replace(/[-*+]\s/g, '')               // list markers
    .replace(/\d+\.\s/g, '')               // ordered list markers
    .replace(/\n{2,}/g, ' ')               // collapse newlines
    .replace(/\s{2,}/g, ' ')               // collapse spaces
    .trim();
}

export function useAudioPlayer(options?: AudioPlayerOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      stop();

      const clean = stripMarkdown(text);
      if (clean.length < 3) {
        optionsRef.current?.onPlayStart?.(0);
        optionsRef.current?.onPlayEnded?.();
        return;
      }

      const token = getToken();
      try {
        const response = await fetch(`${getBackendURL()}/${PLUGIN_ID}/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ text: clean }),
        });
        if (!response.ok) {
          optionsRef.current?.onPlayStart?.(0);
          optionsRef.current?.onPlayEnded?.();
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        // Wait for duration to be known before playing
        const duration = await new Promise<number>((resolve) => {
          audio.onloadedmetadata = () => {
            resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
          };
          // Fallback if metadata never fires
          audio.onerror = () => resolve(0);
        });

        audio.onplay = () => {
          setIsPlaying(true);
          optionsRef.current?.onPlayStart?.(duration);
        };
        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
          URL.revokeObjectURL(url);
          optionsRef.current?.onPlayEnded?.();
        };
        audio.onerror = () => {
          setIsPlaying(false);
          audioRef.current = null;
          URL.revokeObjectURL(url);
          optionsRef.current?.onPlayEnded?.();
        };

        await audio.play();
      } catch {
        setIsPlaying(false);
        optionsRef.current?.onPlayStart?.(0);
        optionsRef.current?.onPlayEnded?.();
      }
    },
    [stop]
  );

  return { speak, stop, isPlaying };
}
