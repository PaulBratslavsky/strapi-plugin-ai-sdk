import type { ModelMessage, ToolSet, StopCondition } from 'ai';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { TTSProvider } from './tts/types';
import type { TTSRegistry } from './tts';
import type { AIProvider } from './ai-provider';
import type { ToolRegistry } from './tool-registry';

// StopCondition uses a generic that varies by tool implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStopCondition = StopCondition<any>;

export const CHAT_MODELS = [
  'claude-sonnet-4-20250514',
  'claude-opus-4-20250514',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
] as const;

export type ChatModelName = (typeof CHAT_MODELS)[number];

export const DEFAULT_MODEL: ChatModelName = 'claude-sonnet-4-20250514';
export const DEFAULT_TEMPERATURE = 0.7;

export interface MCPConfig {
  sessionTimeoutMs?: number;
  maxSessions?: number;
  cleanupInterval?: number;
}

export interface PluginConfig {
  anthropicApiKey: string;
  provider?: string;
  chatModel?: string;
  baseURL?: string;
  systemPrompt?: string;
  typecastApiKey?: string;
  typecastActorId?: string;
  mcp?: MCPConfig;
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

// Type guard to check if input is prompt-based
export function isPromptInput(input: GenerateInput): input is PromptInput {
  return 'prompt' in input;
}

// --- Plugin instance types (shared across bootstrap, destroy, controllers) ---

export interface MCPSession {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  createdAt: number;
}

export interface PluginInstance {
  aiProvider?: AIProvider;
  ttsProvider?: TTSProvider;
  ttsRegistry?: TTSRegistry;
  toolRegistry?: ToolRegistry;
  createMcpServer?: (() => McpServer) | null;
  mcpSessions?: Map<string, MCPSession> | null;
}
