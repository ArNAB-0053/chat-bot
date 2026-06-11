export type MessageRole = 'user' | 'assistant';

export type MessageStatus = 'sending' | 'streaming' | 'sent' | 'error';
export interface ConversationMessage {
	id: string;
	role: MessageRole;
	content: string;
	status: MessageStatus;
}

export interface Message {
	id: string;
	role: MessageRole;
	content: string;
	createdAt: string;
	status?: 'streaming' | 'completed' | 'error';
}