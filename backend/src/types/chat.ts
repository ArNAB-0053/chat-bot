export interface ChatRequestBody {
  conversationId: string;
  message: string;
}

export interface ChatMessageResponse {
  id: string;
  role: 'assistant';
  content: string;
}

export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
