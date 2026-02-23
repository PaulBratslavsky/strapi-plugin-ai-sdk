import type { Core } from '@strapi/strapi';
import { z } from 'zod';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMcpServer } from './mcp/server';
import { createTTSRegistry } from './lib/tts';
import { AIProvider } from './lib/ai-provider';
import { ToolRegistry } from './lib/tool-registry';
import {
  listContentTypes,
  listContentTypesSchema,
  listContentTypesDescription,
  searchContent,
  searchContentSchema,
  searchContentDescription,
  writeContent,
  writeContentSchema,
  writeContentDescription,
} from './tool-logic';
import { sanitizeInput, sanitizeOutput } from './mcp/utils/sanitize';
import type { PluginConfig, PluginInstance } from './lib/types';

const PLUGIN_ID = 'ai-sdk';

function registerBuiltInTools(registry: ToolRegistry): void {
  registry.register({
    name: 'listContentTypes',
    description: listContentTypesDescription,
    schema: listContentTypesSchema,
    execute: async (_args, strapi) => listContentTypes(strapi),
  });

  registry.register({
    name: 'searchContent',
    description: searchContentDescription,
    schema: searchContentSchema,
    execute: async (args, strapi) => searchContent(strapi, args),
  });

  registry.register({
    name: 'writeContent',
    description: writeContentDescription,
    schema: writeContentSchema,
    execute: async (args, strapi) => {
      const sanitizedData = await sanitizeInput(strapi, args.contentType, args.data);
      const result = await writeContent(strapi, { ...args, data: sanitizedData });
      const sanitizedDoc = await sanitizeOutput(strapi, args.contentType, result.document);
      return { ...result, document: sanitizedDoc };
    },
  });

  registry.register({
    name: 'triggerAnimation',
    description: [
      'Trigger a 3D avatar animation on the client. ALWAYS call this at the start of every response.',
      'Available animations and when to use them:',
      '- speak: DEFAULT — use this for all normal responses (head nods, arm gestures, like talking)',
      '- wave: greeting the user or saying hello/goodbye',
      '- nod: agreeing, confirming, or acknowledging something',
      '- think: considering a question, pondering, or working through a problem',
      '- celebrate: task completed successfully, good news, or congratulations',
      '- shake: disagreeing, saying no, or indicating something is wrong',
      '- spin: when the user asks you to spin or do a twirl',
      '- idle: return to default resting pose',
      'When in doubt, use "speak". Use specific animations only for strong emotional moments.',
    ].join('\n'),
    schema: z.object({
      animation: z
        .enum(['idle', 'speak', 'wave', 'nod', 'think', 'celebrate', 'shake', 'spin'])
        .describe('The animation to play on the 3D avatar'),
    }),
    execute: async ({ animation }) => ({ triggered: animation, status: 'playing' }),
    internal: true,
  });
}

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginInstance;
  const config = strapi.config.get(`plugin::${PLUGIN_ID}`) as PluginConfig;

  // Register AI provider factories
  AIProvider.registerProvider('anthropic', ({ apiKey, baseURL }) => {
    const provider = createAnthropic({ apiKey, baseURL });
    return (modelId: string) => provider(modelId);
  });

  // Initialize AI provider
  const aiProvider = new AIProvider();
  const initialized = aiProvider.initialize(config);
  if (!initialized) {
    strapi.log.warn(`[${PLUGIN_ID}] anthropicApiKey not configured, AI provider will not be available`);
  } else {
    plugin.aiProvider = aiProvider;
    strapi.log.info(`[${PLUGIN_ID}] AI provider initialized with model: ${aiProvider.getChatModel()}`);
  }

  // Initialize tool registry with built-in tools
  const toolRegistry = new ToolRegistry();
  registerBuiltInTools(toolRegistry);
  plugin.toolRegistry = toolRegistry;

  // Store the MCP server factory and session map on the plugin instance
  plugin.createMcpServer = () => createMcpServer(strapi);
  plugin.mcpSessions = new Map();

  // Initialize TTS registry and provider if configured
  const ttsRegistry = createTTSRegistry();
  plugin.ttsRegistry = ttsRegistry;

  if (config.typecastApiKey && config.typecastActorId) {
    plugin.ttsProvider = ttsRegistry.create('typecast', {
      apiKey: config.typecastApiKey,
      actorId: config.typecastActorId,
    });
    strapi.log.info(`[${PLUGIN_ID}] TTS provider initialized (typecast)`);
  }

  strapi.log.info(`[${PLUGIN_ID}] MCP endpoint available at: /api/${PLUGIN_ID}/mcp`);
};

export default bootstrap;
