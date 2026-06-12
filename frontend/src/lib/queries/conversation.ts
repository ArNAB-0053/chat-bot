import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

import {
	createConversationService,
	getConversationService,
	getConversationsService,
} from '$lib/services/conversation';

export function useGetConversations() {
	return createQuery(() => ({
		queryKey: ['conversations'],
		queryFn: getConversationsService,
		staleTime: 15_000,
		refetchOnWindowFocus: false,
	}));
}

export function useGetConversation(conversationId: () => string | null) {
	return createQuery(
		() => {
			const resolvedConversationId = conversationId();

			return {
				queryKey: ['conversations', resolvedConversationId],
				queryFn: () => getConversationService(resolvedConversationId ?? ''),
				enabled: Boolean(resolvedConversationId),
				staleTime: 10_000,
				refetchOnWindowFocus: false,
			};
		},
	);
}

export function useCreateConversation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (data?: { title?: string }) => createConversationService(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['conversations'] });
		},
	}));
}
