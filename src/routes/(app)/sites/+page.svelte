<script lang="ts">
  import { goto } from "$app/navigation";
  import Table from "$lib/components/table.svelte";
  
  let total_items = 0;
  let page = 1;
  let count = 25;
  let filtered_data: any[];
  let selected_row: number;

  $: if (selected_row > -1) {
    goto(`/sites/${filtered_data[selected_row].site_id}`);
  }
</script>

<h3 class="flex text-2xl p-2 bg-base-200">
  All Sites <p class="px-2 ml-2 bg-accent-100 rounded-md">{total_items}</p>
</h3>
<div class="flex flex-col w-full h-[99%] p-2 bg-base-200 overflow-hidden">
  <Table
    columns={[
      { key: "title", name: "Name", group: "Site", type: "Text" },
      { key: "company_title", name: "Company", group: "Company", type: "Text", default: "-" },
      { key: "device_tally", name: "Devices", group: "", type: "Number", default: "-"}
    ]}
    data="/api/v2/sites"
    bind:total_items
    bind:page
    bind:count
    bind:filtered_data
    bind:selected_row
    on:select_row={(data) => { goto(`/sites/${data.detail.site_id}`) }}
  />
</div>