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
  ],
};
