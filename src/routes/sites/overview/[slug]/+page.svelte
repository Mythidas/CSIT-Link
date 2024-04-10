<script lang="ts">
  import FilteredRow from '$lib/components/table/filtered_row.svelte';
  import FilteredTable from '$lib/components/table/filtered_table.svelte';
  import type { APIResponse } from '$lib/interfaces/i_api_response';
  import type { Device, Site } from '$lib/interfaces/i_db';
  import { current_site } from '$lib/stores.js';

  export let data: { site: Site, devices: Device[] };

  let loading = false;
  
  $: mismatches = data.devices?.filter(dev => dev.av_id === "" || dev.rmm_id === "").length || 0;
  $: {
    $current_site = data.site || null;
  }

  async function realtime_reload() {
    loading = true;
    const temp_data = data.devices;
    data.devices = [];
    try {
      const res = await fetch("/api/v1/devices", {
        headers: {
          "site-id": data.site.site_id.toString()
        }
      });
      const res_data = await res.json() as APIResponse;

      if (res.ok) {
        data.devices = res_data.data;
      }
    } catch (err) {
      console.log(err);
      data.devices = temp_data;
    }
    loading = false;
  }
</script>

<div class="flex flex-col w-full h-full space-y-3">
  <div class="flex flex-col w-full p-3 rounded-sm bg-cscol-400">
    <div class="flex space-x-3 text-2xl font-bold">
      <h3>{$current_site?.title}</h3>
      <button on:click={realtime_reload} disabled={loading}>
        <svg class={`${loading && "animate-spin-slow"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </button>
    </div>
    <div class="flex space-x-1 mt-2">
      <p class="p-2 text-xl bg-cscol-000">Unique Devices: {data.devices?.length}</p>
      <p class={`p-2 text-xl ${mismatches ? "bg-errcol-100" : "bg-cscol-000"}`}>Matching Devices: {(data.devices?.length || 0) - mismatches}</p>
    </div>
  </div>
  <!-- columns={["Name", "Healthy", "VSAX", "Sophos", "OS"] -->
  <div class="flex flex-col w-full h-full p-3 rounded-sm bg-cscol-400">
    <FilteredTable columns={[
      {label: "Name", filter: "Text"},
      {label: "Healthy", filter: "Select"},
      {label: "VSAX", filter: "Select"},
      {label: "Sophos", filter: "Select"},
      {label: "OS", filter: "Select"}
    ]}>
      {#each data.devices as device, index}
        <FilteredRow
          index={index}
          entries={[
            device.title, 
            device.rmm_id === "" || device.av_id === "" ? "NO" : "YES", 
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