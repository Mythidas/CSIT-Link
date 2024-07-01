<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Site } from "$lib/interfaces/i_db";
  import DeviceTable from "$lib/prefabs/device_table.svelte";

  export let data: { site: Site };

  let filtered_data: any[];
  let selected_row: number;

  $: site_id = data.site.site_id;
  $: if (selected_row > -1) {
    goto(`/sites/${site_id}/${filtered_data[selected_row].device_id}`);
  }
</script>

<h3 class="flex space-x-2 text-2xl p-2 bg-base-200">
  <a href="/sites" class="hover:underline">Sites</a>
  <p>{">"}</p>
  <p>{data.site.title}</p>
</h3>
<div class="flex flex-col w-full h-full p-2 bg-base-200 overflow-hidden">
  <DeviceTable bind:selected_row site_id={site_id}/>
</div>