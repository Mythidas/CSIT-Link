<script lang="ts">
  import type { Device, Site } from "$lib/interfaces/i_db";

  export let data: { site: Site, av_devices: Device[], rmm_devices: Device[] };
</script>

<div class="bg-base-200">
  <h3 class="flex space-x-2 text-2xl p-2 bg-base-200">
    <a href="/sites" class="hover:underline">Sites</a>
    <p>{">"}</p>
    <p>{data.site.title}</p>
  </h3>
</div>
<div class="flex w-full h-full p-2 space-x-2 bg-base-200 overflow-auto">
  <div class="w-full h-full overflow-auto">
    <table class="table-auto text-left w-full h-fit bg-base-100">
      <thead>
        <tr>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            VSA Devices ({data.rmm_devices.length})
          </th>
        </tr>
      </thead>
      <tbody>
        {#each data.rmm_devices as device}
        <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300">
          <td class={`px-2 py-1 whitespace-nowrap`}>{device.hostname}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="w-full h-full overflow-auto">
    <table class="table-auto text-left w-full h-fit bg-base-100">
      <thead>
        <tr>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Sophos Devices ({data.av_devices.length})
          </th>
        </tr>
      </thead>
      <tbody>
        {#each data.av_devices as device}
        <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300">
          <td class={`px-2 py-1 whitespace-nowrap`}>{device.hostname}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>