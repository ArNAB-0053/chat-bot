import type { FastifyInstance } from 'fastify';

import { chatController } from '../controllers/chat.controller.js';

export async function chatRoutes(app: FastifyInstance): Promise<void> {
  app.post('/chat', chatController);
}
