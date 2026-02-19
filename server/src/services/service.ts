import type { Core } from '@strapi/strapi';
import type { UIMessage } from 'ai';
import { convertToModelMessages, stepCountIs } from 'ai';
import { aiSDKManager, type StreamTextRawResult } from '../lib/init-ai-sdk';
import { createTools, describeTools } from '../tools';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async ask(prompt: string, options?: { system?: string }) {
    const result = await aiSDKManager.generateText(prompt, {
      system: options?.system,
    });
    return result.text;
  },

  async askStream(prompt: string, options?: { system?: string }) {
    const result = await aiSDKManager.streamText(prompt, {
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
    return aiSDKManager.streamRaw({
      messages: modelMessages,
      system,
      tools,
      stopWhen: stepCountIs(6),
    });
  },

  isInitialized() {
    return aiSDKManager.isInitialized();
  },
});

export default service;
