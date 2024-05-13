<script lang="ts">
  import FilteredTable from "$lib/components/table/filtered_table.svelte";
  import type { Patch } from "$lib/interfaces/i_db";

  export let data: { patches: Patch[] };

  function get_row_data() {
    return data.patches.map((patch) => {
      return {
        cells: [
          { value: patch.major.toString() }, 
          { value: patch.minor.toString() },
          { value: patch.build.toString() },
          { value: patch.description },
        ]
      };
    });
  }
</script>

<div class="mx-auto w-3/5 bg-cscol-400 text-center text-3xl font-bold py-8 rounded-sm">
  Welcome to CSIT Tools
</div>

<div class="mx-auto my-2 w-3/5 h-2/4 bg-cscol-400 text-center text-3xl font-bold py-3 rounded-sm">
  Recent Patch Notes
  <div class="flex flex-col overflow-y-auto h-full p-3">
  <FilteredTable 
    columns={[
      { label: "Major", filter: "Select" },
      { label: "Minor", filter: "Select" },
      { label: "Build", filter: "Select" },
      { label: "Description", filter: "Text", sortable: false }
    ]}
    data={get_row_data()}
  >
  </FilteredTable>
  </div>
</div>