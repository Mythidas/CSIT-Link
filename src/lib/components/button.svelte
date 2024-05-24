<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let selected = false;

  const dispatch = createEventDispatcher();

  function handle_on_click() {
    dispatch('click', null);
  }
</script>

<button class={`${selected ? "stroke-accent-100 border-accent-100" : "border-base-200"} p-2 transition bg-base-300 shadow-md border-b-2 hover:stroke-accent-100 hover:border-accent-100`} on:click={handle_on_click}>
  <slot />
</button>