<script lang="ts" context="module">
  export interface Option {
    label: string,
    key: string
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  
  export let options: Option[] = [];
  export let align: "Left" | "Right" = "Left";

  let dropdown_open = false;

  const dispatch = createEventDispatcher();

  function handle_on_click() {
    dropdown_open = !dropdown_open;
    dispatch('click', null);
  }

  function handle_on_select(key: string) {
    dropdown_open = false;
    dispatch('select', key);
  }
</script>

<div class="relative">
  <button class="p-2 transition bg-base-300 shadow-md border-b-2 border-base-200 hover:border-accent-100" on:click={handle_on_click}>
    <slot />
  </button>
  {#if dropdown_open}
  <div class={`absolute ${align === "Right" && "right-0"} bg-base-100`}>
    {#each options as option}
    <button class="flex w-full p-2 text-nowrap border-base-200 border-b-2 bg-base-300 hover:text-accent-100" on:click={() => handle_on_select(option.key)}>
      {option.label}
    </button>
    {/each}
  </div>
  {/if}
</div>