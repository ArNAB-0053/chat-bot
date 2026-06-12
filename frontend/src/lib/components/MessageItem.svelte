<script lang="ts">
  import type { MessageRole, MessageStatus } from "$lib/types/message";
  import { marked } from "marked";
  import ChatLoader from "./ui/loader/chat-loader.svelte";
  import { CircleAlert } from "lucide-svelte";

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
    class="rounded-2xl px-4 py-3 text-sm leading-6"
    class:max-w-[75%]={isUser}
    class:max-w-full={!isUser}
    class:w-fit={!isUser}
    class:rounded-br-sm={isUser}
    class:bg-primary={isUser}
    class:text-primary-foreground={isUser}
    class:rounded-bl-sm={!isUser}
    class:bg-[#FCEBEB]={!isUser && isError}
    class:border={!isUser && isError}
    class:border-[#F09595]={!isUser && isError}
    class:bg-muted={!isUser && !isError}
    class:text-foreground={!isUser}
  >
    {#if role === "assistant" && status === "streaming" && !content}
      <ChatLoader />
    {:else if !isUser && isError}
      <div class="mb-1.5 flex items-center gap-1.5">
        <CircleAlert size={14} class="text-[#A32D2D]" />
        <span class="text-[11px] font-medium text-[#A32D2D]"
          >Something went wrong</span
        >
      </div>
      <p class="markdown text-[#791F1F]">{@html html}</p>
    {:else}
      <p class="markdown">{@html html}</p>
    {/if}
  </div>
</article>
