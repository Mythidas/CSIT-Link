<script lang="ts">
  import FilteredRow from "$lib/components/table/filtered_row.svelte";
import FilteredTable from "$lib/components/table/filtered_table.svelte";
import type { Patch } from "$lib/interfaces/i_db";

  export let data: { patches: Patch[] };
</script>

<div class="mx-auto w-3/5 bg-cscol-400 text-center text-3xl font-bold py-8 rounded-sm">
  Welcome to CSIT Link
</div>

<div class="mx-auto my-2 w-3/5 h-2/4 bg-cscol-400 text-center text-3xl font-bold py-3 rounded-sm">
  Recent Patch Notes
  <div class="flex flex-col overflow-y-auto h-full p-3">
  <FilteredTable columns={[
    { label: "Major", filter: "Select" },
    { label: "Minor", filter: "Select" },
    { label: "Build", filter: "Select" },
    { label: "Description", filter: "Text" }
  ]}>
    {#each data.patches as patch, index}
      <FilteredRow
        entries={[
          patch.major.toString(),
          patch.minor.toString(),
          patch.build.toString(),
          patch.description
        ]}
        index={index}
      />
    {/each}
  </FilteredTable>
  </div>
</div>