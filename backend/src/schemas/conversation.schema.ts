import { z } from 'zod';

export const conversationParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createConversationBodySchema = z.object({
  title: z.string().optional(),
});

export type ConversationParamsSchema = typeof conversationParamsSchema;
export type CreateConversationBodySchema = typeof createConversationBodySchema;
