<script lang="ts">
  import Table from "$lib/components/table.svelte";

  let total_items = 1;
  let page = 1;
  let count = 25;
</script>

<div class="flex flex-col w-full h-full p-2 bg-base-200 overflow-hidden">
  <Table
    columns={[
      { key: "hostname", label: "Name", group: "Device" },
      { key: "heartbeat_rmm", label: "VSA Heartbeat", group: "DeviceRMM", default: "-", type: "Date" },
      { key: "firewall", label: "Windows Firewall", group: "DeviceRMM", default: "-", type: "Bool" },
      { key: "uac", label: "UAC Enabled", group: "DeviceRMM", default: "-", type: "Bool" },
      { key: "memory", label: "Memory Total", group: "DeviceRMM", default: "-" },
      { key: "heartbeat_av", label: "Sophos Heartbeat", group: "DeviceAV", default: "-", type: "Date" },
      { key: "tamper", label: "Tamper Protection", group: "DeviceAV", default: "-", type: "Bool" },
      { key: "health", label: "Sophos Health", group: "DeviceAV", default: "-" },
    ]}
    data={`/api/v2/devices`}
    filters={[
      {
        name: "Device",
        filters: [
          { name: "Name", key: "hostname", type: "Text" },
        ]
      }
    ]}
    bind:total_items
    bind:page
    bind:count
  />
</div>