import { z } from 'zod';

export const chatBodySchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string(),
});

export type ChatBodySchema = typeof chatBodySchema;
