<script lang="ts">
  import { goto } from '$app/navigation';
  import { useGetConversations } from '$lib/queries/conversation';

  const conversationsQuery = useGetConversations();

  $effect(() => {
    if (conversationsQuery.isLoading) return;

    const conversations = conversationsQuery.data ?? [];

    if (conversations.length > 0) {
      goto(`/c/${conversations[0].id}`, { replaceState: true });
    } else {
      goto('/', { replaceState: true });
    }
  });
</script>