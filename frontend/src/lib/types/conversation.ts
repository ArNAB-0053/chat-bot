import type { Message } from './message';

export interface ConversationSummary {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
}

export interface ConversationDetails extends ConversationSummary {
	sessionId?: string;
	messages: Message[];
}

export type Conversation = ConversationDetails;
