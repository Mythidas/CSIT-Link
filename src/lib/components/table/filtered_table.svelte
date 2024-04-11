<script lang="ts">
  import { writable } from "svelte/store";
  import { setContext } from "svelte";

  export let columns: { label: string, filter: "Text" | "Select" }[];

  let filter_open = new Array(columns.length).fill(false);
  let filters = writable(new Array(columns.length).fill(""));
  let value_set = writable(Array.from({ length: columns.length }, () => []));
  setContext("table_filters", filters);
  setContext("table_values", value_set);

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

  function check_select(option: string, column: number) {
    if ($filters[column].includes(option)) {
      let split_view: string[] = $filters[column].split(";|") as string[];
      let split_filter = split_view.filter(opt => opt !== option);
      $filters[column] = split_filter.join(";|");
    } else {
      $filters[column] += option + ";|"
    }
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
                <p>{col.label}</p>
                <button on:click|stopPropagation={() => open_filter(index)}>
                  <svg class={`w-4 ${$filters[index] && "fill-cscol-200 stroke-cscol-000 w-4"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                      bind:value={$filters[index]}
                      placeholder={`${col.label}...`}
                      autofocus
                    />
                  </div>
                {:else if col.filter === "Select"}
                  <div>
                    <div class="flex flex-col absolute w-full h-fit z-10 shadow-lg shadow-cscol-600 bg-cscol-600">
                      <!-- svelte-ignore a11y-autofocus -->
                      {#each $value_set[index] as val}
                        <button class="flex space-x-2 pl-2 hover:bg-cscol-100" on:click|stopPropagation={() => check_select(val, index)}>
                          <input class="my-auto accent-cscol-000" type="checkbox" checked={$filters[index].includes(val)} on:click|stopPropagation={() => check_select(val, index)} />
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
      <slot />
    </tbody>
  </table>
</div>