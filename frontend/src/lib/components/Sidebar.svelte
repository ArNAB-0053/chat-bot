<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    useCreateConversation,
    useGetConversations,
  } from "$lib/queries/conversation";
  import { cn } from "$lib/utils";
  import Loader from "./Loader.svelte";
  import CreateConversationDialog from "./CreateConversationDialog.svelte";
  import { MessageCircle, Plus, PanelRight } from "lucide-svelte";

  type Props = {
    collapsed?: boolean;
    mobile?: boolean;
    onToggle?: () => void;
  };

  let { collapsed = false, mobile = false, onToggle }: Props = $props();

  const selectedConversationId = $derived(page.params.conversationId ?? null);

  const conversationsQuery = useGetConversations();
  const createConversationMutation = useCreateConversation();

  let autoSelectedFirstConversation = $state(false);
  let createDialogOpen = $state(false);

  $effect(() => {
    const conversations = conversationsQuery.data ?? [];

    if (selectedConversationId || conversations.length === 0) {
      autoSelectedFirstConversation = false;
      return;
    }

    if (!autoSelectedFirstConversation) {
      autoSelectedFirstConversation = true;
      goto(`/c/${conversations[0].id}`);
    }
  });

  function handleSelectConversation(conversationId: string) {
    goto(`/c/${conversationId}`);
    if (mobile) onToggle?.();
  }

  function handleCreateConversation(title: string) {
    createConversationMutation.mutate(
      { title },
      {
        onSuccess: (conversation) => {
          createDialogOpen = false;
          goto(`/c/${conversation.id}`);
        },
      },
    );
    if (mobile) onToggle?.();
  }
</script>

<aside
  class="flex h-full flex-col border-r bg-sidebar text-sidebar-foreground"
  class:w-72={!collapsed || mobile}
  class:w-16={collapsed && !mobile}
>
  <div class="flex h-16 shrink-0 items-center gap-3 border-b px-3">
    {#if collapsed && !mobile}
      <Button
        variant="ghost"
        size="icon"
        onclick={onToggle}
        class="group w-full"
      >
        <div
          class={cn(
            "flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:hidden",
            collapsed && "w-full",
          )}
        >
          <MessageCircle class="size-5" />
        </div>

        <PanelRight class="hidden size-4 group-hover:block" />
      </Button>
    {:else}
      <div
        class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <MessageCircle class="size-5" />
      </div>
    {/if}

    {#if !collapsed}
      <div class="min-w-0 flex-1">
        <p
          class="text-xs font-bold uppercase tracking-widest text-muted-foreground title"
        >
          Helio
        </p>
        <p class="truncate text-xs text-muted-foreground">
          Fast, contextual customer support
        </p>
      </div>
    {/if}

    {#if !collapsed}
      <Button
        variant="ghost"
        size="icon"
        onclick={onToggle}
        aria-label="Collapse sidebar"
      >
        <PanelRight class="size-4" />
      </Button>
    {/if}
  </div>

  <div class="shrink-0 p-3">
    <Button
      class={cn(
        collapsed && !mobile ? "w-full px-0" : "w-full",
        "rounded-md",
        "py-5",
      )}
      onclick={() => (createDialogOpen = true)}
    >
      <Plus class="size-4" />
      {#if !collapsed || mobile}
        <span class="text-sm tracking-wide"
          >{createConversationMutation.isPending
            ? "Creating..."
            : "New Chat"}</span
        >
      {/if}
    </Button>
  </div>

  {#if !collapsed}
    <div class="flex min-h-0 flex-1 flex-col pl-2 ">
      <p class="px-2 py-2 text-xs font-medium text-muted-foreground">
        Recent conversations
      </p>

      <nav
        class="min-h-0 flex-1 overflow-y-auto pb-3"
        aria-label="Conversations"
      >
        <div class="space-y-1">
          {#if conversationsQuery.isLoading}
            <Loader />
          {:else if conversationsQuery.isError}
            <p class="px-2 py-2 text-sm text-destructive">
              Unable to load conversations.
            </p>
          {:else if !conversationsQuery.data?.length}
            <p class="px-2 py-2 text-sm text-muted-foreground">
              Start a new conversation to get going.
            </p>
          {:else}
            {#each conversationsQuery.data as conversation, index}
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                class:bg-sidebar-accent={conversation.id ===
                  selectedConversationId ||
                  (index === 0 && !selectedConversationId)}
                class:text-sidebar-accent-foreground={conversation.id ===
                  selectedConversationId ||
                  (index === 0 && !selectedConversationId)}
                class:justify-center={collapsed && !mobile}
                aria-current={conversation.id === selectedConversationId
                  ? "page"
                  : undefined}
                title={collapsed && !mobile ? conversation.title : undefined}
                onclick={() => handleSelectConversation(conversation.id)}
              >
                <!-- <MessageCircle class="size-4 shrink-0" /> -->
                <span class="truncate">{conversation.title}</span>
              </button>
            {/each}
          {/if}
        </div>
      </nav>
    </div>
  {/if}

  <CreateConversationDialog
    bind:open={createDialogOpen}
    isPending={createConversationMutation.isPending}
    onSubmit={(title) => handleCreateConversation(title)}
  />
</aside>
