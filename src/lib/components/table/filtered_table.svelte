<script lang="ts" context="module">
  export interface ColumnInfo {
    label: string,
    filter: "Text" | "Select" | "None",
    sortable?: boolean | undefined,
    tooltip?: string,
    custom_sort?: (a: CellData, b: CellData, state: SortState) => number;
  }

  export interface RowData {
    cells: CellData[],
    storage?: any
  }

  export interface CellData {
    value: string,
    error_value?: string
  }

  export interface SortState {
    column: number, 
    dir: "asc" | "desc"
  }

  export function boolean_sort_with_invalid(a: CellData, b: CellData, state: SortState): number {
    const prio = (val: string) => {
      switch (val) {
        case "YES": return 1;
        case "NO": return 2;
        default: return 3;
      }
    }

    if (prio(a.value) < prio(b.value)) return state.dir === "asc" ? -1 : 1;
    if (prio(a.value) > prio(b.value)) return state.dir === "desc" ? -1 : 1;
    return 0;
  }
</script>

<script lang="ts">
  import Tooltip from "$lib/components/tooltip.svelte";

  export let columns: ColumnInfo[];
  export let data: RowData[];
  export let on_select_row: (row: RowData) => void = () => {};
  
  let filter_open = new Array(columns.length).fill(false);
  let filters = new Array(columns.length).fill("");
  let value_set = unique_values_in_columns();
  let sorted_data = structuredClone(data);
  let sort_state: SortState = { column: -1, dir: "asc" };

  $: {
    if (sort_state.column < 0) {
      sorted_data = structuredClone(data);
    } else {
      const default_sort = (a: CellData, b: CellData): number => {
        if (a.value < b.value) return sort_state.dir === "asc" ? -1 : 1;
        if (a.value > b.value) return sort_state.dir === "asc" ? 1 : -1;
        return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
      }

      const default_sort_numbers = (a: CellData, b: CellData): number => {
        const a_val = Number(a.value);
        const b_val = Number(b.value);

        if (a_val < b_val) return sort_state.dir === "asc" ? -1 : 1;
        if (a_val > b_val) return sort_state.dir === "asc" ? 1 : -1;
        return 0;
      }

      const is_number = (str: string) => {
        return /^\d+(\.\d+)?$/.test(str);
      }

      const _custom_sort = (a: CellData, b: CellData, state: SortState) => {
        return columns[sort_state.column].custom_sort?.(a, b, state);
      }
      
      sorted_data = sorted_data.sort((a, b) => {
        const sort = _custom_sort(a.cells[sort_state.column], b.cells[sort_state.column], sort_state);
        if (sort !== undefined) {
          return sort;
        } else {
          return (is_number(a.cells[sort_state.column].value) && is_number(a.cells[sort_state.column].value)) 
          ? default_sort_numbers(a.cells[sort_state.column], b.cells[sort_state.column])
          : default_sort(a.cells[sort_state.column], b.cells[sort_state.column]);
        }
      })
    }
  }

  function unique_values_in_columns(): Set<string>[] {
    const unique_values: Set<string>[] = [];

    columns.forEach((column, index) => {
      const column_values = new Set<string>();

      if (column.filter !== "Select") {
        unique_values.push(column_values);
        return;
      }

      for (const row of data) {
        const cell_value = row.cells[index].value;
        column_values.add(cell_value);
      }

      unique_values.push(column_values);
    })

    return unique_values;
  }

  function open_filter(index: number) {
    const _temp = filter_open[index];
    close_all_filters();
    filter_open[index] = !_temp;
  }

  function close_all_filters() {
    for (let i = 0; i < filter_open.length; i++) {
      filter_open[i] = false;
    }
  }

  function check_select(value: string, column: number) {
    if (filters[column].includes(value)) {
      let split_view: string[] = filters[column].split(";|") as string[];
      let split_filter = split_view.filter(opt => opt !== value);
      filters[column] = split_filter.join(";|");
    } else {
      filters[column] += value + ";|"
    }
  }

  function set_sort_state(column: number) {
    if (columns[column].sortable === false) return;

    if (sort_state.column === column) {
      if (sort_state.dir === "asc") {
        sort_state.dir = "desc";
      } else {
        sort_state.column = -1;
        sort_state.dir = "asc";
      }
    } else {
      sort_state.column = column;
      sort_state.dir = "asc";
    }
  }

  function get_tr_class(row: RowData): string {
    const is_error = row.cells.filter((data) => {
      return data.error_value?.includes(data.value);
    }).length > 0;

    return `${is_error ? "bg-errcol-100" : "even:bg-cscol-400 odd:bg-cscol-500 hover:bg-cscol-100"} hover:cursor-pointer`;
  }
