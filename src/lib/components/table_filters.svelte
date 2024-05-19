<script lang="ts" context="module">
  export interface FilterOption {
    name: string
  } 

  export interface Filter {
    name: string; // Display name of the filter
    key: string; // Data property to filter on
    type: "Text" | "Select" | "Bool"; // Filter input type
    options?: FilterOption[]; // Available options for select filters
    value?: string | boolean; // Current filter value
    active?: boolean; // Whether the filter is currently applied
  }

  export interface FilterGroup {
    name: string,
    filters: Filter[],
    expanded?: boolean
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Icon from "./icon.svelte";
  import Input from "./input.svelte";
    import Button from "./button.svelte";

  export let filters: FilterGroup[] = [];
  
  let active_filters: Filter[] = [];
  let filters_open = false;
  let search_filters = "";

  const dispatch = createEventDispatcher();

  $: {
    if (search_filters) {
      for (let i = 0; i < filters.length; i++) {
        for (let j = 0; j < filters[i].filters.length; j++) {
          if (filters[i].filters[j].name.toLowerCase().includes(search_filters.toLowerCase())) {
            filters[i].expanded = true;
          }
        }
      }
    }
  }

  function on_active_change(e: any, filter: Filter) {
    if (e.target.checked === true) {
      active_filters = [filter, ...active_filters];
    } else {
      filter.value = "";
      active_filters = active_filters.filter(item => {
        return item.key !== filter.key;
      })
    }

    dispatch('filter_change', active_filters);
  }

  function on_filter_change() {
    dispatch('filter_change', active_filters);
  }

  function reset_filters() {
    search_filters = "";
    for (let i = 0; i < filters.length; i++) {
      filters[i].expanded = false;
      for (let j = 0; j < filters[i].filters.length; j++) {
        filters[i].filters[j].active = false;
        filters[i].filters[j].value = "";
      }
    }

    active_filters = [];
  }
</script>

<div class={`flex flex-col ${filters_open ? "w-80" : " w-11"} space-y-2 p-2 transition-[width] bg-base-150 stroke-font border-r-2 border-accent-100`}>
  <div class="flex space-x-2">
    <button class={`${active_filters.length > 0 && "stroke-accent-100"} relative py-1 transition hover:scale-110`} on:click={() => filters_open = !filters_open}>
      <Icon icon="Filter" size={8}/>
      {#if active_filters.length > 0}
      <div class="absolute p-0 text-sm -bottom-1 right-0">
        {active_filters.length}
      </div>
      {/if}
    </button>
    {#if filters_open}
    <div class="w-full">
      <Input bind:value={search_filters} placeholder="Search filters..."/>
    </div>
    {/if}
  </div>
  {#if filters_open}
  <div class="flex flex-col w-full h-full justify-between">
    <div class="flex flex-col border-t-2 border-base-300 overflow-y-auto">
      {#each filters as group}
      <div class={`${group.expanded && "pb-2"} border-b-2 border-base-300`}>
        <button class="flex w-full px-2 justify-between text-xl hover:bg-base-200" on:click={() => group.expanded = !group.expanded}>
          <p>{group.name}</p>
          <div class="my-auto">
            <Icon icon={group.expanded ? "Up" : "Down"} size={8}/>
          </div>
        </button>
        {#if group.expanded}
        <div class="pl-2 space-y-1">
          {#each group.filters as filter}
          {#if !search_filters || filter.name.toLowerCase().includes(search_filters.toLowerCase())}
          <div class="flex space-x-2">
            <input id={filter.key} type="checkbox" class="w-4 accent-accent-100" bind:checked={filter.active} on:change={e => on_active_change(e, filter)} />
            <label for={filter.key}>{filter.name}</label>
          </div>
          {#if filter.active}
          <div class="pl-6">
            {#if filter.type === "Text"}
            <Input bind:value={filter.value} placeholder={`Enter ${filter.name}...`} on:input={on_filter_change} />
            {/if}
          </div>
          {/if}
          {/if}
          {/each}
        </div>
        {/if}
      </div> 
      {/each}
    </div>
    <Button on:click={reset_filters}>
      Clear Filters
    </Button>
  </div>
  {/if}
</div>