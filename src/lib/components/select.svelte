<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: string;
  export let options: { key: string; label: string; }[] = [];
  export let placeholder = "Select...";
  export let searchable = true;
  export let required = false;
  export let name = "";

  let label = "";
  let open = false;
  let search = "";

  $: if (!open) search = "";
  $: if (value?.length > 0) {
    const _option = options.find((_opt) => { return _opt.key.toString() === value });
    label = _option?.label || "";
  }

  const dispatch = createEventDispatcher();

  $: filtered_options = options.filter(option => {
    return option.label.toLowerCase().includes(search.toLowerCase());
  }).sort((a: any, b: any) => {
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  });

  function on_select(option: { key: string; label: string; }) {
    value = option.key;
    label = option.label;
    search = "";
    open = false;
    dispatch('select', option);
  }
</script>

<div class="relative flex flex-col w-full">
  <button 
    type="button" 
    class={`p-[0.4rem] text-left text-theme-dark-font-100 rounded-md shadow-md transition-all outline-none outline-1 caret-theme-dark-font-100 bg-theme-dark-200/75 placeholder:text-theme-dark-font-300 hover:outline-theme-dark-500 ${open ? "outline-theme-dark-accent" : ""}`} 
    on:click={() => open = !open}
    >
    {label || placeholder}
  </button>
  <input id={name} name={name} required={required} bind:value={value} class="absolute left-0 w-full py-1 -z-10 rounded-md outline-none opacity-0"/>
  {#if open}
  <div class="absolute w-full h-fit max-h-48 mt-10 flex flex-col rounded-md shadow-md overflow-hidden bg-theme-dark-300 z-50">
    {#if searchable}
    <!-- svelte-ignore a11y-autofocus -->
    <input 
      class={`w-full outline-none px-2 py-1 text-left border-b-2 rounded-t-md bg-theme-dark-200 focus:border-theme-dark-accent`} 
      bind:value={search} 
      placeholder="Search..."
      on:click|stopPropagation={() => {}}
      autofocus
    />
    {/if}
    <div class="flex flex-col overflow-y-auto">
      {#each filtered_options as option}
      <button type="button" class="w-full px-1 py-0.5 text-left hover:bg-theme-dark-200" on:click={() => on_select(option)}>
        {option.label}
      </button>
      {/each}
    </div>
  </div>
  {/if}
</div>