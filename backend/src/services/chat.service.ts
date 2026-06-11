import OpenAI from 'openai';

import { env } from '../config/env.js';
import { ERROR_MESSAGES } from '../constants/error-messages.js';
import { getConversationById } from '../repositories/conversation.repository.js';
import {
  createMessage,
  getMessages,
  type MessageRecord,
} from '../repositories/message.repository.js';
import type { ChatMessageResponse } from '../types/chat.js';

let openRouterClient: OpenAI | null = null;

function getOpenRouterClient(): OpenAI {
  if (!openRouterClient) {
    openRouterClient = new OpenAI({
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  return openRouterClient;
}

function mapMessages(messages: MessageRecord[]) {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'assistant' : 'user',
    content: message.content,
  })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
}

export async function sendMessage(
  sessionId: string,
  conversationId: string,
  message: string,
): Promise<ChatMessageResponse | null> {
  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    return null;
  }

  if (conversation.sessionId !== sessionId) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  const trimmedMessage = message.trim();

  try {
    await createMessage(conversationId, 'user', trimmedMessage);

    const messages = await getMessages(conversationId);

    const response = await getOpenRouterClient().chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages: mapMessages(messages),
    });

    const assistantContent =
      response.choices[0]?.message?.content?.trim() ?? '';

    if (!assistantContent) {
      throw new Error(ERROR_MESSAGES.OPENAI_RESPONSE_FAILED);
    }

    const assistantMessage = await createMessage(
      conversationId,
      'assistant',
      assistantContent,
    );

    return {
      id: assistantMessage.id,
      role: 'assistant',
      content: assistantMessage.content,
    };
  } catch (error) {
    console.error('[ChatService] Failed to send message', {
      conversationId,
      sessionId,
      error,
    });

    throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}