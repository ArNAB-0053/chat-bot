import { createConversation, getConversation, getConversations } from '$lib/api/conversation';
import type { ConversationDetails, ConversationSummary } from '$lib/types/conversation';
import type { Message } from '$lib/types/message';

import { isRecord, readArray, readOptionalString, readString } from './utils';

// helper fns
function normalizeMessage(value: unknown): Message {
	if (!isRecord(value)) {
		throw new Error('Invalid conversation message');
	}

	const role = readString(value.role, 'message role');

	if (role !== 'user' && role !== 'assistant') {
		throw new Error('Invalid message role');
	}

	return {
		id: readString(value.id, 'message id'),
		role,
		content: readString(value.content, 'message content'),
		createdAt: readString(value.createdAt, 'message createdAt'),
	};
}

function normalizeConversationSummary(value: unknown): ConversationSummary {
	if (!isRecord(value)) {
		throw new Error('Invalid conversation');
	}

	return {
		id: readString(value.id, 'conversation id'),
		title: readString(value.title, 'conversation title'),
		createdAt: readString(value.createdAt, 'conversation createdAt'),
		updatedAt: readString(value.updatedAt, 'conversation updatedAt'),
	};
}

function normalizeConversationDetails(value: unknown): ConversationDetails {
	if (!isRecord(value)) {
		throw new Error('Invalid conversation');
	}

	const summary = normalizeConversationSummary(value);

	return {
		...summary,
		sessionId: readOptionalString(value.sessionId),
		messages: readArray(value.messages, 'conversation messages', normalizeMessage),
	};
}

// actual service fns
export async function getConversationsService(): Promise<ConversationSummary[]> {
	const response = await getConversations();
	return readArray(response.conversations, 'conversations', normalizeConversationSummary);
}

export async function getConversationService(conversationId: string): Promise<ConversationDetails> {
	const response = await getConversation(conversationId);
	return normalizeConversationDetails(response.conversation);
}

export async function createConversationService(data?: { title?: string }): Promise<ConversationSummary> {
	const response = await createConversation(data ? { title: data.title } : {});
	return normalizeConversationSummary(response.conversation);
}
