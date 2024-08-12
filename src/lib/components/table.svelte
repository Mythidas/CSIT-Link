<script lang="ts">
  import Time from "$lib/tools/time";
  import { createEventDispatcher } from "svelte";

  export let rows: any;
  export let columns: { key: string, label: string, type: "String" | "Number" | "Date" }[];

  const dispatch = createEventDispatcher();

  $: filtered_rows = rows;
</script>

<div class="w-full h-full overflow-auto">
  <table class="table-auto text-left w-full h-fit">
    <thead>
      <tr>
        {#each columns as _column}
        <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(194,63,12,1)] bg-theme-dark-200/50">
          {_column.label}
        </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each filtered_rows as _row}
      <tr class="even:bg-theme-dark-200 odd:bg-theme-dark-100 hover:bg-theme-dark-400 hover:cursor-pointer" on:click={() => { dispatch("select", _row) }}>
        {#each columns as _column}
          {#if _column.type === "Date"}
          <td class={`px-2 py-1 whitespace-nowrap`}>{new Time(_row[_column.key] || "").get_time_since()}</td>
          {:else}
          <td class={`px-2 py-1 whitespace-nowrap`}>{_row[_column.key] || "-"}</td>
          {/if}
        {/each}
      </tr>
      {/each}
    </tbody>
  </table>
</div>