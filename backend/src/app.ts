import Fastify from 'fastify';

import { ERROR_MESSAGES } from './constants/error-messages.js';
import { registerCookiePlugin } from './plugins/cookie.js';
import { sessionMiddleware } from './middleware/session.middleware.js';
import { chatRoutes } from './routes/chat.route.js';
import { conversationRoutes } from './routes/conversation.route.js';
import { healthRoutes } from './routes/health.route.js';
import { registerCorsPlugin } from './plugins/cors.js';

export const app = Fastify({
  logger: true,
});

app.setErrorHandler((error, request, reply) => {
  request.log.error(
    {
      error,
    },
    'Unhandled application error',
  );

  if (reply.sent) {
    return;
  }

  reply.code(500).send({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
});

app.register(registerCorsPlugin);
app.register(registerCookiePlugin);

app.after(() => {
  app.addHook('onRequest', sessionMiddleware);
});

app.register(healthRoutes);
app.register(conversationRoutes);
app.register(chatRoutes);
