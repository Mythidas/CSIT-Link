<script lang="ts" context="module">
  export interface Column {
    label: string;
    key: string;
    default?: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Icon from "./icon.svelte";
  import TableFilters, { type Filter, type FilterGroup } from "./table_filters.svelte";
  import LoadingSpinner from "./loading_spinner.svelte";
  import axios from "axios";
  import { PUBLIC_LOCAL_URL } from "$env/static/public";

  export let page: number;
  export let total_items: number;
  export let count = 25;
  export let columns: Column[];
  export let data: string = ""; // Used for static data
  export let filters: FilterGroup[] = [];

  let _data = JSON.parse(JSON.stringify(data));
  let sort_state = { key: "", asc: true };
  let filtered_data = _data;
  let active_filters: Filter[] = [];
  let loading = true;
  
  const dispatch = createEventDispatcher();
  onMount(() => {
    fetch_data(page, count);
  })

  $: fetch_data(page, count);
  $: if (page > Math.ceil(total_items / count) || page <= 0) {
    page = Math.min(Math.max(page, 1), Math.ceil(total_items / count));
  }

  async function fetch_data(page: number, count: number) {
    if (typeof data !== "string") return;

    loading = true;
    try {
      const response = await axios.post(`${PUBLIC_LOCAL_URL}${data}`, {
        page,
        count,
        filters: active_filters,
        sorting: sort_state
      });

      if (response.status !== 200) return;

      filtered_data = JSON.parse(JSON.stringify(response.data.data));
      total_items = response.data.meta.total;
      loading = false;
    } catch (err) {
      console.log(err);
    }
  }

  function on_count_change(e: Event) {
    const _target = e.target as HTMLSelectElement;
    count = Number(_target.value || 25);
  }

  function set_sort_key(key: string) {
    if (sort_state.key === key) {
      if (!sort_state.asc) {
        sort_state.asc = true;
      } else {
        sort_state.asc = false;
      }
    } else {
      sort_state.key = key;
      sort_state.asc = true;
    }

    sort_data();
  }

  function sort_data() {
    if (!sort_state.key) return;
    fetch_data(page, count);
  }

  function on_filter_change(filters: Filter[]) {
    console.log(active_filters);
    fetch_data(page, count);
  }

  function on_select_row(data: any) {
    dispatch('select_row', data);
  }

  function on_page_up() {
    if (page < Math.ceil(total_items / (page * count))) {
      page++;
    }
  }

  function on_page_down() {
    if (page > 1) {
      page--;
    }
  }
</script>

<div class="flex w-full h-full">
  <TableFilters bind:filters bind:active_filters on:filter_change={(e) => on_filter_change(e.detail)}/>
  <div class="flex flex-col w-full h-full  justify-between">
    <div class="w-full h-full overflow-auto">
      {#if !loading}
      <table class="table-auto text-left w-full h-fit bg-base-100">
        <thead>
          <tr>
            {#each columns as column}
            <th class="sticky top-0 shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer" on:click={() => set_sort_key(column.key)}>
              <div class="flex w-full justify-between">
                <p class="my-auto p-2 select-none">{column.label}</p>
                {#if column.key === sort_state.key}
                <div class="my-auto">
                  <Icon icon={`${sort_state.asc ? "Up" : "Down"}`}/>
                </div>
                {/if}
              </div>
            </th>
            {/each}
          </tr>
        </thead>
        <tbody class="hover:cursor-pointer">
          {#each filtered_data as row}
          <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300" on:click={() => on_select_row(row)}>
            {#each columns as column}
            <td class="px-2 py-1">{row[column.key] || column.default}</td>
            {/each}
          </tr>
          {/each}
        </tbody>
      </table>
      {:else}
      <div class="flex w-full h-full bg-base-100">
        <LoadingSpinner />
      </div>
      {/if}
    </div>
    <div class="flex w-full h-fit justify-between px-2 border-t-2 border-base-300">
      <div>Total: {total_items}</div>
      <div class="flex stroke-font">
        <button type="button" on:click={on_page_down} class=""><Icon icon="Down"></Icon></button>
        {page}/{Math.ceil(total_items / count)}
        <button type="button" on:click={on_page_up}><Icon icon="Up"></Icon></button>
      </div>
      <div>
        Count: 
        <select on:change={on_count_change} class="bg-base-100 border-none">
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</div>