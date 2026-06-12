<script lang="ts">
  import { RotateCcw, Van, DollarSign, Clock, MessageCircle } from "lucide-svelte";

  type Props = {
    onSuggestion?: (value: string) => void;
  };

  let { onSuggestion }: Props = $props();

  const suggestions = [
    {
      icon: RotateCcw,
      title: "Return policy",
      description: "How to send items back",
      prompt: "What is your return policy?",
    },
    {
      icon: Van,
      title: "Shipping times",
      description: "Delivery estimates by region",
      prompt: "How long does shipping take?",
    },
    {
      icon: DollarSign,
      title: "Refunds",
      description: "Get money back on your order",
      prompt: "Do you offer refunds?",
    },
    {
      icon: Clock,
      title: "Support hours",
      description: "When you can reach us",
      prompt: "What are your support hours?",
    },
  ];
</script>

<div class="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-12">
  <div class="mb-8 flex items-center gap-2">
    <div
      class="flex size-8 items-center justify-center rounded-lg border bg-background"
    >
      <MessageCircle class="size-4"/>
    </div>
    <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground title">
      Helio
    </span>
  </div>

  <h1 class="mb-3 text-center text-3xl font-medium tracking-tight md:text-4xl">
    How can I help today?
  </h1>

  <p class="mb-10 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
    Shipping, returns, refunds, account help — ask anything about your order.
  </p>

  <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
    {#each suggestions as { icon: Icon, title, description, prompt }}
      <button
        type="button"
        class="group flex items-start gap-3 rounded-xl border bg-background px-4 py-3 text-left transition-colors hover:border-foreground/30"
        onclick={() => onSuggestion?.(prompt)}
      >
        <Icon class="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div>
          <p class="text-sm font-medium">{title}</p>
          <p class="text-xs text-muted-foreground">{description}</p>
        </div>
      </button>
    {/each}
  </div>
</div>