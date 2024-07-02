<script lang="ts" context="module">
  export interface FilterOption {
    name: string
  } 

  export interface Filter {
    name: string; // Display name of the filter
    key: string; // Data property to filter on
    group: string;
    type: "Text" | "Select" | "Bool" | "Number" | "Date"; // Filter input type
    options?: FilterOption[]; // Available options for select filters
    value?: string | boolean; // Current filter value
    active?: boolean; // Whether the filter is currently applied,
    default?: string;
    hidden?: boolean;
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
  import DropdownButton from "./dropdown_button.svelte";
  import Select from "./select.svelte";

  export let filters: FilterGroup[] = [];
  export let active_filters: Filter[] = [];
  
  let filters_open = false;
  let search_filters = "";
  let filter_timeout: NodeJS.Timeout;

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

  function on_active_change(e: any, filter: Filter, group: string) {
    if (e.target.checked === true) {
      filter.group = group;
      active_filters = [filter, ...active_filters];
    } else {
      filter.value = "";
      active_filters = active_filters.filter(item => {
        return item.key !== filter.key;
      })
      
      dispatch('filter_change', active_filters);
    }
  }

  function on_filter_change() {
    clearTimeout(filter_timeout);
    filter_timeout = setTimeout(() => {
      dispatch('filter_change', active_filters);
    }, 1000);
  }

  function on_filter_combo(e: any) {
    if (e.detail === "clear_filters") {
      search_filters = "";
      for (let i = 0; i < filters.length; i++) {
        filters[i].expanded = false;
        for (let j = 0; j < filters[i].filters.length; j++) {
          filters[i].filters[j].active = false;
          filters[i].filters[j].value = "";
        }
      }
      active_filters = [];
      on_filter_change();
    }
  }

  function forward_30_days() {
    return new Date(new Date().getTime() + 30 * 24 * 3600 * 1000).toISOString();
  }

  function backward_30_days() {
    return new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString();
  }
</script>

<div class={`flex flex-col ${filters_open ? "w-80" : " w-11"} space-y-2 p-2 transition-[width] bg-base-150 stroke-font border-r-2 border-accent-100`}>
  <div class="flex space-x-2">
    <button class={`${active_filters.length > 0 && "stroke-accent-100"} relative py-1 transition hover:scale-110`} on:click={() => filters_open = !filters_open}>
      <Icon icon="Filter" size={24}/>
      {#if active_filters.length > 0}
      <div class="absolute p-0 text-sm -bottom-1 right-0">
        {active_filters.length}
      </div>
      {/if}
    </button>
    {#if filters_open}
    <div class="flex w-full">
      <Input bind:value={search_filters} placeholder="Search filters..."/>
      <DropdownButton 
        options={[
          { label: "Clear Filters", key: "clear_filters" },
        ]}
        align="Right"
        on:select={on_filter_combo}
      >
        <Icon icon="Menu" size={24}/>
      </DropdownButton>
    </div>
    {/if}
  </div>
  {#if filters_open}
  <div class="flex flex-col w-full h-full justify-between overflow-hidden">
    <div class="flex flex-col border-t-2 border-base-300 overflow-y-auto">
      {#each filters as group}
      <div class={`${group.expanded && "pb-2"} border-b-2 border-base-300`}>
        <button class="flex w-full px-2 py-1 justify-between text-xl hover:bg-base-200" on:click={() => group.expanded = !group.expanded}>
          <p>{group.name}</p>
          <div class="my-auto">
            <Icon icon={group.expanded ? "Up" : "Down"} size={24}/>
          </div>
        </button>
        {#if group.expanded}
        <div class="pl-2 space-y-1">
          {#each group.filters as filter}
          {#if !search_filters || filter.name.toLowerCase().includes(search_filters.toLowerCase())}
          <div class="flex space-x-2">
            <input id={filter.key} type="checkbox" class="w-4 accent-accent-100" bind:checked={filter.active} on:change={e => on_active_change(e, filter, group.name)} />
            <label for={filter.key}>{filter.name}</label>
          </div>
          {#if filter.active}
          <div class="pl-6">
            {#if filter.type === "Text"}
            <Input bind:value={filter.value} placeholder={`Search ${filter.name}...`} on:input={on_filter_change} />
            {:else if filter.type === "Bool"}
            <Select bind:value={filter.value} options={[{ key: "true", label: "Enabled" }, { key: "false", label: "Disabled" }]} on:select={on_filter_change}/>
            {:else if filter.type === "Date"}
            <Select bind:value={filter.value} options={[{ key: `> ${backward_30_days()}`, label: "< 30d" }, { key: `<= ${backward_30_days()}`, label: "> 30d" }]} on:select={on_filter_change}/>
            {:else if filter.type === "Select"}
            <p>Not Implemented</p>
            {:else if filter.type === "Number"}
            <Input bind:value={filter.value} placeholder={`Enter Forumla...`} on:input={on_filter_change} />
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
  </div>
  {/if}
</div>