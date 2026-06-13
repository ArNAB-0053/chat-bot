<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { useSendMessage } from "$lib/queries/chat";
  import { conversationStore } from "$lib/stores/conversation.store.svelte";
  import { Send } from "lucide-svelte";

  type Props = {
    conversationId: string | null;
  };

  let { conversationId }: Props = $props();

  let message = $state("");
  const sendMessageMutation = useSendMessage();

  // peek — never mutates, safe inside $derived
  const localConvoState = $derived(
    conversationId ? conversationStore.peekConversation(conversationId) : null,
  );
  const isStreaming = $derived(localConvoState?.isStreaming ?? false);
  const isPendingOrStreaming = $derived(
    sendMessageMutation.isPending || isStreaming,
  );

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!conversationId || !message.trim() || isPendingOrStreaming) {
      return;
    }

    const targetConversationId = conversationId;
    const currentMessage = message.trim();

    message = "";

    const userMsgId = `client-user-${crypto.randomUUID()}`;
    const assistantMsgId = `client-assistant-${crypto.randomUUID()}`;

    try {
      conversationStore.addUserMessage(
        targetConversationId,
        userMsgId,
        currentMessage,
      );

      conversationStore.addAssistantPlaceholder(
        targetConversationId,
        assistantMsgId,
      );

      const response = await sendMessageMutation.mutateAsync({
        conversationId: targetConversationId,
        message: currentMessage,
      });

      conversationStore.markUserMessageSent(targetConversationId, userMsgId);

      const words = response.content.split(/(\s+)/);
      let wordIndex = 0;

      const interval = setInterval(() => {
        if (wordIndex < words.length) {
          conversationStore.appendAssistantChunk(
            targetConversationId,
            assistantMsgId,
            words[wordIndex],
          );

          wordIndex++;
        } else {
          clearInterval(interval);

          conversationStore.finishAssistantMessage(
            targetConversationId,
            assistantMsgId,
          );
        }
      }, 30);
    } catch {
      conversationStore.markMessageError(targetConversationId, userMsgId);
      conversationStore.setAssistantError(
        targetConversationId,
        assistantMsgId,
        "Sorry, I could not generate a response at this time. Please try again.",
      );

      message = currentMessage;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const form = (event.currentTarget as HTMLTextAreaElement).closest("form");
      form?.requestSubmit();
    }
  }
</script>

<form
  class="shrink-0 border-t bg-background p-3 sm:p-4"
  onsubmit={handleSubmit}
>
  <div class="mx-auto flex w-full max-w-3xl items-center gap-2">
    <Textarea
      aria-label="Message"
      placeholder="Type your message..."
      rows={1}
      class="max-h-36 min-h-11 resize-none rounded-lg py-3 text-sm!"
      bind:value={message}
      disabled={!conversationId || isPendingOrStreaming}
      onkeydown={handleKeyDown}
    />
    <Button
      type="submit"
      size="icon-lg"
      class="shrink-0 rounded-lg"
      aria-label="Send message"
      disabled={!conversationId || !message.trim() || isPendingOrStreaming}
    >
      <Send class="size-4" />
    </Button>
  </div>
</form>
