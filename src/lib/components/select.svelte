<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let options: { key: string; label: string; }[] = [];
  export let placeholder = "Select...";
  export let searchable = true;
  export let required = false;
  export let name = "";

  let label = "";
  let value = "";
  let open = false;
  let search = "";

  $: if (!open) search = "";

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
    dispatch('select', option);
  }
</script>

<svelte:window on:click={() => open = false}/>

<div>
  <div class="relative">
    <button 
      type="button" 
      class={`w-full bg-base-300 outline-none px-2 py-1 text-left border-b-2 ${open ? "border-accent-100" : "border-base-200"}`} 
      on:click|stopPropagation={() => open = !open}
      >
      {label || placeholder}
    </button>
    <input id={name} name={name} required={required} bind:value={value} class="absolute left-0 w-full py-1 -z-10 outline-none" on:change={(e) => console.log(e)}/>
  </div>
  {#if open}
  <div class="absolute w-fit h-48 flex flex-col overflow-auto bg-base-300 overflow-ellipsis z-50">
    {#if searchable}
    <!-- svelte-ignore a11y-autofocus -->
    <input 
      class={`w-full bg-base-150 outline-none px-2 py-1 text-left border-b-2 border-base-200 focus:border-accent-100`} 
      bind:value={search} 
      placeholder="Search..."
      on:click|stopPropagation={() => {}}
      autofocus
    />
    {/if}
    {#each filtered_options as option}
    <button type="button" class="w-full px-1 py-0.5 text-left hover:bg-base-200" on:click={() => on_select(option)}>
      {option.label}
    </button>
    {/each}
  </div>
  {/if}
</div>