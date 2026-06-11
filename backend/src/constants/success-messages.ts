export const SUCCESS_MESSAGES = {
  CONVERSATION_CREATED: 'Conversation created',
  CONVERSATION_FETCHED: 'Conversation fetched',
  MESSAGE_SENT: 'Message sent',
  SESSION_CREATED: 'Session created',
  CONVERSATIONS_FETCHED: 'Conversations fetched',
  HEALTH_OK: 'OK',
} as const;

export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
