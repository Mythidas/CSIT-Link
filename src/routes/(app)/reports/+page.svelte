<script lang="ts">
  import type { _SophosDevice, _SophosDeviceEXT } from "$lib/interfaces/i_ext_info";
  import Time from "$lib/tools/time";

  export let data: { old_sophos_devices: _SophosDeviceEXT[] };
</script>

<div class="flex w-full h-full p-2 space-x-2 bg-base-200 overflow-auto">
  <table class="table-auto text-left w-full h-fit bg-base-100">
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
      </tr>
    </thead>
    <tbody>
      {#each data.old_sophos_devices as _device}
      <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300">
        <td class={`px-2 py-1 whitespace-nowrap`}>{_device.title}</td>
        <td class={`px-2 py-1 whitespace-nowrap`}>{_device.hostname}</td>
        <td class={`px-2 py-1 whitespace-nowrap`}>{new Time(_device.lastSeenAt).get_time_since()}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>