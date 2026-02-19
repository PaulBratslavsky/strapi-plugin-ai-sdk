import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AvatarAnimationState {
  currentAnimation: string;
  requestId: number;
  trigger: (animation: string) => void;
  clearAnimation: () => void;
}

const AvatarAnimationContext = createContext<AvatarAnimationState | null>(null);

export function AvatarAnimationProvider({ children }: { children: ReactNode }) {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [requestId, setRequestId] = useState(0);

  const trigger = useCallback((animation: string) => {
    setCurrentAnimation(animation);
    setRequestId((prev) => prev + 1);
  }, []);

  const clearAnimation = useCallback(() => {
    setCurrentAnimation('idle');
    setRequestId((prev) => prev + 1);
  }, []);

  return (
    <AvatarAnimationContext.Provider value={{ currentAnimation, requestId, trigger, clearAnimation }}>
      {children}
    </AvatarAnimationContext.Provider>
  );
}

export function useAvatarAnimation() {
  const ctx = useContext(AvatarAnimationContext);
  if (!ctx) throw new Error('useAvatarAnimation must be used within AvatarAnimationProvider');
  return ctx;
}
