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
    {
      method: 'GET',
      path: '/conversations',
      handler: 'conversation.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/conversations/:id',
      handler: 'conversation.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/conversations',
      handler: 'conversation.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/conversations/:id',
      handler: 'conversation.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/conversations/:id',
      handler: 'conversation.delete',
      config: { policies: [] },
    },
  ],
};
