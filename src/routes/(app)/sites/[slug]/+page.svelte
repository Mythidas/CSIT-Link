<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Site } from "$lib/interfaces/i_db";
  import DeviceTable from "$lib/prefabs/device_table.svelte";

  export let data: { site: Site, total_devices: number, av_devices: number, rmm_devices: number };

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
<div class="flex space-x-2 w-full h-fit p-2 text-xl bg-base-200">
  <p class="border-b-2 border-accent-100 p-1">Total Devices: {data.total_devices}</p>
  <p class="border-b-2 border-accent-100 p-1">Sophos Devices: {data.av_devices}</p>
  <p class="border-b-2 border-accent-100 p-1">VSA Devices: {data.rmm_devices}</p>
</div>
<div class="flex flex-col w-full h-full p-2 bg-base-200 overflow-hidden">
  <DeviceTable bind:selected_row site_id={site_id} bind:filtered_data/>
</div>