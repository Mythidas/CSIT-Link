<script lang="ts">
  import FilteredRow from "$lib/components/table/filtered_row.svelte";
  import FilteredTable from "$lib/components/table/filtered_table.svelte";
  import type { Device, Site } from "$lib/interfaces/i_db";

  export let data: { devices: Device[] }
  console.log(data.devices)

  function get_time_since(date_string: string): string {
    const date = new Date(date_string);
    const now = new Date();
    console.log(`${date.toUTCString()} | ${now.toUTCString()}`)
    const diff_in_seconds = (now.getTime() - date.getTime()) / 1000;

    if (diff_in_seconds >= 86400) { // Check if at least a day has passed
      const days_ago = Math.floor(diff_in_seconds / 86400);
      return `${days_ago} days ago`;
    } else if (diff_in_seconds <= 3600) {
      return "Now";
    } else if(isNaN(diff_in_seconds)) {
      return "Never"
    } else {
      const hours_ago = Math.floor(diff_in_seconds / 3600);
      return `${hours_ago} hours ago`; 
    }
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
  <FilteredTable columns={[
    { label: "Name", filter: "Text" },
    { label: "OS", filter: "Text" },
    { label: "VSA Last Seen", filter: "Text", tooltip: "Time since VSA Agent responded" },
    { label: "Sophos Last Seen", filter: "Text", tooltip: "Time since Sophos Agent responded" },
    { label: "Windows Firewall", filter: "Select", tooltip: "Is Windows Firewall Enabled. Source: VSA" },
    { label: "Tamper Protection", filter: "Select", tooltip: "Is Tamper Protection Enabled. Source: Sophos" },
  ]}>
    {#each data.devices as device, index}
      <FilteredRow
        entries={[
          device.title,
          device.os,
          get_time_since(device.rmm_last_heartbeat),
          get_time_since(device.av_last_heartbeat),
          get_firewall_entry(device),
          get_tamper_prot_entry(device)
        ]}
        index={index}
      />
    {/each}
  </FilteredTable>
</div>