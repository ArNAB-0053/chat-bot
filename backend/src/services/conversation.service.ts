import { ERROR_MESSAGES } from '../constants/error-messages.js';
import {
  createConversation as createConversationRecord,
  getConversationById,
  getConversationsBySession,
} from '../repositories/conversation.repository.js';
import { getMessages } from '../repositories/message.repository.js';
import type { ConversationDetails, ConversationSummary } from '../types/conversation.js';

export async function createConversation(
  sessionId: string,
  title?: string,
): Promise<ConversationSummary> {
  const resolvedTitle = title?.trim() || 'New conversation';

  try {
    return await createConversationRecord(sessionId, resolvedTitle);
  } catch (error) {
    console.error('[ConversationService] Failed to create conversation', {
      sessionId,
      title: resolvedTitle,
      error,
    });
    throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function getConversation(
  conversationId: string,
  sessionId: string,
): Promise<ConversationDetails | null> {
  try {
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return null;
    }

    if (conversation.sessionId !== sessionId) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }

    const messages = await getMessages(conversationId);

    return {
      ...conversation,
      messages,
    };
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_MESSAGES.UNAUTHORIZED_ACCESS) {
      throw error;
    }

    console.error('[ConversationService] Failed to fetch conversation', {
      conversationId,
      sessionId,
      error,
    });
    throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

export async function getConversations(sessionId: string): Promise<ConversationSummary[]> {
  try {
    return await getConversationsBySession(sessionId);
  } catch (error) {
    console.error('[ConversationService] Failed to fetch conversations', {
      sessionId,
      error,
    });
    throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
