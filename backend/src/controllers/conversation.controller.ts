import type { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_MESSAGES } from '../constants/error-messages.js';
import { SUCCESS_MESSAGES } from '../constants/success-messages.js';
import { createConversationBodySchema, conversationParamsSchema } from '../schemas/conversation.schema.js';
import { createConversation, getConversation, getConversations } from '../services/conversation.service.js';
import type { CreateConversationRequestBody, ConversationParams } from '../types/conversation.js';

function sendInternalError(reply: FastifyReply): FastifyReply {
  return reply.code(500).send({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
}

export async function getConversationsController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const sessionId = request.sessionId;

    if (!sessionId) {
      return reply.code(404).send({
        success: false,
        message: ERROR_MESSAGES.SESSION_NOT_FOUND,
      });
    }

    const conversations = await getConversations(sessionId);

    return reply.code(200).send({
      success: true,
      message: SUCCESS_MESSAGES.CONVERSATIONS_FETCHED,
      data: {
        conversations,
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to fetch conversations');
    return sendInternalError(reply);
  }
}

export async function getConversationController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const paramsResult = conversationParamsSchema.safeParse(request.params as ConversationParams);

    if (!paramsResult.success) {
      return reply.code(400).send({
        success: false,
        message: ERROR_MESSAGES.INVALID_ROUTE_PARAMS,
      });
    }

    const sessionId = request.sessionId;

    if (!sessionId) {
      return reply.code(404).send({
        success: false,
        message: ERROR_MESSAGES.SESSION_NOT_FOUND,
      });
    }

    const conversation = await getConversation(paramsResult.data.id, sessionId);

    if (!conversation) {
      return reply.code(404).send({
        success: false,
        message: ERROR_MESSAGES.CONVERSATION_NOT_FOUND,
      });
    }

    return reply.code(200).send({
      success: true,
      message: SUCCESS_MESSAGES.CONVERSATION_FETCHED,
      data: {
        conversation,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_MESSAGES.UNAUTHORIZED_ACCESS) {
      return reply.code(403).send({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
      });
    }

    request.log.error({ error }, 'Failed to fetch conversation');
    return sendInternalError(reply);
  }
}

export async function createConversationController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const bodyResult = createConversationBodySchema.safeParse(
      (request.body ?? {}) as CreateConversationRequestBody,
    );

    if (!bodyResult.success) {
      return reply.code(400).send({
        success: false,
        message: ERROR_MESSAGES.INVALID_REQUEST_BODY,
      });
    }

    const sessionId = request.sessionId;

    if (!sessionId) {
      return reply.code(404).send({
        success: false,
        message: ERROR_MESSAGES.SESSION_NOT_FOUND,
      });
    }

    const title = bodyResult.data.title?.trim();

    if (bodyResult.data.title !== undefined && !title) {
      return reply.code(400).send({
        success: false,
        message: ERROR_MESSAGES.INVALID_REQUEST_BODY,
      });
    }

    const conversation = await createConversation(sessionId, title);

    return reply.code(201).send({
      success: true,
      message: SUCCESS_MESSAGES.CONVERSATION_CREATED,
      data: {
        conversation,
      },
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to create conversation');
    return sendInternalError(reply);
  }
}
