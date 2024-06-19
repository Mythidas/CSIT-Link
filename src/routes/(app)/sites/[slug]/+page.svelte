<script lang="ts">
  import { goto } from "$app/navigation";
  import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { site: Site };

  let total_items = 1;
  let page = 1;
  let count = 25;
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
  <Table
    columns={[
      { key: "hostname", name: "Name", group: "Device", default: "-", type: "Text" },
      { key: "os", name: "OS", group: "Device", default: "-", type: "Text" },
      { key: "ipv4", name: "LAN", group: "Device", default: "-", type: "Text" },
      { key: "wan", name: "WAN", group: "Device", default: "-", type: "Text" },
      { key: "heartbeat_rmm", name: "VSA Heartbeat", group: "DeviceRMM", default: "-", type: "Date" },
      { key: "firewall", name: "Windows Firewall", group: "DeviceRMM", default: "-", type: "Bool" },
      { key: "uac", name: "UAC Enabled", group: "DeviceRMM", default: "-", type: "Bool" },
      { key: "memory", name: "Memory Total", group: "DeviceRMM", default: "-", type: "Text" },
      { key: "heartbeat_av", name: "Sophos Heartbeat", group: "DeviceAV", default: "-", type: "Date" },
      { key: "tamper", name: "Tamper Protection", group: "DeviceAV", default: "-", type: "Bool" },
      { key: "health", name: "Sophos Health", group: "DeviceAV", default: "-", type: "Text" },
    ]}
    data={`/api/v2/devices/${site_id}`}
    bind:total_items
    bind:page
    bind:count
    bind:filtered_data
    bind:selected_row
  />
</div>