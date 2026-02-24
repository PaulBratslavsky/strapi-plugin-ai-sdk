export default {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/chat',
      handler: 'controller.chat',
      config: {
        policies: [],
        middlewares: ['plugin::ai-sdk.guardrail'],
      },
    },
    {
      method: 'POST',
      path: '/tts',
      handler: 'controller.tts',
      config: {
        policies: [],
      },
    },
  ],
};
