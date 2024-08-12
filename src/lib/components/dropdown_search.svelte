<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let options: { label: string, value: string }[];

  const dispatch = createEventDispatcher();
  let is_focused = false;
  let search_value = "";

  $: filtered_options = options.filter((_option) => { return _option.label.toLowerCase().includes(search_value.toLowerCase()); })
</script>

<svelte:window on:click={() => is_focused = false}/>

<div class="relative flex flex-col w-full">
  <input 
    class="p-[0.4rem] text-theme-dark-font-100 rounded-md shadow-md transition-all outline-none outline-1 caret-theme-dark-font-100 bg-theme-dark-200/75 placeholder:text-theme-dark-font-300 focus:outline-theme-dark-accent hover:outline-theme-dark-500" 
    placeholder="Search Sites"
    bind:value={search_value}
    on:click|stopPropagation={() => {}}
    on:focus={() => { is_focused = true; }}
  />
  {#if is_focused}
  <div class="absolute z-[100] flex flex-col w-full max-h-32 mt-10 rounded-md shadow-md overflow-y-auto text-theme-dark-font-100 bg-theme-dark-300">
    {#each filtered_options as _option}
    <button class="text-left px-2 py-1 hover:bg-theme-dark-400" on:click={() => dispatch("select", _option)}>
      {_option.label}
    </button>
    {/each}
  </div>
  {/if}
</div>