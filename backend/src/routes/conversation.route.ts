import type { FastifyInstance } from 'fastify';

import {
  createConversationController,
  getConversationController,
  getConversationsController,
} from '../controllers/conversation.controller.js';

export async function conversationRoutes(app: FastifyInstance): Promise<void> {
  app.get('/conversations', getConversationsController);
  app.get('/conversations/:id', getConversationController);
  app.post('/conversations', createConversationController);
}
