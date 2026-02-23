import type { Core } from '@strapi/strapi';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMcpServer } from './mcp/server';
import { createTTSRegistry } from './lib/tts';
import { AIProvider } from './lib/ai-provider';
import { ToolRegistry } from './lib/tool-registry';
import { builtInTools } from './tools/definitions';
import type { PluginConfig, PluginInstance } from './lib/types';

const PLUGIN_ID = 'ai-sdk';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginInstance;
  const config = strapi.config.get<PluginConfig>(`plugin::${PLUGIN_ID}`);

  // Register AI provider factories
  AIProvider.registerProvider('anthropic', ({ apiKey, baseURL }) => {
    const provider = createAnthropic({ apiKey, baseURL });
    return (modelId: string) => provider(modelId);
  });

  // Initialize AI provider
  const aiProvider = new AIProvider();
  const initialized = aiProvider.initialize(config);

  if (initialized) {
    plugin.aiProvider = aiProvider;
    strapi.log.info(`[${PLUGIN_ID}] AI provider initialized with model: ${aiProvider.getChatModel()}`);
  } else {
    strapi.log.warn(`[${PLUGIN_ID}] anthropicApiKey not configured, AI provider will not be available`);
  }

  // Initialize tool registry with built-in tools
  const toolRegistry = new ToolRegistry();
  for (const tool of builtInTools) {
    toolRegistry.register(tool);
  }
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
