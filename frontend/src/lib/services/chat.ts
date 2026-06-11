import { sendMessage } from '$lib/api/chat';
import type { Message } from '$lib/types/message';

import { isRecord, readString } from './utils';

export interface SendMessageInput {
	conversationId: string;
	message: string;
}

// helper fns
function normalizeMessage(value: unknown): Message {
	if (!isRecord(value)) {
		throw new Error('Invalid message');
	}

	const role = readString(value.role, 'message role');

	if (role !== 'assistant' && role !== 'user') {
		throw new Error('Invalid message role');
	}

	return {
		id: readString(value.id, 'message id'),
		role,
		content: readString(value.content, 'message content'),
		createdAt: new Date().toISOString(),
		status: 'completed',
	};
}

// actual service fns
export async function sendMessageService(input: SendMessageInput): Promise<Message> {
	const response = await sendMessage({
		conversationId: readString(input.conversationId, 'conversation id'),
		message: readString(input.message, 'message'),
	});

	return normalizeMessage(response.message);
}
