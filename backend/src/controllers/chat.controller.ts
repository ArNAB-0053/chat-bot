import type { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_MESSAGES } from '../constants/error-messages.js';
import { SUCCESS_MESSAGES } from '../constants/success-messages.js';
import { chatBodySchema } from '../schemas/chat.schema.js';
import { sendMessage } from '../services/chat.service.js';
import type { ChatRequestBody } from '../types/chat.js';

function sendInternalError(reply: FastifyReply): FastifyReply {
  return reply.code(500).send({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
}

export async function chatController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  try {
    const bodyResult = chatBodySchema.safeParse((request.body ?? {}) as ChatRequestBody);

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

    const message = bodyResult.data.message.trim();

    if (!message) {
      return reply.code(400).send({
        success: false,
        message: ERROR_MESSAGES.MESSAGE_REQUIRED,
      });
    }

    const assistantMessage = await sendMessage(sessionId, bodyResult.data.conversationId, message);

    if (!assistantMessage) {
      return reply.code(404).send({
        success: false,
        message: ERROR_MESSAGES.CONVERSATION_NOT_FOUND,
      });
    }

    return reply.code(200).send({
      success: true,
      message: SUCCESS_MESSAGES.MESSAGE_SENT,
      data: {
        message: assistantMessage,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.UNAUTHORIZED_ACCESS) {
        return reply.code(403).send({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
      }

      if (error.message === ERROR_MESSAGES.OPENAI_RESPONSE_FAILED) {
        return reply.code(502).send({
          success: false,
          message: ERROR_MESSAGES.OPENAI_RESPONSE_FAILED,
        });
      }
    }

    request.log.error({ error }, 'Failed to send chat message');
    return sendInternalError(reply);
  }
}
