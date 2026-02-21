import { useCallback, useRef, useState } from 'react';

/**
 * Progressively reveals text character-by-character over a given duration,
 * snapping to word boundaries so partial words never appear.
 */
export function useTextReveal() {
  const [visibleText, setVisibleText] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const rafRef = useRef<number | null>(null);
  const fullTextRef = useRef('');

  const stopReveal = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (fullTextRef.current) {
      setVisibleText(fullTextRef.current);
    }
    setIsRevealing(false);
  }, []);

  /**
   * Start revealing `text` over `duration` seconds.
   * Uses requestAnimationFrame for smooth pacing.
   */
  const startReveal = useCallback(
    (text: string, duration: number) => {
      stopReveal();
      fullTextRef.current = text;

      if (duration <= 0 || !text) {
        setVisibleText(text);
        setIsRevealing(false);
        return;
      }

      const totalChars = text.length;
      // Use full duration (in ms) — reveal paced across the entire audio
      const durationMs = duration * 1000;
      const startTime = performance.now();

      setVisibleText('');
      setIsRevealing(true);

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const targetChar = Math.floor(progress * totalChars);

        // Snap forward to the next word boundary (next space or end of text)
        let snapTo = targetChar;
        if (snapTo < totalChars) {
          // Find the next space after targetChar
          const nextSpace = text.indexOf(' ', snapTo);
          snapTo = nextSpace === -1 ? totalChars : nextSpace;
        }

        setVisibleText(text.slice(0, snapTo));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setVisibleText(text);
          setIsRevealing(false);
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [stopReveal]
  );

  const reset = useCallback(() => {
    stopReveal();
    fullTextRef.current = '';
    setVisibleText('');
    setIsRevealing(false);
  }, [stopReveal]);

  return { visibleText, isRevealing, startReveal, stopReveal, reset };
}
