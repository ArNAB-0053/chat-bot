export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessage {
  id: string;
  role: 'system' | 'user' | 'assistant' | string;
  content: string;
  createdAt: Date;
  conversationId: string;
}

export interface ConversationDetails extends ConversationSummary {
  sessionId: string;
  messages: ConversationMessage[];
}

export interface CreateConversationRequestBody {
  title?: string;
}

export interface ConversationParams {
  id: string;
}
