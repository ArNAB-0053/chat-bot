import type { FastifyInstance } from 'fastify';

import { SUCCESS_MESSAGES } from '../constants/success-messages.js';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async (_request, reply) => {
    return reply.code(200).send({
      success: true,
      message: SUCCESS_MESSAGES.HEALTH_OK,
      data: {
        status: 'ok',
      },
    });
  });
}
