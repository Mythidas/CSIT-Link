<script lang="ts">
  import FilteredRow from '$lib/components/table/filtered_row.svelte';
import FilteredTable from '$lib/components/table/filtered_table.svelte';
    import type { Device, Site } from '$lib/interfaces/i_db';
  import { current_site } from '$lib/stores.js';

  export let data: { site: Site, devices: Device[] };

  const mismatches = data.devices?.filter(dev => dev.av_id === "" || dev.rmm_id === "").length || 0;

  $: {
    $current_site = data.site || null;
  }
</script>

<div class="flex flex-col w-full h-full space-y-3">
  <div class="flex flex-col w-full p-3 rounded-sm bg-cscol-400">
    <h3 class="text-2xl font-bold">{$current_site?.title}</h3>
    <div class="flex space-x-1 mt-2">
      <p class="p-2 text-xl bg-cscol-000">Unique Devices: {data.devices?.length}</p>
      <p class="p-2 text-xl bg-cscol-000">Matching Devices: {(data.devices?.length || 0) - mismatches}</p>
    </div>
  </div>
  <div class="flex flex-col w-full h-full p-3 rounded-sm bg-cscol-400">
    <FilteredTable columns={["Name", "VSAX", "Sophos", "OS"]}>
      {#each data.devices as device, index}
        <FilteredRow
          index={index}
          entries={[
            device.title,
            device.rmm_id !== "" ? "YES" : "NO",
            device.av_id !== "" ? "YES" : "NO",
            device.os
          ]}
          error={device.rmm_id === "" || device.av_id === ""}
        />
      {/each}
    </FilteredTable>
  </div>
</div>