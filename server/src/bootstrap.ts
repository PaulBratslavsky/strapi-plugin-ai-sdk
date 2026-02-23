import type { Core } from '@strapi/strapi';
import { createMcpServer } from './mcp/server';
import { createTTSProvider } from './lib/tts';
import { AIProvider } from './lib/ai-provider';
import type { PluginConfig, PluginInstance } from './lib/types';

const PLUGIN_ID = 'ai-sdk';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginInstance;
  const config = strapi.config.get(`plugin::${PLUGIN_ID}`) as PluginConfig;

  // Initialize AI provider
  const aiProvider = new AIProvider();
  const initialized = aiProvider.initialize(config);
  if (!initialized) {
    strapi.log.warn(`[${PLUGIN_ID}] anthropicApiKey not configured, AI provider will not be available`);
  } else {
    plugin.aiProvider = aiProvider;
    strapi.log.info(`[${PLUGIN_ID}] AI provider initialized with model: ${aiProvider.getChatModel()}`);
  }

  // Store the MCP server factory and session map on the plugin instance
  plugin.createMcpServer = () => createMcpServer(strapi);
  plugin.mcpSessions = new Map();

  // Initialize TTS provider if configured
  if (config.typecastApiKey && config.typecastActorId) {
    plugin.ttsProvider = createTTSProvider({
      provider: 'typecast',
      apiKey: config.typecastApiKey,
      actorId: config.typecastActorId,
    });
    strapi.log.info(`[${PLUGIN_ID}] TTS provider initialized (typecast)`);
  }

  strapi.log.info(`[${PLUGIN_ID}] MCP endpoint available at: /api/${PLUGIN_ID}/mcp`);
};

export default bootstrap;
