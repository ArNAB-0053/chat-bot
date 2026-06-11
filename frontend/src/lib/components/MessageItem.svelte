<script lang="ts">
  import type { MessageRole, MessageStatus } from "$lib/types/message";
  import { marked } from "marked";
  import ChatLoader from "./ui/loader/chat-loader.svelte";

  type Props = {
    role: MessageRole;
    content: string;
    status?: MessageStatus;
  };

  let { role, content, status }: Props = $props();
  const isUser = $derived(role === "user");
  const isError = $derived(status === "error");
  const isSending = $derived(status === "sending");

  const html = $derived(marked(content));
</script>

<article
  class="flex w-full"
  class:justify-end={isUser}
  class:justify-start={!isUser}
>
  <div
    class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%]"
    class:rounded-br-sm={isUser}
    class:bg-primary={isUser && !isError}
    class:text-primary-foreground={isUser && !isError}
    class:bg-destructive={isError}
    class:text-destructive-foreground={isError}
    class:opacity-60={isSending}
    class:rounded-bl-sm={!isUser}
    class:bg-muted={!isUser}
    class:text-foreground={!isUser}
  >
    {#if role === "assistant" && status === "streaming" && !content}
      <ChatLoader/>
    {:else}
      <p class="whitespace-pre-wrap">{@html html}</p>
    {/if}
    {#if isError}
      <p class="mt-1 text-[11px] opacity-75">Failed to send</p>
    {/if}
  </div>
</article>
