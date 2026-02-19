export default {
  default: {
    anthropicApiKey: '',
    chatModel: 'claude-sonnet-4-20250514',
    baseURL: undefined,
    systemPrompt: '',
  },
  validator(config: unknown) {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Config must be an object');
    }
  },
};
