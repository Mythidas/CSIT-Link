<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handle_on_click() {
    dispatch('click', null);
  }
</script>

<button class="p-2 transition bg-base-300 shadow-md border-b-2 border-base-200 hover:border-accent-100" on:click={handle_on_click}>
  <slot />
</button>