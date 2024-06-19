<script lang="ts">
  import Table from "$lib/components/table.svelte";

  export let data;

  let total_items = 1;
  let filtered_data: any[];
  let selected_row: number;

  async function on_option_select(e: any) {
    const _target = e.detail;
    // if (_target === "Delete Sophos Agent") {
    //   for await (const device of filtered_data) {
    //     if (device.checked) {
    //       const res = await axios.delete(`/api/v2/devices/host/${device.device_id}/delete`);
    //       console.log(res.data);
    //     }
    //   }

    //   goto($page.url.href);
    // }
  }
</script>

<div class="flex w-full h-full p-2 bg-base-200">
  <Table
    columns={[
      { key: "hostname", name: "Name", group: "Device", default: "-", type: "Text" },
      { key: "title", name: "Site", group: "Site", default: "-", type: "Text" },
      { key: "company_title", name: "Company", group: "Company", default: "-", type: "Text" },
      { key: "os", name: "OS", group: "Device", default: "-", type: "Text" },
      { key: "ipv4", name: "LAN", group: "Device", default: "-", type: "Text" },
      { key: "wan", name: "WAN", group: "Device", default: "-", type: "Text" },
      { key: "heartbeat_rmm", name: "VSA Heartbeat", group: "DeviceRMM", default: "-", type: "Date" },
      { key: "heartbeat_av", name: "Sophos Heartbeat", group: "DeviceAV", default: "-", type: "Date" },
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
    options={data.is_admin ? [
      "Enable Tamper Protection",
    ] : []}
    on:option={on_option_select}
  />
</div>