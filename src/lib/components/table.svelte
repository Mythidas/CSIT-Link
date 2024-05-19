<script lang="ts" context="module">
  export interface Column {
    title: string,
    key: string
  }
</script>

<script lang="ts">
  import Icon from "./icon.svelte";
  import TableFilters, { type Filter, type FilterGroup } from "./table_filters.svelte";

  export let columns: Column[];
  export let data: any[];
  export let filters: FilterGroup[] = [];
  export let on_select_row: (data: any) => void = () => { };

  let sort_state = { key: "", asc: true };
  let inter_data = JSON.parse(JSON.stringify(data));
  let filtered_data = inter_data;

  $: {
    if (sort_state.key) {
      filtered_data = filtered_data.sort((a: any, b: any) => {
        if (sort_state.asc) {
          return a[sort_state.key].localeCompare(b[sort_state.key]);
        } else {
          return b[sort_state.key].localeCompare(a[sort_state.key]);
        }
      });
    } else {
      inter_data = JSON.parse(JSON.stringify(data));
    }
  }

  function set_sort_key(key: string) {
    if (sort_state.key === key) {
      if (!sort_state.asc) {
        sort_state.key = "";
        sort_state.asc = true;
      } else {
        sort_state.asc = false;
      }
    } else {
      sort_state.key = key;
      sort_state.asc = true;
    }
  }

  function on_filter_change(filters: CustomEvent<Filter[]>) {
    filtered_data = inter_data.filter((data: any) => {
      for (let i = 0; i < filters.detail.length; i++) {
        if (filters.detail[i].type === "Text") {
          if (!data[filters.detail[i].key].toLowerCase().includes(filters.detail[i].value?.toString().toLowerCase() || "")) {
            return false;
          }
        } else if (filters.detail[i].type === "Bool") {

        } else {
          return false;
        }
      }

      return true;
    });
  }
  
</script>

<div class="flex w-full h-full overflow-hidden">
  <TableFilters bind:filters on:filter_change={on_filter_change}/>
  <div class="w-full h-full overflow-y-auto">
    <table class="table-auto text-left w-full h-fit bg-base-100">
      <thead>
        <tr>
          {#each columns as column}
          <th class="sticky top-0 shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer" on:click={() => set_sort_key(column.key)}>
            <div class="flex w-full justify-between">
              <p class="my-auto p-2 select-none">{column.title}</p>
              {#if column.key === sort_state.key}
                {#if sort_state.asc}
                <Icon icon="Up"/>
                {:else}
                <Icon icon="Down"/>
                {/if}
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
          <td class="p-2">{row[column.key]}</td>
          {/each}
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>