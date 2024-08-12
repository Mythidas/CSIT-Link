<script lang="ts">
  import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";
  import type { _SophosDevice, _VSAxDevice } from "$lib/interfaces/i_ext_info";
  import Time from "$lib/tools/time";

  export let data: { site: Site, av_devices: _SophosDevice[], rmm_devices: _VSAxDevice[] };
</script>

<div class="bg-theme-dark-200/75 rounded-md">
  <h3 class="flex space-x-2 text-2xl p-2">
    <a href="/sites" class="hover:underline">Sites</a>
    <p>{">"}</p>
    <p>{data.site && data.site.title || "Failed to load"}</p>
  </h3>
</div>
<div class="flex w-full h-full space-x-2 bg-theme-dark-200/75 rounded-md overflow-auto">
  <Table
    columns={[
      { key: "Name", label: `VSA Devices (${data.rmm_devices.length})`, type: "String" },
      { key: "LastSeenOnline", label: "Last Online", type: "Date" }
    ]}
    rows={data.rmm_devices}
  />
  <Table
    columns={[
      { key: "hostname", label: `Sophos Devices (${data.av_devices.length})`, type: "String" },
      { key: "lastSeenAt", label: "Last Online", type: "Date" }
    ]}
    rows={data.av_devices}
  />
</div>