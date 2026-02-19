export declare function createTriggerAnimationTool(): import("ai").Tool<{
    animation: "idle" | "speak" | "wave" | "nod" | "think" | "celebrate" | "shake" | "spin";
}, {
    triggered: "idle" | "speak" | "wave" | "nod" | "think" | "celebrate" | "shake" | "spin";
    status: string;
}>;
