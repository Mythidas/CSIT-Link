<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import type { _SophosDeviceEXT } from "$lib/interfaces/i_ext_info";
  import Time from "$lib/tools/time";
    import axios from "axios";

  export let data: { sophos_devices: _SophosDeviceEXT[] };

  async function on_enable_all() {
    for await (const _device of data.sophos_devices) {
      await axios.post(`/api/v2/sophos/${_device.site_id}/${_device.id}/tamper`);
    }
  }
</script>

<div class="flex p-2 bg-base-200 justify-between">
  <h3 class="flex space-x-2 text-2xl p-2 bg-base-200">
    <a href="/reports" class="hover:underline">Reports</a>
    <p>{">"}</p>
    <p>Sophos: Tamper Protection Report</p>
  </h3>
  <div class="flex h-fit my-auto">
    <Button on:click={on_enable_all}>
      Enable All
    </Button>
  </div>
</div>
<div class="flex w-full h-full p-2 space-x-2 bg-base-200 overflow-auto">
  <div class="w-full h-full overflow-auto">
    <table class="table-auto text-left w-full h-fit bg-base-100 shadow-md">
      <thead>
        <tr>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Site
          </th>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Hostname
          </th>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Last Online
          </th>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Tamper
          </th>
        </tr>
      </thead>
      <tbody>
        {#each data.sophos_devices as _device}
        <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300 hover:cursor-pointer">
          <td class={`px-2 py-1 whitespace-nowrap`}>{_device.title}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>{_device.hostname}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>{new Time(_device.lastSeenAt).get_time_since()}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>{_device.tamperProtectionEnabled}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>