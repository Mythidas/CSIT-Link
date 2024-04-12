<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  export let entries: string[];
  export let index: number;
  export let error: boolean = false;
  export let custom: boolean = false;
  export let on_select: (index: number) => void = () => {};

  let filters = getContext<Writable<any[]>>("table_filters");
  let is_visible = true;
  $: {
    is_visible = true;
    for (let i = 0; i < entries.length; i++) {
      if ($filters[i] === "") continue;

      let _temp_state = false;
      const split_filter = $filters[i].split(";|").filter((str: string) => str !== "") as string[];
      for (let j = 0; j < split_filter.length; j++) {
        if (entries[i].toLowerCase().includes(split_filter[j].toLowerCase())) {
          _temp_state = true;
        }
      }

      if (!_temp_state) {
        is_visible = false;
        break;
      }
    }
  }
  
  let values = getContext<Writable<string[][]>>("table_values");
  $: {
    for (let i = 0; i < entries.length; i++) {
      if (!$values[i].find(val => val.toLowerCase() === entries[i].toLowerCase())) {
        $values[i].push(entries[i]);
      }
    }
  }

  function on_selected() {
    on_select(index);
  }
</script>

{#if is_visible}
<tr on:click={on_selected} class={`${!error ? "even:bg-cscol-400 odd:bg-cscol-500 hover:bg-cscol-100" : "bg-errcol-100"} hover:cursor-pointer`}>
  {#if !custom}
    {#each entries as entry}
      <td class="pl-2 text-base font-normal">
        {entry}
      </td>
    {/each}
  {:else}
    <slot />
  {/if}
</tr>
{/if}