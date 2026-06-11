<script lang="ts">
	import { useGetConversation } from '$lib/queries/conversation';
	import MessageItem from './MessageItem.svelte';

	type Props = {
		conversationId: string | null;
	};

	let { conversationId }: Props = $props();
	const conversationQuery = useGetConversation(() => conversationId);
</script>

<section class="min-h-0 flex-1 overflow-y-auto" aria-label="Messages">
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
		{#if !conversationId}
			<div class="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
				Select a conversation from the sidebar or create a new one to begin.
			</div>
		{:else if conversationQuery.isLoading}
			<div class="space-y-4">
				<div class="h-16 w-[70%] animate-pulse rounded-2xl bg-muted"></div>
				<div class="ml-auto h-16 w-[72%] animate-pulse rounded-2xl bg-muted"></div>
				<div class="h-16 w-[68%] animate-pulse rounded-2xl bg-muted"></div>
			</div>
		{:else if conversationQuery.isError}
			<div class="rounded-2xl border border-dashed border-destructive/50 p-6 text-sm text-destructive">
				Unable to load the current conversation.
			</div>
		{:else if !conversationQuery.data?.messages.length}
			<div class="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
				This conversation is empty. Send the first message to get started.
			</div>
		{:else}
			{#each conversationQuery.data.messages as message (message.id)}
				<MessageItem role={message.role} content={message.content} />
			{/each}
		{/if}
	</div>
</section>
