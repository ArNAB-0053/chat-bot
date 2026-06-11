import type { Conversation } from './conversation';

export interface ConversationState {
	currentConversationId: string | null;
	conversations: Record<string, Conversation>;
}
