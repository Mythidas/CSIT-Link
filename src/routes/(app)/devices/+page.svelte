<script lang="ts">
  import Table from "$lib/components/table.svelte";

  let total_items = 1;
  let page = 1;
  let count = 25;
</script>

<div class="flex flex-col w-full h-full p-2 bg-base-200">
  <Table
    columns={[
      { key: "hostname", name: "Name", group: "Device", default: "-", type: "Text" },
      { key: "title", name: "SIte", group: "Site", default: "-", type: "Text" },
      { key: "os", name: "OS", group: "Device", default: "-", type: "Text" },
      { key: "ipv4", name: "LAN", group: "Device", default: "-", type: "Text" },
      { key: "wan", name: "WAN", group: "Device", default: "-", type: "Text" },
      { key: "heartbeat_rmm", name: "VSA Heartbeat", group: "DeviceRMM", default: "-", type: "Date" },
      { key: "firewall", name: "Windows Firewall", group: "DeviceRMM", default: "-", type: "Bool" },
      { key: "uac", name: "UAC Enabled", group: "DeviceRMM", default: "-", type: "Bool" },
      { key: "memory", name: "Memory Total", group: "DeviceRMM", default: "-", type: "Number" },
      { key: "heartbeat_av", name: "Sophos Heartbeat", group: "DeviceAV", default: "-", type: "Date" },
      { key: "tamper", name: "Tamper Protection", group: "DeviceAV", default: "-", type: "Bool" },
      { key: "health", name: "Sophos Health", group: "DeviceAV", default: "-", type: "Text" },
    ]}
    data={`/api/v2/devices`}
    bind:total_items
    bind:page
    bind:count
  />
</div>