<script lang="ts">
  import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { site: Site, page: number, count: number };

  let total_items = 1;
  let page = data.page;
  let count = data.count;
</script>

<h3 class="flex space-x-2 text-2xl p-2 bg-base-200">
  <a href="/sites">Sites</a>
  <p>{">"}</p>
  <p>{data.site.title}</p>
</h3>
<div class="flex flex-col w-full h-full p-2 bg-base-200 overflow-hidden">
  <Table
    columns={[
      { key: "hostname", label: "Name" },
    ]}
    data={`/api/v2/devices/${data.site.site_id}`}
    filters={[
      {
        name: "Device",
        filters: [
          { name: "Name", key: "hostname", type: "Text" },
        ]
      }
    ]}
    bind:total_items
    bind:page
    bind:count
  />
</div>