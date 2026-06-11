import { ERROR_MESSAGES } from '../constants/error-messages.js';
import { createSession, findSession, type SessionRecord } from '../repositories/session.repository.js';
import { generateSessionId } from '../utils/generateSessionId.js';

export async function ensureSession(sessionId: string | undefined): Promise<SessionRecord> {
  const resolvedSessionId = sessionId?.trim() || generateSessionId();

  try {
    const existingSession = await findSession(resolvedSessionId);

    if (existingSession) {
      return existingSession;
    }

    return await createSession(resolvedSessionId);
  } catch (error) {
    console.error('[SessionService] Failed to ensure session', {
      sessionId: resolvedSessionId,
      error,
    });
    throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