</script>

<svelte:window on:click={close_all_filters} />

<div class="w-full h-full overflow-y-auto">
  <table class={`table-auto w-full h-fit text-left`}>
    <thead class="border-b-2 border-cscol-200 text-lg">
      <tr>
        {#each columns as col, index}
          <th class={`pl-2`}>
            <div class={`${filter_open[index] && "relative"}`}>
              <div class="flex justify-between">
                <div class="flex space-x-1">
                  {#if col.sortable !== false}
                  <button on:click={() => set_sort_state(index)} class="flex space-x-1">
                    <p class="whitespace-nowrap">{col.label}</p>
                    <div class="flex flex-col -space-y-1">
                      <svg class={`w-4 h-4 ${(sort_state.column === index && sort_state.dir === "asc") && "stroke-cscol-200"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                      <svg class={`w-4 h-4 ${(sort_state.column === index && sort_state.dir === "desc") && "stroke-cscol-200"}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </button>
                  {:else}
                  <p class="whitespace-nowrap">{col.label}</p>
                  {/if}
                  {#if col.tooltip}
                    <Tooltip title={col.tooltip}>
                      <img class="w-5 mt-1" src="/info.svg" alt="" />
                    </Tooltip>
                  {/if}
                </div>
                <button on:click|stopPropagation={() => open_filter(index)}>
                  <svg class={`w-4 ${filters[index] && "fill-cscol-200 stroke-cscol-000 w-4"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </button>
              </div>
              {#if filter_open[index]}
                {#if col.filter === "Text"}
                  <div class="flex flex-col absolute w-full h-fit z-10 shadow-lg p-0.5 shadow-cscol-600 bg-cscol-000">
                    <!-- svelte-ignore a11y-autofocus -->
                    <input 
                      class="w-full p-1 outline-none border-cscol-100 focus:border-cscol-200 border-2 text-cscol-600" 
                      on:click|stopPropagation={()=>{}}
                      bind:value={filters[index]}
                      placeholder={`${col.label}...`}
                      autofocus
                    />
                  </div>
                {:else if col.filter === "Select"}
                  <div>
                    <div class="flex flex-col absolute w-full h-fit z-10 shadow-lg shadow-cscol-600 bg-cscol-600">
                      <!-- svelte-ignore a11y-autofocus -->
                      {#each value_set[index] as val}
                        <button class="flex space-x-2 pl-2 hover:bg-cscol-100" on:click|stopPropagation={() => check_select(val, index)}>
                          <input class="my-auto accent-cscol-000" type="checkbox" checked={filters[index].includes(val)} on:click|stopPropagation={() => check_select(val, index)} />
                          <p>{val}</p>
                        </button>
                      {/each}
                    </div>
                  </div>
                {/if}
              {/if}
            </div>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="text-base">
      {#each sorted_data as row}
      <tr on:click={() => on_select_row(row)} class={get_tr_class(row)}>
      {#each row.cells as entry}
        <td class="pl-2 text-base font-normal">
          {entry.value}
        </td>
      {/each}
      </tr>
      {/each}
    </tbody>
  </table>
</div>