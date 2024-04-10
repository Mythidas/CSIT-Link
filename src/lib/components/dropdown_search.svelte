<script lang="ts">
  interface _Option {
    key: string,
    label: string
  }

  export let options: _Option[];
  export let default_label = "Choose Option...";
  export let selected: any = null;
  export let on_select: (option: _Option) => void = () => {};
  
  let filter = "";
  let opened = false;
  
  $: filter_options = options;
  $: {
    filter_options = options.filter(value => {
      return value.label.toLowerCase().includes(filter.toLowerCase());
    });
  }

  function on_select_option(option: _Option) {
    selected = option;
    on_select(option);
  }
</script>

<svelte:window on:click={() => opened = false}/>

{#if options.length === 0}
<div class="relative w-full">
  <div class={`flex p-1 w-full h-fit justify-between bg-cscol-300 text-cscol-600`}>
    <p>{default_label}</p>
  </div>
</div>
{:else}
<div class="relative w-full overflow-visible">
  <input 
    class="w-full text-2xl p-1 outline-none border-2 focus:border-cscol-100 text-cscol-600" 
    bind:value={filter} 
    on:focus={() => opened = true}
    on:click|stopPropagation={() => {}}
    placeholder={default_label}
  />
  <div class={`${opened ? "h-52" : "h-0"} text-left absolute overflow-y-auto w-full z-20 shadow-lg bg-cscol-400`}>
    {#if opened}
    {#each filter_options as option}
      <button class="w-full text-left p-1 hover:bg-cscol-100" on:click={() => on_select_option(option)}>
        {option.label}
      </button>
    {/each}
    {/if}
  </div>
</div>
{/if}