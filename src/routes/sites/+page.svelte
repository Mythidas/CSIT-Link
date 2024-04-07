<script lang="ts">
  import FilteredRow from "$lib/components/table/filtered_row.svelte";
import FilteredTable from "$lib/components/table/filtered_table.svelte";
import type { Company, Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[], companies: Company[] };

  let selected_company: Company | null = null;

  function select_company(company: Company) {
    selected_company = company;
  }

  function select_site(site: Site) {

  }
</script>

<div class="flex w-full h-full">
  <!-- Sites -->
  <div class="flex flex-col w-full h-full p-3 bg-cscol-400">
    <h3 class="flex text-2xl font-bold p-1 mb-3">
      All Sites <p class="px-2 ml-3 bg-cscol-000 rounded-md">{data.sites.length}</p>
    </h3>
    <FilteredTable columns={["ID", "Name", "Company"]}>
      {#each data.sites as site}
        <FilteredRow 
          entries={[
            site.site_id.toString(),
            site.title,
            data.companies.filter((comp) => site.company_id === comp.company_id)[0]?.title || ""
          ]}
        />
      {/each}
    </FilteredTable>
    <!-- <table class="table-auto w-full h-fit text-left overflow-y-scroll">
      <thead class="border-b-2 border-cscol-200 text-lg">
        <tr>
          <th class="pl-1">ID</th>
          <th>Name</th>
          <th>Company</th>
        </tr>
      </thead>
      <tbody class="text-base">
        {#each data.sites as site}
          <tr
            on:click={() => select_site(site)}
            class={`even:bg-cscol-400 odd:bg-cscol-500 hover:bg-cscol-100 hover:cursor-pointer`}
          >
            <td class="pl-1">{site.site_id}</td>
            <td>{site.title}</td>
            <td>{data.companies.filter((comp) => site.company_id === comp.company_id)[0]?.title || ""}</td>
          </tr>
        {/each}
      </tbody>
    </table> -->
  </div>
</div>