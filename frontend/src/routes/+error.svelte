<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { MessageCircle, ArrowLeft } from "lucide-svelte";

  const status = $derived(page.status);
  const message = $derived(page.error?.message ?? "Something went wrong");
</script>

<div
  class="flex h-dvh w-full flex-col items-center justify-center gap-6 px-4 text-center"
>
  <div class="flex flex-col items-center gap-3">
    <p
      style="font-size: clamp(6rem, 20vw, 14rem); font-weight: 900; letter-spacing: -0.05em; color: hsl(var(--foreground) / 0.08); line-height: 1;"
    >
      {status}
    </p>

    <div class="-mt-4 flex flex-col gap-1.5">
      <h1 class="text-xl font-semibold tracking-tight md:text-2xl uppercase">
        {#if status === 404}
          Page not found
        {:else if status === 403}
          Access denied
        {:else}
          Something went wrong
        {/if}
      </h1>
      <p class="max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  </div>

  <div class="h-6"></div>
  <button
    onclick={() => goto("/")}
    class="group flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
  >
    <ArrowLeft
      class="size-4 transition-transform group-hover:-translate-x-0.5"
    />
    Back to home
  </button>
</div>
