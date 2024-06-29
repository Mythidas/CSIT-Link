<script lang="ts">
  import Table from "$lib/components/table.svelte";

  let total_items = 1;
  let filtered_data: any[];
  let selected_row: number;

  $: if (filtered_data) {
    for (let i = 0; i < filtered_data.length; i++) {
      filtered_data[i].error = [];
      filtered_data[i].warn = [];

      if (!filtered_data[i]["heartbeat_av"]) {
        filtered_data[i].error = ["heartbeat_av", ...filtered_data[i].error];
      } else if (!filtered_data[i]["heartbeat_rmm"]) {
        filtered_data[i].error = ["heartbeat_rmm", ...filtered_data[i].error];
      } else if (new Date(filtered_data[i]["heartbeat_av"]).getTime() <= new Date(Date.now()).getTime() - 1000 * 3600 * 24 * 20) {
        filtered_data[i].warn = ["heartbeat_av", ...filtered_data[i].warn];
      } else if (new Date(filtered_data[i]["heartbeat_rmm"]).getTime() <= new Date(Date.now()).getTime() - 1000 * 3600 * 24 * 20) {
        filtered_data[i].warn = ["heartbeat_rmm", ...filtered_data[i].warn];
      }
    }
  }
</script>

<div class="flex w-full h-full p-2 bg-base-200">
  <Table
    columns={[
      { key: "hostname", name: "Name", group: "Device", default: "-", type: "Text" },
      { key: "title", name: "Site", group: "Site", default: "-", type: "Text" },
      { key: "company_title", name: "Company", group: "Company", default: "-", type: "Text" },
      { key: "os", name: "OS", group: "Device", default: "-", type: "Text" },
      { key: "heartbeat_rmm", name: "VSA Heartbeat", group: "DeviceRMM", default: "-", type: "Date" },
      { key: "heartbeat_av", name: "Sophos Heartbeat", group: "DeviceAV", default: "-", type: "Date" },
      { key: "ipv4", name: "LAN", group: "Device", default: "-", type: "Text" },
      { key: "wan", name: "WAN", group: "Device", default: "-", type: "Text" },
      { key: "tamper", name: "Tamper Protection", group: "DeviceAV", default: "-", type: "Bool" },
      { key: "health", name: "Sophos Health", group: "DeviceAV", default: "-", type: "Text" },
      { key: "memory", name: "Memory Total", group: "DeviceRMM", default: "-", type: "Number" },
      { key: "uac", name: "UAC Enabled", group: "DeviceRMM", default: "-", type: "Bool" },
      { key: "firewall", name: "Windows Firewall", group: "DeviceRMM", default: "-", type: "Bool" },
    ]}
    data={`/api/v2/devices`}
    bind:total_items
    page={1}
    count={25}
    bind:filtered_data
    bind:selected_row
    sticky_first
  />
</div>