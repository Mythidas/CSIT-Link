<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let filter: string;
  export let tag: string;
  export let label: string;

  const dispatch = createEventDispatcher();

  function on_click() {
    filter = tag;
    dispatch("click", tag);
  }
</script>

<div class="flex flex-col w-52 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
  <p class="w-full text-center text-xl font-bold">{label}</p>
  <p class="w-full text-center text-xl rounded-md bg-theme-dark-300">
    <slot />
  </p>
  {#if filter === tag}
  <div class="text-center rounded-md bg-theme-preset-active">
    Selected
  </div>
  {:else}
  <button class="rounded-md bg-theme-dark-500 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={on_click}>
    Select
  </button>
  {/if}
</div>