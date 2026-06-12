<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { useGetConversation } from "$lib/queries/conversation";
  import ChatInput from "./ChatInput.svelte";
  import MessageList from "./MessageList.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { TextAlignJustify } from "lucide-svelte";

  let sidebarCollapsed = $state(false);
  let mobileSidebarOpen = $state(false);

  const selectedConversationId = $derived(page.params.conversationId ?? null);

  const conversationQuery = useGetConversation(() => selectedConversationId);

  const conversationTitle = $derived(
    conversationQuery.data?.title ?? "New conversation",
  );

  $effect(() => {
    if (conversationQuery.isError) {
      goto("/");
    }
  });
</script>

<div class="flex h-dvh w-full overflow-hidden bg-background">
  <div
    class="hidden h-full shrink-0 transition-[width] duration-200 lg:block"
    class:w-72={!sidebarCollapsed}
    class:w-16={sidebarCollapsed}
  >
    <Sidebar
      collapsed={sidebarCollapsed}
      onToggle={() => (sidebarCollapsed = !sidebarCollapsed)}
    />
  </div>

  <Sheet.Root bind:open={mobileSidebarOpen}>
    <Sheet.Content
      side="left"
      class="max-w-72! w-72! bg-black [&>button]:hidden p-0 flex flex-col"
    >
      <Sheet.Title class="sr-only">Conversation sidebar</Sheet.Title>
      <Sheet.Description class="sr-only">
        Start a new chat or choose a recent conversation.
      </Sheet.Description>
      <Sidebar mobile onToggle={() => (mobileSidebarOpen = false)} />
    </Sheet.Content>
  </Sheet.Root>

  <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
    <header class="flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        class="lg:hidden"
        aria-label="Open conversation sidebar"
        onclick={() => (mobileSidebarOpen = true)}
      >
        <TextAlignJustify class="size-5" />
      </Button>

      <div class="min-w-0">
        <h1 class="truncate text-sm font-semibold sm:text-base">
          {conversationTitle}
        </h1>
      </div>
    </header>

    <MessageList conversationId={selectedConversationId} />
    <ChatInput conversationId={selectedConversationId} />
  </main>
</div>
