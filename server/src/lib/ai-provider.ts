import { generateText, streamText, type LanguageModel } from 'ai';

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

import {
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  isPromptInput,
  type PluginConfig,
  type GenerateInput,
  type GenerateTextResult,
  type StreamTextResult,
} from './types';

type ProviderCreator = (config: { apiKey: string; baseURL?: string }) => (modelId: string) => LanguageModel;

export class AIProvider {
  private static providerRegistry = new Map<string, ProviderCreator>();

  private modelFactory: ((modelId: string) => LanguageModel) | null = null;
  private model: string = DEFAULT_MODEL;

  /**
   * Register a named provider creator.
   * Call this before initialize() — typically in bootstrap.
   */
  static registerProvider(name: string, creator: ProviderCreator): void {
    AIProvider.providerRegistry.set(name, creator);
  }

  /**
   * Initialize the provider with plugin configuration.
   * Returns false if config is missing required fields.
   */
  initialize(config: unknown): boolean {
    const cfg = config as Partial<PluginConfig> | undefined;

    if (!cfg?.anthropicApiKey) {
      return false;
    }

    const providerName = cfg.provider ?? 'anthropic';
    const creator = AIProvider.providerRegistry.get(providerName);
    if (!creator) {
      throw new Error(
        `AI provider "${providerName}" not registered. ` +
        `Registered: ${[...AIProvider.providerRegistry.keys()].join(', ') || 'none'}. ` +
        `Register providers in bootstrap before initializing.`
      );
    }

    this.modelFactory = creator({ apiKey: cfg.anthropicApiKey, baseURL: cfg.baseURL });

    if (cfg.chatModel) {
      this.model = cfg.chatModel;
    }

    return true;
  }

  private getLanguageModel(): LanguageModel {
    if (!this.modelFactory) {
      throw new Error('AIProvider not initialized');
    }
    return this.modelFactory(this.model);
  }

  private buildParams(input: GenerateInput) {
    const base = {
      model: this.getLanguageModel(),
      system: input.system,
      temperature: input.temperature ?? DEFAULT_TEMPERATURE,
      maxOutputTokens: input.maxOutputTokens,
      tools: input.tools,
      stopWhen: input.stopWhen,
    };

    return isPromptInput(input)
      ? { ...base, prompt: input.prompt }
      : { ...base, messages: input.messages };
  }

  async generate(input: GenerateInput): Promise<GenerateTextResult> {
    const result = await generateText(this.buildParams(input));
    return { text: result.text };
  }

  async stream(input: GenerateInput): Promise<StreamTextResult> {
    const result = streamText(this.buildParams(input));
    return { textStream: result.textStream };
  }

  /**
   * Returns the raw streamText result for use with toUIMessageStreamResponse().
   * Compatible with AI SDK UI hooks (useChat, useCompletion).
   */
  streamRaw(input: GenerateInput): StreamTextRawResult {
    return streamText(this.buildParams(input)) as StreamTextRawResult;
  }

  // Convenience methods for simple prompt-based calls
  async generateText(prompt: string, options?: Omit<GenerateInput, 'prompt' | 'messages'>): Promise<GenerateTextResult> {
    return this.generate({ prompt, ...options });
  }

  async streamText(prompt: string, options?: Omit<GenerateInput, 'prompt' | 'messages'>): Promise<StreamTextResult> {
    return this.stream({ prompt, ...options });
  }

  getChatModel(): string {
    return this.model;
  }

  isInitialized(): boolean {
    return this.modelFactory !== null;
  }

  destroy(): void {
    this.modelFactory = null;
  }
}
