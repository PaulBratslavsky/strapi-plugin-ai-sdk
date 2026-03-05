import type { Core } from '@strapi/strapi';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMcpServer } from './mcp/server';
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

  // Discover tools from other plugins
  const pluginNames = Object.keys(strapi.plugins).filter((n) => n !== PLUGIN_ID);
  strapi.log.info(`[${PLUGIN_ID}] Scanning ${pluginNames.length} plugins for ai-tools: [${pluginNames.join(', ')}]`);

  for (const [pluginName, pluginInstance] of Object.entries(strapi.plugins)) {
    if (pluginName === PLUGIN_ID) continue;

    try {
      // Try both plugin.service() and strapi.service() patterns
      let aiToolsService: any = null;
      try {
        aiToolsService = strapi.plugin(pluginName)?.service?.('ai-tools');
      } catch {
        // Plugin may not support service() yet
      }
      if (!aiToolsService) {
        try {
          aiToolsService = (pluginInstance as any).service?.('ai-tools');
        } catch {
          // Fallback also failed
        }
      }

      if (!aiToolsService?.getTools) {
        strapi.log.debug(`[${PLUGIN_ID}] No ai-tools service on plugin: ${pluginName}`);
        continue;
      }

      strapi.log.info(`[${PLUGIN_ID}] Found ai-tools service on plugin: ${pluginName}`);

      const contributed = aiToolsService.getTools();
      if (!Array.isArray(contributed)) continue;

      let count = 0;
      for (const tool of contributed) {
        if (!tool.name || !tool.execute || !tool.schema) {
          strapi.log.warn(`[${PLUGIN_ID}] Invalid tool from ${pluginName}: ${tool.name || 'unnamed'}`);
          continue;
        }

        // API tool names only allow [a-zA-Z0-9_-], so use double-underscore as namespace separator
        const safeName = pluginName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const namespacedName = `${safeName}__${tool.name}`;
        if (toolRegistry.has(namespacedName)) {
          strapi.log.warn(`[${PLUGIN_ID}] Duplicate tool: ${namespacedName}`);
          continue;
        }

        toolRegistry.register({ ...tool, name: namespacedName });
        count++;
      }

      if (count > 0) {
        strapi.log.info(`[${PLUGIN_ID}] Registered ${count} tools from plugin: ${pluginName}`);
      }
    } catch (err) {
      strapi.log.warn(`[${PLUGIN_ID}] Tool discovery failed for ${pluginName}: ${err}`);
    }
  }

  // Store the MCP server factory and session map on the plugin instance
  plugin.createMcpServer = () => createMcpServer(strapi);
  plugin.mcpSessions = new Map();

  strapi.log.info(`[${PLUGIN_ID}] MCP endpoint available at: /api/${PLUGIN_ID}/mcp`);
};

export default bootstrap;
