export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Something went wrong',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  SESSION_NOT_FOUND: 'Session not found',
  INVALID_REQUEST_BODY: 'Invalid request body',
  INVALID_ROUTE_PARAMS: 'Invalid route params',
  OPENAI_RESPONSE_FAILED: 'OpenAI response failed',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  MESSAGE_REQUIRED: 'Message is required',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
