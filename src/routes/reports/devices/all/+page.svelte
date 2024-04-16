<script lang="ts">
  import FilteredTable from "$lib/components/table/filtered_table.svelte";
  import { boolean_sort_with_invalid, time_since_sort } from "$lib/helpers/hp_sorters";
  import { get_time_since } from "$lib/helpers/hp_time";
  import type { Device, Site } from "$lib/interfaces/i_db";
  import { all_sites } from "$lib/stores";

  export let data: { devices: Device[] };

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

  function has_rmm(site: Site | undefined) {
    return site?.rmm_id !== "";
  }

  function has_av(site: Site | undefined) {
    return site?.av_id !== "";
  }

  function get_row_data() {
    return data.devices.map((device) => {
      const site = $all_sites.find(site => site.site_id === device.site_id);
      return {
        cells: [
          { value: device.title },
          { value: site?.title || "" },
          { value: device.os },
          { value: has_rmm(site) ? get_time_since(device.rmm_last_heartbeat) : "N/A" },
          { value: has_av(site) ? get_time_since(device.av_last_heartbeat) : "N/A" },
          { value: get_firewall_entry(device) },
          { value: get_tamper_prot_entry(device) }
        ]
      };
    });
  }
</script>

<div class="flex flex-col w-full h-full p-3 bg-cscol-400">
  <div class="w-fit text-2xl mb-2 bg-cscol-000 p-2">
    Devices: {data.devices.length}
  </div>
  <FilteredTable
    columns={[
      { label: "Name", filter: "Text" },
      { label: "Site", filter: "Text" },
      { label: "OS", filter: "Text" },
      { label: "VSA Last Seen", filter: "Text", tooltip: "Time since VSA Agent responded", error_value: "Never", custom_warn: custom_date_warn, custom_sort: time_since_sort },
      { label: "Sophos Last Seen", filter: "Text", tooltip: "Time since Sophos Agent responded", error_value: "Never", custom_warn: custom_date_warn, custom_sort: time_since_sort },
      { label: "Windows Firewall", filter: "Select", tooltip: "Is Windows Firewall Enabled. Source: VSA", custom_sort: boolean_sort_with_invalid },
      { label: "Tamper Protection", filter: "Select", tooltip: "Is Tamper Protection Enabled. Source: Sophos", custom_sort: boolean_sort_with_invalid },
  ]}
    data={get_row_data()}
  />
</div>