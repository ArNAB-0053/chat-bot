export interface ApiResponse<TData> {
	success: boolean;
	message: string;
	data: TData;
}

export interface ApiErrorResponse {
	success: false;
	message: string;
}

export interface ConversationsPayload {
	conversations: unknown[];
}

export interface ConversationPayload {
	conversation: unknown;
}

export interface MessagePayload {
	message: unknown;
}
