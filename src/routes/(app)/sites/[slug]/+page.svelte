<script lang="ts">
  import Table from "$lib/components/table.svelte";
  import type { Device, Site } from "$lib/interfaces/i_db";

  export let data: { site: Site, devices: Device[] };

  let total_items = data.devices.length;
  let page = 1;
  let count = 25;
</script>

<h3 class="flex space-x-2 text-2xl p-2 bg-base-200">
  <a href="/sites">Sites</a>
  <p>{">"}</p>
  <p>{data.site.title}</p>
</h3>
<div class="flex flex-col w-full h-full p-2 bg-base-200">
  <Table
    columns={[
      { key: "title", label: "Name" },
    ]}
    data={data.devices}
    filters={[
      {
        name: "Device",
        filters: [
          { name: "Name", key: "title", type: "Text" },
        ]
      }
    ]}
    bind:total_items
    bind:page
    bind:count
  />
</div>