import { createMutation, useQueryClient } from '@tanstack/svelte-query';

import { sendMessageService, type SendMessageInput } from '$lib/services/chat';

export function useSendMessage() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: sendMessageService,
		onSuccess: async (_message, variables: SendMessageInput) => {
			await queryClient.invalidateQueries({ queryKey: ['conversations'] });

			if (variables.conversationId) {
				await queryClient.invalidateQueries({
					queryKey: ['conversations', variables.conversationId],
				});
			}
		},
	}));
}
