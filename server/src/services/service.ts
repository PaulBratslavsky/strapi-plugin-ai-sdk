import type { Core } from '@strapi/strapi';
import type { UIMessage } from 'ai';
import { convertToModelMessages, stepCountIs } from 'ai';
import type { StreamTextRawResult } from '../lib/ai-provider';
import type { PluginConfig, PluginInstance } from '../lib/types';
import {
  DEFAULT_MAX_OUTPUT_TOKENS,
  DEFAULT_MAX_CONVERSATION_MESSAGES,
  DEFAULT_PUBLIC_MAX_CONVERSATION_MESSAGES,
  DEFAULT_MAX_STEPS,
  DEFAULT_PUBLIC_MAX_STEPS,
  DEFAULT_PUBLIC_CHAT_MODEL,
} from '../lib/types';
import { createTools, createPublicTools, describeTools } from '../tools';

const DEFAULT_PREAMBLE =
  'You are a Strapi CMS assistant. Use your tools to fulfill user requests. When asked to create or update content, use the appropriate tool — do not tell the user you cannot. When performing bulk operations (e.g. publish multiple items), call multiple tools in parallel in a single step rather than one at a time.';

const DEFAULT_PUBLIC_PREAMBLE =
  'You are a helpful public assistant for this website. Use your tools to answer questions about the site content. You cannot modify any content or perform administrative actions.';

function composeSystemPrompt(config: PluginConfig | undefined, toolsDescription: string, override?: string): string {
  // If the caller provided an explicit system prompt, use it as the base
  const base = override || config?.systemPrompt || DEFAULT_PREAMBLE;

  // Support {tools} placeholder in the base prompt
  if (base.includes('{tools}')) {
    return base.replace('{tools}', toolsDescription);
  }

  // Otherwise append tool descriptions
  return `${base}\n\n${toolsDescription}`;
}

const service = ({ strapi }: { strapi: Core.Strapi }) => {
  const plugin = strapi.plugin('ai-sdk') as unknown as PluginInstance;

  return {
    async ask(prompt: string, options?: { system?: string }) {
      if (!plugin.aiProvider) {
        throw new Error('AI provider not initialized');
      }
      const result = await plugin.aiProvider.generateText(prompt, {
        system: options?.system,
      });
      return result.text;
    },

    async askStream(prompt: string, options?: { system?: string }) {
      if (!plugin.aiProvider) {
        throw new Error('AI provider not initialized');
      }
      const result = await plugin.aiProvider.streamText(prompt, {
        system: options?.system,
      });
      return result.textStream;
    },

    /**
     * Chat with messages - returns raw stream for UI message stream response
     * Compatible with AI SDK UI hooks (useChat)
     */
    async chat(messages: UIMessage[], options?: { system?: string; adminUserId?: number }): Promise<StreamTextRawResult> {
      const config = strapi.config.get<PluginConfig>('plugin::ai-sdk');
      const maxMessages = config?.maxConversationMessages ?? DEFAULT_MAX_CONVERSATION_MESSAGES;
      const maxOutputTokens = config?.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS;
      const maxSteps = config?.maxSteps ?? DEFAULT_MAX_STEPS;

      // Truncate conversation history to limit input tokens
      const trimmedMessages = messages.length > maxMessages
        ? messages.slice(-maxMessages)
        : messages;

      const modelMessages = await convertToModelMessages(trimmedMessages);
      const tools = createTools(strapi, { adminUserId: options?.adminUserId });
      const toolsDescription = describeTools(tools);
      let system = composeSystemPrompt(config, toolsDescription, options?.system);

      // Inject user memories into system prompt
      if (options?.adminUserId) {
        try {
          const memories = await strapi.documents('plugin::ai-sdk.memory' as any).findMany({
            filters: { adminUserId: options.adminUserId },
            fields: ['content', 'category'],
          });
          if (memories.length > 0) {
            const lines = memories.map((m: any) => `- [${m.category}] ${m.content}`);
            system += `\n\nUser memories (facts you have saved about this user from previous conversations — use these to personalize your responses):\n${lines.join('\n')}`;
          }
        } catch (err) {
          strapi.log.warn('[ai-sdk] Failed to load user memories:', err);
        }
      }

      if (!plugin.aiProvider) {
        throw new Error('AI provider not initialized');
      }
      return plugin.aiProvider.streamRaw({
        messages: modelMessages,
        system,
        tools,
        maxOutputTokens,
        stopWhen: stepCountIs(maxSteps),
      });
    },

    /**
     * Public chat - restricted tools, public memories, no admin auth
     */
    async publicChat(messages: UIMessage[], options?: { system?: string }): Promise<StreamTextRawResult> {
      const config = strapi.config.get<PluginConfig>('plugin::ai-sdk');
      const publicConfig = config?.publicChat;
      const maxMessages = publicConfig?.maxConversationMessages ?? DEFAULT_PUBLIC_MAX_CONVERSATION_MESSAGES;
      const maxOutputTokens = config?.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS;
      const maxSteps = publicConfig?.maxSteps ?? DEFAULT_PUBLIC_MAX_STEPS;
      const publicModel = publicConfig?.chatModel ?? DEFAULT_PUBLIC_CHAT_MODEL;
      const allowedContentTypes = publicConfig?.allowedContentTypes ?? [];

      const trimmedMessages = messages.length > maxMessages
        ? messages.slice(-maxMessages)
        : messages;

      const modelMessages = await convertToModelMessages(trimmedMessages);
      const tools = createPublicTools(strapi, allowedContentTypes);
      const toolsDescription = describeTools(tools);
      let system = composeSystemPrompt(config, toolsDescription, options?.system || DEFAULT_PUBLIC_PREAMBLE);

      // Inject public memories into system prompt
      try {
        const memories = await strapi.documents('plugin::ai-sdk.public-memory' as any).findMany({
          fields: ['content', 'category'],
          sort: { createdAt: 'desc' },
        });
        if (memories.length > 0) {
          const lines = memories.map((m: any) => `- [${m.category}] ${m.content}`);
          system += `\n\nPublic knowledge base (facts and information available to all visitors):\n${lines.join('\n')}`;
        }
      } catch (err) {
        strapi.log.warn('[ai-sdk] Failed to load public memories:', err);
      }

      if (!plugin.aiProvider) {
        throw new Error('AI provider not initialized');
      }
      return plugin.aiProvider.streamRaw({
        messages: modelMessages,
        system,
        tools,
        maxOutputTokens,
        modelId: publicModel,
        stopWhen: stepCountIs(maxSteps),
      });
    },

    isInitialized() {
      return plugin.aiProvider?.isInitialized() ?? false;
    },
  };
};

export default service;
