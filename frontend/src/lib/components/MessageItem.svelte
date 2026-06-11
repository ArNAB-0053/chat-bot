<script lang="ts">
	import type { MessageRole } from '$lib/types/message';

	type Props = {
		role: MessageRole;
		content: string;
	};

	let { role, content }: Props = $props();
	const isUser = $derived(role === 'user');
</script>

<article class="flex w-full" class:justify-end={isUser} class:justify-start={!isUser}>
	<div
		class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%]"
		class:rounded-br-sm={isUser}
		class:bg-primary={isUser}
		class:text-primary-foreground={isUser}
		class:rounded-bl-sm={!isUser}
		class:bg-muted={!isUser}
		class:text-foreground={!isUser}
	>
		<p class="whitespace-pre-wrap">{content}</p>
	</div>
</article>
