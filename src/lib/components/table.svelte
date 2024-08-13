<script lang="ts">
  import Time from "$lib/tools/time";
  import { createEventDispatcher } from "svelte";
  import Checkbox from "./checkbox.svelte";

  export let rows: any;
  export let columns: { key: string, label: string, type: "String" | "Number" | "Date" }[];
  export let is_checkable: boolean = false;

  const dispatch = createEventDispatcher();

  $: filtered_rows = rows;

  function evaluate_key_relation(_data: any, _key: string) {
    const _key_log = _key.split('.');

    if (_key_log.length > 1) {
      const _key_log_reduced = _key_log.slice(1, _key_log.length);
      return evaluate_key_relation(_data[_key_log[0]], _key_log_reduced.join('.'));
    }

    return _data[_key];
  }
</script>

<div class="w-full h-full overflow-auto">
  <table class="table-auto text-left w-full h-fit border-separate border-spacing-y-1">
    <thead>
      <tr>
        {#if is_checkable}
        <th class="sticky w-8 top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
          <Checkbox id="top_" label="" checked/>
        </th>
        {/if}
        {#each columns as _column}
        <th class="sticky top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
          {_column.label}
        </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each filtered_rows as _row, index}
      <tr class="even:bg-theme-dark-200 odd:bg-theme-dark-100 hover:bg-theme-dark-400 hover:cursor-pointer" on:click={() => { dispatch("select", _row) }}>
        {#if is_checkable}
        <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>
          <Checkbox id={`${index}`} label="" checked/>
        </td>
        {/if}
        {#each columns as _column}
          {#if _column.type === "Date"}
          <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>{new Time(_row[_column.key] || "").get_time_since()}</td>
          {:else}
          <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>{evaluate_key_relation(_row, _column.key) || "-"}</td>
          {/if}
        {/each}
      </tr>
      {/each}
    </tbody>
  </table>
</div>