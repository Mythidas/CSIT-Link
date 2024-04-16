<script lang="ts">
    import { dev } from '$app/environment';
  import FilteredTable from '$lib/components/table/filtered_table.svelte';
  import { boolean_sort_with_invalid } from '$lib/helpers/hp_sorters';
  import { get_time_since } from '$lib/helpers/hp_time';
  import type { APIResponse } from '$lib/interfaces/i_api_response';
  import type { Device } from '$lib/interfaces/i_db';
  import { current_site } from '$lib/stores.js';

  export let data: { devices: Device[] };

  let loading = false;
  
  $: row_data = get_row_data(data.devices);
  $: mismatches = data.devices?.filter(dev => (!dev.av_id && has_av()) || (!dev.rmm_id && has_rmm())).length || 0;
  $: rmm_device_count = data.devices?.filter(dev => dev.rmm_id !== "").length || 0;
  $: av_device_count = data.devices?.filter(dev => dev.av_id !== "").length || 0;
  $: healthy_devices = data.devices?.filter(device => {
    const missing_agents = (has_rmm() && device.rmm_id === "") || (has_av() && device.av_id === "");
      
    const now = Date.now();
    const rmm_hb = new Date(device.rmm_last_heartbeat).getTime();
    const av_hb = new Date(device.av_last_heartbeat).getTime();
    const stale_agents = (has_rmm() && (now - rmm_hb) > 2505600 * 1000) || (has_av() && (now - av_hb) > 2505600 * 1000);
    
    return !(missing_agents || stale_agents);
  }).length || 0;

  function has_rmm() {
    return $current_site?.rmm_id !== "";
  }

  function has_av() {
    return $current_site?.av_id !== "";
  }
  
  async function realtime_reload() {
    loading = true;
    const temp_data = data.devices;
    data.devices = [];
    try {
      const res = await fetch("/api/v1/devices", {
        headers: {
          "site-id": $current_site?.site_id.toString() || ""
        }
      });
      const res_data = await res.json() as APIResponse;

      if (res.ok) {
        data.devices = res_data.data;
        row_data = res_data.data;
      }
    } catch (err) {
      console.log(err);
      data.devices = temp_data;
    }
    loading = false;
  }

  function get_force_warn_rmm(device: Device) {
    const rmm_hb = new Date(device.rmm_last_heartbeat).getTime();
    return (Date.now() - rmm_hb) > 2505600 * 1000;
  }

  function get_force_warn_av(device: Device) {
    const av_hb = new Date(device.av_last_heartbeat).getTime();
    return (Date.now() - av_hb) > 2505600 * 1000;
  }

  function get_healthy(device: Device) {
    if (!$current_site?.rmm_id || !$current_site.av_id) return "YES";
    return device.rmm_id === "" || device.av_id === "" ? "NO" : "YES";
  }

  function get_rmm(device: Device) {
    if (has_rmm()) {
      return device.rmm_id ? "YES" : "NO";
    }
    return "N/A";
  }

  function get_av(device: Device) {
    if (has_av()) {
      return device.av_id ? "YES" : "NO";
    }
    return "N/A";
  }

  function get_row_data(devices: Device[]) {
    return devices.map((device) => {
      return {
        cells: [
          { value: device.title }, 
          { value: get_healthy(device) },
          { value: get_rmm(device), force_warn: get_force_warn_rmm(device) },
          { value: get_av(device), force_warn: get_force_warn_av(device)  },
          { value: device.os_type }
        ]
      };
    });
  }
</script>

<div class="flex flex-col w-full h-full space-y-3">
  <div class="flex flex-col w-full p-3 rounded-sm space-y-2 bg-cscol-400">
    <div class="flex space-x-3 text-3xl">
      <h3>{$current_site?.title}</h3>
      <button on:click={realtime_reload} disabled={loading}>
        <svg class={`${loading && "animate-spin-slow"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </button>
    </div>
    <div class="flex w-full justify-between">
      <div class="flex space-x-1">
        <p class="p-2 text-xl bg-cscol-000">Healthy Devices: {healthy_devices}</p>
        <p class="p-2 text-xl bg-cscol-000">Unique Devices: {data.devices?.length}</p>
        <p class={`p-2 text-xl ${mismatches ? "bg-errcol-100" : "bg-cscol-000"}`}>Matching Devices: {(data.devices?.length || 0) - mismatches}</p>
      </div>
      <div class="flex space-x-1">
        <p class="p-2 text-xl bg-cscol-000">Last Sync: {get_time_since($current_site?.last_update || "")}</p>
      </div>
    </div>
  </div>
  <div class="flex flex-col w-full h-5/6 p-3 rounded-sm bg-cscol-400">
    <FilteredTable 
      columns={[
        { label: "Name", filter: "Text" },
        { label: "Healthy", filter: "Select", tooltip: "Agent in both VSAX and Sophos", error_value: "NO", custom_sort: boolean_sort_with_invalid },
        { label: `VSAX (${rmm_device_count})`, filter: "Select", tooltip: "Agent in VSAX site", error_value: "NO", custom_sort: boolean_sort_with_invalid },
        { label: `Sophos (${av_device_count})`, filter: "Select", tooltip: "Agent in Sophos site", error_value: "NO", custom_sort: boolean_sort_with_invalid },
        { label: "OS", filter: "Select" }
      ]}
      data={row_data}
    >
    </FilteredTable>
  </div>
</div>