/// <reference types="node" />
/**
 * Minimal interface for the streamText result with methods we need.
 * We define this to avoid TypeScript declaration issues with AI SDK's internal types.
 */
export interface StreamTextRawResult {
    readonly textStream: AsyncIterable<string>;
    toUIMessageStreamResponse(options?: {
        status?: number;
        statusText?: string;
        headers?: Record<string, string>;
        getErrorMessage?: (error: unknown) => string;
        sendUsage?: boolean;
    }): Response;
}
import { type ChatModelName, type GenerateInput, type GenerateTextResult, type StreamTextResult } from './types';
declare class AISDKManager {
    private provider;
    private model;
    /**
     * Initialize the manager with plugin configuration
     * Returns false if config is missing required fields
     */
    initialize(config: unknown): boolean;
    private getLanguageModel;
    private buildParams;
    generate(input: GenerateInput): Promise<GenerateTextResult>;
    stream(input: GenerateInput): Promise<StreamTextResult>;
    /**
     * Returns the raw streamText result for use with toUIMessageStreamResponse()
     * Compatible with AI SDK UI hooks (useChat, useCompletion)
     */
    streamRaw(input: GenerateInput): StreamTextRawResult;
    generateText(prompt: string, options?: Omit<GenerateInput, 'prompt' | 'messages'>): Promise<GenerateTextResult>;
    streamText(prompt: string, options?: Omit<GenerateInput, 'prompt' | 'messages'>): Promise<StreamTextResult>;
    getChatModel(): ChatModelName;
    isInitialized(): boolean;
    destroy(): void;
}
export declare const aiSDKManager: AISDKManager;
export { AISDKManager };
export * from './types';
