import type { ModelMessage, ToolSet, StopCondition } from 'ai';
type AnyStopCondition = StopCondition<any>;
export declare const CHAT_MODELS: readonly ["claude-sonnet-4-20250514", "claude-opus-4-20250514", "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-haiku-20240307"];
export type ChatModelName = (typeof CHAT_MODELS)[number];
export declare const DEFAULT_MODEL: ChatModelName;
export declare const DEFAULT_TEMPERATURE = 0.7;
export interface PluginConfig {
    anthropicApiKey: string;
    chatModel?: ChatModelName;
    baseURL?: string;
    systemPrompt?: string;
}
export interface GenerateOptions {
    system?: string;
    temperature?: number;
    maxOutputTokens?: number;
    tools?: ToolSet;
    stopWhen?: AnyStopCondition;
}
export interface PromptInput extends GenerateOptions {
    prompt: string;
}
export interface MessagesInput extends GenerateOptions {
    messages: ModelMessage[];
}
export type GenerateInput = PromptInput | MessagesInput;
export interface GenerateTextResult {
    text: string;
}
export interface StreamTextResult {
    textStream: AsyncIterable<string>;
}
export declare function isPromptInput(input: GenerateInput): input is PromptInput;
export {};
