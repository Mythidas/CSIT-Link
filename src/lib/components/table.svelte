<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Icon from "./icon.svelte";
  import TableFilters, { type Filter, type FilterGroup } from "./table_filters.svelte";
  import LoadingSpinner from "./loading_spinner.svelte";
  import axios from "axios";
  import { PUBLIC_LOCAL_URL } from "$env/static/public";
  import Checkbox from "./checkbox.svelte";

  export let page: number;
  export let total_items: number;
  export let count = 25;
  export let columns: Filter[];
  export let data: string = ""; // Used for static data
  export let sort_state = { key: "", group: "", asc: true, type: "" };
  export let loading = false;
  export let sticky_first = false;
  export let options: string[] = [];
  export let filtered_data: any[] = [];
  export let selected_row: number = -1;
  
  let active_filters: Filter[] = [];
  let filters: FilterGroup[] = [];
  let first_child_sticky = "first:sticky first:left-0 first:z-40 first:bg-base-200 first:shadow-[inset_-2px_0_0_rgba(127,133,245,0.3)]";
  
  const dispatch = createEventDispatcher();
  onMount(() => {
    fetch_data(page, count);
  });
    
  $: if (page > Math.ceil(total_items / count) || page <= 0) {
    page = Math.min(Math.max(page, 1), Math.ceil(total_items / count));
    fetch_data(page, count);
  }
  $: {
    let _filters: FilterGroup[] = [];
    for (let i = 0; i < columns.length; i++) {
      const _group = _filters.find((_filter: FilterGroup) => {
        return _filter.name === columns[i].group;
      });

      if (_group) {
        _group.filters.push({...columns[i]});
      } else {
        _filters.push({
          name: columns[i].group,
          filters: [columns[i]]
        })
      }
    }

    filters = _filters;
  }

  async function fetch_data(page: number, count: number) {
    if (loading) return;

    loading = true;
    selected_row = -1;
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
    fetch_data(page, count);
  }

  function set_sort_key(key: string, group: string, type: string) {
    sort_state.group = group;
    sort_state.type = type;
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

    if (!sort_state.key) return;
    fetch_data(page, count);
  }

  function on_filter_change(filters: Filter[]) {
    fetch_data(page, count);
  }

  function on_select_row(index: number) {
    selected_row = index;
  }

  function on_page_up() {
    if (page < Math.ceil(total_items / count)) {
      page++;
      fetch_data(page, count);
    }
  }

  function on_page_down() {
    if (page > 1) {
      page--;
      fetch_data(page, count);
    }
  }

  function on_top_check(e: any) {
    for (let row of filtered_data) {
      row.checked = !e.detail;
    }

    filtered_data = [...filtered_data];
  }

  function on_option_select(e: any) {
    dispatch('option', e.target.value);
  }

  function calculate_time_since(date_string: string): string {
    // Parse the ISO string into a Date object
    const then: Date = new Date(date_string);

    // Get the current time
    const now: Date = new Date();

    // Calculate the difference in milliseconds
    const difference: number = now.getTime() - then.getTime();

    // Calculate days, hours, and minutes
    const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes: number = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    // Build the output string
    let output: string = "";
    if (days > 0) {
      output += `${days}d, `;
    }
    if (hours > 0) {
      output += `${hours}h, `;
    }
    if (minutes > 0) {
      output += `${minutes}m`;
    }

    return output ? `${output} ago` : "Just now";
  }
</script>

<div class="flex w-full h-full">
  <TableFilters filters={filters} bind:active_filters on:filter_change={(e) => on_filter_change(e.detail)}/>
  <div class="flex flex-col w-full h-full justify-between overflow-hidden">
    <div class="w-full h-full overflow-auto">
      {#if !loading}
      <table class="table-auto text-left w-full h-fit bg-base-100">
        <thead>
          <tr>
            {#if options.length > 0}
            <th class={`px-2 py-1 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)]`}>
              <Checkbox checked={false} label="" id="" on:input={on_top_check}/>
              <select on:change={on_option_select} class="w-4 bg-base-100 border-none outline-none" value="">
                {#each options as opt}
                <option value={opt}>{opt}</option>
                {/each}
              </select>
            </th>
            {/if}
            {#each columns as column}
            <th class="sticky top-0 first:left-0 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer" on:click={() => set_sort_key(column.key, column.group, column.type)}>
              <div class="flex w-full justify-between">
                <p class="my-auto p-2 select-none">{column.name}</p>
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
          {#each filtered_data as row, index}
          <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300" on:click={() => on_select_row(index)}>
            {#if options.length > 0}
            <td class={`px-2 py-1 whitespace-nowrap`}>
              <Checkbox bind:checked={row.checked} label="" id=""/>
            </td>
            {/if}
            {#each columns as column}
              {#if !column.type || column?.type === "Text" || column?.type === "Number"}
              <td class={`px-2 py-1 whitespace-nowrap ${sticky_first && first_child_sticky}`}>{row[column.key] || column.default}</td>
              {:else if column.type === "Date"}
              <td class={`px-2 py-1 whitespace-nowrap ${sticky_first && first_child_sticky}`}>{row[column.key] ? calculate_time_since(row[column.key]) : column.default}</td>
              {:else if column.type === "Bool"}
              <td class={`px-2 py-1 whitespace-nowrap ${sticky_first && first_child_sticky}`}>{row[column.key] === null ? column.default : (row[column.key] ? "Yes" : "No")}</td>
              {/if}
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