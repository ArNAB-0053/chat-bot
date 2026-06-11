import type { ApiResponse, MessagePayload } from '$lib/types/api';
import { env } from '$lib/utils/env';

type SendMessageRequest = {
	conversationId: string;
	message: string;
};

type FetchOptions = RequestInit & {
	json?: unknown;
};

async function requestJson<TData>(path: string, options: FetchOptions = {}): Promise<ApiResponse<TData>> {
	const { json, headers, ...rest } = options;
	const response = await fetch(path, {
		credentials: 'include',
		...rest,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: json === undefined ? rest.body : JSON.stringify(json),
	});

	const payload = (await response.json()) as ApiResponse<TData> | { message?: string };

	if (!response.ok) {
		const message = typeof payload === 'object' && payload && 'message' in payload ? payload.message : 'Request failed';
		throw new Error(message || 'Request failed');
	}

	return payload as ApiResponse<TData>;
}

export async function sendMessage(body: SendMessageRequest): Promise<MessagePayload> {
	const response = await requestJson<MessagePayload>(`${env.API_URL}/chat`, {
		method: 'POST',
		json: body,
	});

	return response.data;
}
