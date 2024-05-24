<script lang="ts">
    import Icon from "./icon.svelte";

  interface _Option {
    value: string,
    label: string
  }

  export let options: _Option[];
  export let default_label = "Choose Option...";
  export let default_value: _Option | null = null;
  export let selected: any = null;
  export let name: string = "__DROPDOWN__";
  export let required: boolean = false;
  export let no_search: boolean = false;
  export let size: "Full" | "Small" | "Shrink" = "Small";
  export let rounded: "None" | "Left" | "Right" | "All" = "None";
  
  let filter = "";
  let opened = false;
  let selected_ptr = "";
  
  $: filter_options = options;
  $: {
    filter_options = options.filter(value => {
      return value.label.toLowerCase().includes(filter.toLowerCase());
    });
  }

  function on_select(option: _Option) {
    selected = option;
    selected_ptr = option.value;
    filter = "";
  }

  function on_submit() {
    if (selected) {
      selected = default_value || null;
      selected_ptr = "";
      filter = "";
    }
  }

  let int_rounded = "";
  $: {
    if (rounded === "All") int_rounded = "rounded-sm";
    else if (rounded === "Left") int_rounded = opened ? "rounded-tl-sm" : "rounded-l-sm";
    else if (rounded === "Right") int_rounded = "rounded-r-sm";
    else int_rounded = "";
  }

  function get_size(): string {
    if (size === "Full") return "h-full";
    else if (size === "Shrink") return "h-fit";
    else return "h-52";
  }
</script>

<svelte:window on:click={() => opened = false} on:submit={on_submit}/>

{#if options.length === 0}
<div class="relative w-full">
  <div class={`flex p-1 w-full h-fit justify-between bg-cscol-300 text-cscol-600`}>
    <p>{default_label}</p>
  </div>
</div>
{:else}
<div class="relative w-full overflow-visible h-full">
  <div class="relative w-full overflow-visible h-full">
    <button type="button" on:click|stopPropagation={() => opened = !opened} class={`${int_rounded} flex w-full p-2 justify-between bg-base-200 stroke-font`}>
      <p>{selected ? selected.label : default_label}</p>
      <div class="my-auto">
        <Icon icon={opened ? "Up" : "Down"}/>
      </div>
    </button>
    {#if opened}
    <div class={`${get_size()} flex flex-col absolute w-full z-50 shadow-lg shadow-cscol-600 bg-cscol-400`}>
      <!-- svelte-ignore a11y-autofocus -->
      {#if !no_search}
      <input 
        on:input={(e) => filter = e.currentTarget.value} 
        on:click|stopPropagation={() => {}}
        class="w-full p-1 outline-none border-cscol-100 focus:border-cscol-200 border-2 text-cscol-600" placeholder={default_label}
        autofocus
      />
      {/if}
      <div class="flex flex-col overflow-y-auto">
        {#each filter_options as _option}
          <button
            type="button"
            on:click={() => on_select(_option)} 
            class={`flex w-full p-1 hover:bg-cscol-100 ${selected?.label === _option.label && "bg-cscol-100 shadow-md text-left"}`}
          >
            {_option.label}
          </button>
        {/each}
      </div>
    </div>
    {/if}
  </div>
  <input required={required} class={`${int_rounded} absolute w-full top-0 outline-none bg-opacity-0 -z-10`} name={name} bind:value={selected_ptr}/>
</div>
{/if}