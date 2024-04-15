<script lang="ts">
  import FilteredTable, { boolean_sort_with_invalid, type CellData, type SortState } from "$lib/components/table/filtered_table.svelte";
    import { get_time_since, time_since_sort } from "$lib/helpers/hp_time";
  import type { Device } from "$lib/interfaces/i_db";

  export let data: { devices: Device[] }

  function get_row_data() {
    return data.devices.map((device) => {
      return {
        cells: [
          { value: device.title },
          { value: device.os },
          { value: get_time_since(device.rmm_last_heartbeat) },
          { value: get_time_since(device.av_last_heartbeat) },
          { value: get_firewall_entry(device), error_value: "" },
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
</script>

<div class="w-full h-full p-3 bg-cscol-400">
  <FilteredTable 
    columns={[
      { label: "Name", filter: "Text" },
      { label: "OS", filter: "Text" },
      { label: "VSA Last Seen", filter: "Text", tooltip: "Time since VSA Agent responded", custom_sort: time_since_sort },
      { label: "Sophos Last Seen", filter: "Text", tooltip: "Time since Sophos Agent responded", custom_sort: time_since_sort },
      { label: "Windows Firewall", filter: "Select", tooltip: "Is Windows Firewall Enabled. Source: VSA", custom_sort: boolean_sort_with_invalid },
      { label: "Tamper Protection", filter: "Select", tooltip: "Is Tamper Protection Enabled. Source: Sophos", custom_sort: boolean_sort_with_invalid },
    ]}
    data={get_row_data()}
  >
  </FilteredTable>
</div>