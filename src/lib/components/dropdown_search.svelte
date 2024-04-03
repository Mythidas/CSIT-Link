<script lang="ts">
  interface _Option {
    key: string,
    label: string
  }

  export let options: _Option[];
  export let default_label = "Choose Option...";
  export let selected: any = null;

  let filter = "";
  let opened = false;

  $: filter_options = options;
  $: {
    filter_options = options.filter(value => {
      return value.label.toLowerCase().includes(filter.toLowerCase());
    });
  }

  function on_select(option: _Option) {
    selected = option;
  }

</script>

<svelte:window on:click={() => opened = false} />

{#if options.length === 0}
<div class="relative w-full">
  <div class={`flex p-1 w-full h-fit justify-between bg-cscol-300 text-cscol-600`}>
    <p>{default_label}</p>
  </div>
</div>
{:else}
<div class="relative w-full">
  <button on:click|stopPropagation={() => opened = !opened} class={`${opened ? "bg-cscol-100" : "bg-cscol-000"} flex p-1 w-full h-fit justify-between hover:bg-cscol-100`}>
    <p>{selected ? selected.label : default_label}</p>
    <img src={opened ? "/chevron-up.svg" : "/chevron-down.svg"} alt="" />
  </button>
  {#if opened}
  <div class="flex flex-col absolute w-full h-52 z-10 shadow-lg shadow-cscol-600 bg-cscol-400">
    <!-- svelte-ignore a11y-autofocus -->
    <input 
      on:input={(e) => filter = e.currentTarget.value} 
      on:click|stopPropagation={() => {}}
      class="w-full p-1 outline-none border-cscol-100 focus:border-cscol-200 border-2 text-cscol-600" placeholder={default_label}
      autofocus
    />
    <div class="flex flex-col overflow-y-auto">
      {#each filter_options as option}
        <button 
          on:click={() => on_select(option)} 
          class={`flex w-full p-1 hover:bg-cscol-100 ${selected?.label === option.label && "bg-cscol-100 shadow-md text-left"}`}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>
  {/if}
</div>
{/if}