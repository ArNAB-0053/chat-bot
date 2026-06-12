<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  type Props = {
    open: boolean;
    isPending?: boolean;
    onSubmit: (title: string) => void;
  };

  let {
    open = $bindable(false),
    isPending = false,
    onSubmit,
  }: Props = $props();

  let title = $state("");

  function handleCreate() {
    const trimmed = title.trim();

    if (!trimmed) return;

    onSubmit(trimmed);

    title = "";
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md h-50 rounded-sm">
    <Dialog.Header>
      <Dialog.Title>Create Conversation</Dialog.Title>
      <Dialog.Description>
        Give your conversation a meaningful title.
      </Dialog.Description>
    </Dialog.Header>

    <div class="py-4">
      <Input
        bind:value={title}
        placeholder="e.g. Refund Request"
        maxlength={80}
		onkeydown={(e) => e.key === 'Enter' && handleCreate()}
      />
    </div>

    <Dialog.Footer>
      <Button
        variant="outline"
        onclick={() => {
          title = "";
          open = false;
        }}
      >
        Cancel
      </Button>
      <Button onclick={handleCreate} disabled={!title.trim() || isPending}>
        {isPending ? "Creating..." : "Create"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
