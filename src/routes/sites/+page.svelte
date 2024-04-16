<script lang="ts">
  import { goto } from "$app/navigation";
  import FilteredTable, { type RowData } from "$lib/components/table/filtered_table.svelte";
  import type { Company } from "$lib/interfaces/i_db";
  import { all_sites, current_site } from "$lib/stores";

  export let data: { companies: Company[] };

  function select_site(row: RowData) {
    $current_site = row.storage;

    goto(`/sites/overview/${row.storage.site_id}`);
  }

  function get_row_data() {
    return $all_sites.map((site) => {
      return {
        cells: [
          { value: site.site_id.toString() }, 
          { value: site.title },
          { value: data.companies.filter((comp) => site.company_id === comp.company_id)[0]?.title || "None" },
        ],
        storage: site
      };
    });
  }
</script>

<div class="flex w-full h-full">
  <div class="flex flex-col w-full h-full p-3 bg-cscol-400">
    <h3 class="flex text-2xl font-bold p-1 mb-3">
      All Sites <p class="px-2 ml-3 bg-cscol-000 rounded-md">{$all_sites.length}</p>
    </h3>
    <FilteredTable 
      columns={[
        { label: "ID", filter: "Text" },
        { label: "Name", filter: "Text" },
        { label: "Company", filter: "Text" },
      ]}
      data={get_row_data()}
      on_select_row={select_site}
    >
    </FilteredTable>
  </div>
</div>