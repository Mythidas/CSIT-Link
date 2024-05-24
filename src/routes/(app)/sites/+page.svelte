<script lang="ts">
  import { goto } from "$app/navigation";
  import Table from "$lib/components/table.svelte";
  import type { Company, Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[], companies: Company[] };

  let total_items = data.sites.length;
  let page = 1;
  let count = 25;

  function get_row_data() {
    let sites_merge = [];
    for (let i = 0; i < data.sites.length; i++) {
      const company = data.companies.find(comp => { return comp.company_id === data.sites[i].company_id });
      sites_merge.push({ company: company?.title || "(None)", ...data.sites[i] });
    }

    return sites_merge;
  }
</script>

<div class="flex w-full h-full">
  <div class="flex flex-col w-full h-full p-3 bg-base-200">
    <h3 class="flex text-2xl font-bold p-1 mb-3">
      All Sites <p class="px-2 ml-3 bg-accent-100 rounded-md">{data.sites.length}</p>
    </h3>
    <Table
      columns={[
        { key: "title", label: "Name" },
        { key: "company", label: "Company" }
      ]}
      data={get_row_data()}
      filters={[
        {
          name: "Site",
          filters: [
            { name: "Name", key: "title", type: "Text" },
            { name: "Company", key: "company", type: "Text" },
          ]
        }
      ]}
      bind:total_items
      bind:page
      bind:count
      on:select_row={(data) => { goto(`/sites/overview/${data.detail.site_id}`) }}
    />
  </div>
</div>