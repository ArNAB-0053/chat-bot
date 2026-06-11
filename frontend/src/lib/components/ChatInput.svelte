<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { useSendMessage } from '$lib/queries/chat';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTilt';

	type Props = {
		conversationId: string | null;
	};

	let { conversationId }: Props = $props();

	let message = $state('');
	const sendMessageMutation = useSendMessage();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!conversationId || !message.trim() || sendMessageMutation.isPending) {
			return;
		}

		const currentMessage = message;
		message = '';

		try {
			await sendMessageMutation.mutateAsync({
				conversationId,
				message: currentMessage,
			});
		} catch (error) {
			message = currentMessage;
		}
	}
</script>

<form class="shrink-0 border-t bg-background p-3 sm:p-4" onsubmit={handleSubmit}>
	<div class="mx-auto flex w-full max-w-3xl items-end gap-2">
		<Textarea
			aria-label="Message"
			placeholder="Type your message..."
			rows={1}
			class="max-h-36 min-h-11 resize-none rounded-lg py-3 text-sm"
			bind:value={message}
			disabled={!conversationId || sendMessageMutation.isPending}
		/>
		<Button
			type="submit"
			size="icon-lg"
			class="shrink-0 rounded-lg"
			aria-label="Send message"
			disabled={!conversationId || !message.trim() || sendMessageMutation.isPending}
		>
			<PaperPlaneTiltIcon class="size-4" weight="fill" />
		</Button>
	</div>
	<p class="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
		{#if conversationId}
			AI responses may contain mistakes.
		{:else}
			Create or select a conversation before sending a message.
		{/if}
	</p>
</form>
