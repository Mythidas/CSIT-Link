<script lang="ts">
  import { goto } from "$app/navigation";
  import Table from "$lib/components/table.svelte";
  
  let total_items = 1;
  let page = 1;
  let count = 25;
</script>

<h3 class="flex text-2xl p-2 bg-base-200">
  All Sites <p class="px-2 ml-2 bg-accent-100 rounded-md">{total_items}</p>
</h3>
<div class="flex flex-col w-full h-full p-2 bg-base-200">
  <Table
    columns={[
      { key: "title", label: "Name", group: "Site" },
      { key: "company_title", label: "Company", group: "Company", default: "-" }
    ]}
    data="/api/v2/sites"
    filters={[
      {
        name: "Site",
        filters: [
          { name: "Name", key: "title", type: "Text" },
        ]
      },
      {
        name: "Company",
        filters: [
          { name: "Name", key: "title", type: "Text" }
        ]
      }
    ]}
    bind:total_items
    bind:page
    bind:count
    on:select_row={(data) => { goto(`/sites/${data.detail.site_id}`) }}
  />
</div>