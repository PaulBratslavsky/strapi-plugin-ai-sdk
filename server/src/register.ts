import type { Core } from '@strapi/strapi';
import { aiSDKManager } from './lib/init-ai-sdk';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  const config = strapi.config.get('plugin::ai-sdk');
  const initialized = aiSDKManager.initialize(config);

  if (!initialized) {
    strapi.log.warn('AI SDK plugin: anthropicApiKey not configured, plugin will not be initialized');
    return;
  }

  strapi.log.info(`AI SDK plugin initialized with model: ${aiSDKManager.getChatModel()}`);
};

export default register;
