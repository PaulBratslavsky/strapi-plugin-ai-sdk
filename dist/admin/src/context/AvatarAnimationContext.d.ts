import { type ReactNode } from 'react';
interface AvatarAnimationState {
    currentAnimation: string;
    requestId: number;
    trigger: (animation: string) => void;
    clearAnimation: () => void;
}
export declare function AvatarAnimationProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAvatarAnimation(): AvatarAnimationState;
export {};
