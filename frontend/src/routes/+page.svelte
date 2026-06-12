<script lang="ts">
  import { goto } from '$app/navigation';
  import { useCreateConversation, useGetConversations } from '$lib/queries/conversation';
  import ChatCircleIcon from 'phosphor-svelte/lib/ChatCircle';
  import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRight';

  const conversationsQuery = useGetConversations();
  const createConversationMutation = useCreateConversation();

  function handleStart() {
    const existing = conversationsQuery.data ?? [];

    if (existing.length > 0) {
      goto(`/c/${existing[0].id}`);
      return;
    }

    createConversationMutation.mutate(undefined, {
      onSuccess: (conversation) => {
        goto(`/c/${conversation.id}`);
      },
    });
  }
</script>

<div class="flex h-dvh w-full flex-col items-center justify-center gap-8 px-4">
  <div class="flex flex-col items-center gap-4 text-center">
    <div class="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
      <ChatCircleIcon class="size-6" weight="fill" />
    </div>

    <div>
      <h1 class="text-3xl font-semibold tracking-tight md:text-4xl">Helio</h1>
      <p class="mt-2 text-sm text-muted-foreground">Fast, contextual customer support</p>
    </div>
  </div>

  <button
    onclick={handleStart}
    disabled={createConversationMutation.isPending || conversationsQuery.isLoading}
    class="group flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
  >
    {conversationsQuery.isLoading ? 'Loading…' : createConversationMutation.isPending ? 'Starting…' : 'Start a conversation'}
    <ArrowRightIcon class="size-4 transition-transform group-hover:translate-x-0.5" />
  </button>
</div>