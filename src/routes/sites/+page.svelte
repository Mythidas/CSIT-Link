<script lang="ts">
  import { goto } from "$app/navigation";
  import FilteredRow from "$lib/components/table/filtered_row.svelte";
  import FilteredTable from "$lib/components/table/filtered_table.svelte";
  import type { Company, Site } from "$lib/interfaces/i_db";
  import { current_site } from "$lib/stores";

  export let data: { sites: Site[], companies: Company[] };

  function select_site(index: number) {
    $current_site = data.sites[index];
    goto(`/sites/overview/${data.sites[index].site_id}`);
  }
</script>

<div class="flex w-full h-full">
  <div class="flex flex-col w-full h-full p-3 bg-cscol-400">
    <h3 class="flex text-2xl font-bold p-1 mb-3">
      All Sites <p class="px-2 ml-3 bg-cscol-000 rounded-md">{data.sites.length}</p>
    </h3>
    <FilteredTable columns={["ID", "Name", "Company"]}>
      {#each data.sites as site, index}
        <FilteredRow
          index={index}
          entries={[
            site.site_id.toString(),
            site.title,
            data.companies.filter((comp) => site.company_id === comp.company_id)[0]?.title || "None"
          ]}
          on_select={select_site}
        />
      {/each}
    </FilteredTable>
  </div>
</div>