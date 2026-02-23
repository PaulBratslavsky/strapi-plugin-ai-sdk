import type { Core } from '@strapi/strapi';
import type { UIMessage } from 'ai';
import { convertToModelMessages, stepCountIs } from 'ai';
import type { StreamTextRawResult } from '../lib/ai-provider';
import type { PluginInstance } from '../lib/types';
import { createTools, describeTools } from '../tools';

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
    async chat(messages: UIMessage[], options?: { system?: string }): Promise<StreamTextRawResult> {
      const modelMessages = await convertToModelMessages(messages);
      const tools = createTools(strapi);
      const toolsPrompt = describeTools(tools);
      const system = options?.system
        ? `${options.system}\n\n${toolsPrompt}`
        : toolsPrompt;
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
