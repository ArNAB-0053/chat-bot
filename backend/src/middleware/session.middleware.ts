import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '../config/env.js';
import { ERROR_MESSAGES } from '../constants/error-messages.js';
import { SUCCESS_MESSAGES } from '../constants/success-messages.js';
import { ensureSession } from '../services/session.service.js';
import { generateSessionId } from '../utils/generateSessionId.js';
import { CookieSerializeOptions } from '@fastify/cookie';

const SESSION_COOKIE_NAME = 'chat_session';
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const sessionCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
};

export async function sessionMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const cookieSessionId = request.cookies?.[SESSION_COOKIE_NAME]?.trim();
    const sessionId = cookieSessionId || generateSessionId();
    const session = await ensureSession(sessionId);

    request.sessionId = session.id;

    if (!cookieSessionId) {
      reply.setCookie(SESSION_COOKIE_NAME, session.id, sessionCookieOptions);
      request.log.info(
      {
        sessionId: session.id,
        statusMessage: SUCCESS_MESSAGES.SESSION_CREATED,
      },
      'Session created for request',
    );
    }
  } catch (error) {
    request.log.error(
      {
        error,
        message: ERROR_MESSAGES.SESSION_NOT_FOUND,
      },
      'Failed to resolve request session',
    );
    throw error;
  }
}
