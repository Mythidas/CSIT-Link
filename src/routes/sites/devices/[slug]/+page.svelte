<script lang="ts">
  import FilteredTable from "$lib/components/table/filtered_table.svelte";
  import { boolean_sort_with_invalid, time_since_sort } from "$lib/helpers/hp_sorters";
  import { get_time_since } from "$lib/helpers/hp_time";
  import type { Device } from "$lib/interfaces/i_db";
  import { current_site } from "$lib/stores";

  export let data: { devices: Device[] }

  let loading = false;

  $: row_data = get_row_data(data.devices);

  function get_row_data(devices: Device[]) {
    return devices.map((device) => {
      return {
        cells: [
          { value: device.title },
          { value: device.os },
          { value: get_time_since(device.rmm_last_heartbeat) },
          { value: get_time_since(device.av_last_heartbeat) },
          { value: get_firewall_entry(device) },
          { value: get_tamper_prot_entry(device) }
        ]
      };
    });
  }

  function get_firewall_entry(device: Device) {
    if (!device.rmm_id) {
      return "N/A"
    } else {
      return device.firewall_enabled ? "YES" : "NO";
    }
  }

  function get_tamper_prot_entry(device: Device) {
    if (!device.av_id) {
      return "N/A"
    } else {
      return device.tamp_prot_enabled ? "YES" : "NO";
    }
  }

  function custom_date_warn(value: string) {
    return value.includes("days") && parseInt(value) >= 30;
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
      const res_data = await res.json();

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
</script>

<div class="flex-col h-full space-y-2">
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
  </div>
  <div class="w-full h-5/6 p-3 bg-cscol-400">
    <FilteredTable 
      columns={[
        { label: "Name", filter: "Text" },
        { label: "OS", filter: "Text" },
        { label: "VSA Last Seen", filter: "Text", tooltip: "Time since VSA Agent responded", error_value: "Never", custom_warn: custom_date_warn, custom_sort: time_since_sort },
        { label: "Sophos Last Seen", filter: "Text", tooltip: "Time since Sophos Agent responded", error_value: "Never", custom_warn: custom_date_warn, custom_sort: time_since_sort },
        { label: "Windows Firewall", filter: "Select", tooltip: "Is Windows Firewall Enabled. Source: VSA", custom_sort: boolean_sort_with_invalid },
        { label: "Tamper Protection", filter: "Select", tooltip: "Is Tamper Protection Enabled. Source: Sophos", custom_sort: boolean_sort_with_invalid },
      ]}
      data={row_data}
    >
    </FilteredTable>
  </div>
</div>