export default {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/chat',
      handler: 'controller.chat',
      config: {
        policies: [],
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
