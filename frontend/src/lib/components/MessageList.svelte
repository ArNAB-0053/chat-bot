<script lang="ts">
  import { useGetConversation } from "$lib/queries/conversation";
  import { conversationStore } from "$lib/stores/conversation.store.svelte";
  import EmptyConversation from "./EmptyConversation.svelte";
  import MessageItem from "./MessageItem.svelte";
  import { tick } from "svelte";

  type Props = {
    conversationId: string | null;
  };

  let { conversationId }: Props = $props();

  let messagesContainer: HTMLElement;

  const conversationQuery = useGetConversation(() => conversationId);

  // Seed store from server on first load only
  $effect(() => {
    if (
      conversationId &&
      conversationQuery.data &&
      !conversationStore.peekConversation(conversationId)?.isInitialized
    ) {
      conversationStore.initializeConversation(
        conversationId,
        conversationQuery.data.messages,
      );
    }
  });

  $effect(() => {
    messages.length;
    conversationId;

    tick().then(() => {
      messagesContainer?.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "auto",
      });
    });
  });

  // Only ever read from the store
  const localState = $derived(
    conversationId ? conversationStore.peekConversation(conversationId) : null,
  );
  const messages = $derived(localState?.messages ?? []);
  const isInitialized = $derived(localState?.isInitialized ?? false);
</script>

<section
  bind:this={messagesContainer}
  class="min-h-0 flex-1 overflow-y-auto"
  aria-label="Messages"
>
  <div
    class="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8"
  >
    {#if !conversationId}
      <div
        class="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground"
      >
        Select a conversation from the sidebar or create a new one to begin.
      </div>
    {:else if !isInitialized}
      <div class="space-y-4">
        <div class="h-16 w-[70%] animate-pulse rounded-2xl bg-muted"></div>
        <div
          class="ml-auto h-16 w-[72%] animate-pulse rounded-2xl bg-muted"
        ></div>
        <div class="h-16 w-[68%] animate-pulse rounded-2xl bg-muted"></div>
      </div>
    {:else if conversationQuery.isError}
      <div
        class="rounded-2xl border border-dashed border-destructive/50 p-6 text-sm text-destructive"
      >
        Unable to load the current conversation.
      </div>
    {:else if messages.length === 0}
      <div class="flex items-center justify-center mt-14">
        <EmptyConversation />
      </div>
    {:else}
      {#each messages as message (message.id)}
        <MessageItem
          role={message.role}
          content={message.content}
          status={message.status}
        />
      {/each}
    {/if}
  </div>
</section>
