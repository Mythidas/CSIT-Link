<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  export let entries: string[];
  export let custom: boolean = false;
  export let on_select: (entry: string) => void = () => {};

  let filters = getContext<Writable<any[]>>("table_filters");
  let is_hidden = false;
  $: {
    let _temp = false;

    for (let i = 0; i < entries.length; i++) {
      if (!entries[i].toLowerCase().includes($filters[i].toLowerCase())) {
        _temp = true;
      }
    }

    is_hidden = _temp;
  }

  function on_selected(entry: string) {
    on_select(entry);
  }
</script>

{#if !is_hidden}
<tr class={`even:bg-cscol-400 odd:bg-cscol-500 hover:bg-cscol-100 hover:cursor-pointer`}>
  {#if !custom}
    {#each entries as entry}
      <td class="pl-2">
        <button on:click={() => on_selected(entry)}>{entry}</button>
      </td>
    {/each}
  {:else}
    <slot />
  {/if}
</tr>
{/if}