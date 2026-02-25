import type { Core } from '@strapi/strapi';
import type { UIMessage } from 'ai';
import { convertToModelMessages, stepCountIs } from 'ai';
import type { StreamTextRawResult } from '../lib/ai-provider';
import type { PluginConfig, PluginInstance } from '../lib/types';
import { createTools, describeTools } from '../tools';

const DEFAULT_PREAMBLE =
  'You are a Strapi CMS assistant. Use your tools to fulfill user requests. When asked to create or update content, use the appropriate tool — do not tell the user you cannot.';

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
      const result = await plugin.aiProvider!.generateText(prompt, {
        system: options?.system,
      });
      return result.text;
    },

    async askStream(prompt: string, options?: { system?: string }) {
      const result = await plugin.aiProvider!.streamText(prompt, {
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
      const modelMessages = await convertToModelMessages(messages);
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

      return plugin.aiProvider!.streamRaw({
        messages: modelMessages,
        system,
        tools,
        stopWhen: stepCountIs(6),
      });
    },

    isInitialized() {
      return plugin.aiProvider?.isInitialized() ?? false;
    },
  };
};

export default service;
