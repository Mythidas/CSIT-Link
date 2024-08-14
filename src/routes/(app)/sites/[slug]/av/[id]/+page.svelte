<script lang="ts">
  import type { Site } from "$lib/interfaces/i_db";
  import type { _SophosDeviceEXT } from "$lib/interfaces/i_ext_info";
  import Time from "$lib/tools/time";

  export let data: { site: Site, av_device: _SophosDeviceEXT };
</script>

<div class="flex justify-between p-1 bg-theme-dark-200/75 rounded-md shadow-md">
  <div class="flex space-x-2 text-2xl p-2 my-auto">
    <a href="/sites" class="hover:underline">Sites</a>
    <p>{">"}</p>
    <a href={`/sites/${data.site.site_id}`} class="hover:underline">{data.site && data.site.title || "Failed to load"}</a>
    <p>{">"}</p>
    <p>{data.av_device.hostname}</p>
  </div>
</div>
<div class="flex flex-col w-fit h-fit p-3 bg-theme-dark-200/75 rounded-md shadow-md">
  <h3 class="text-3xl pb-5">{data.av_device.hostname}</h3>
  <div class="flex space-x-0.5 text-lg">
    <div class="space-y-0.5">
      <p class="bg-theme-dark-300 px-2 py-1 rounded-tl">OS</p>
      <p class="bg-theme-dark-300 px-2 py-1">Last Online</p>
      <p class="bg-theme-dark-300 px-2 py-1">Tamper Protection</p>
      <p class="bg-theme-dark-300 px-2 py-1">Tamper Password</p>
      <p class="bg-theme-dark-300 px-2 py-1">Last Known User</p>
      <p class="bg-theme-dark-300 px-2 py-1">Last Known IP</p>
      <p class="bg-theme-dark-300 px-2 py-1">MAC Address</p>
      <p class="bg-theme-dark-300 px-2 py-1">Health</p>
      <p class="bg-theme-dark-300 px-2 py-1 rounded-bl">Isolation</p>
    </div>
    <div class="space-y-0.5">
      <p class="bg-theme-dark-300 px-2 py-1 rounded-tr">{data.av_device.os.name}</p>
      <p class="bg-theme-dark-300 px-2 py-1">{new Time(data.av_device.lastSeenAt).get_time_since()}</p>
      <p class="bg-theme-dark-300 px-2 py-1">{data.av_device.tamperProtectionEnabled ? "Enabled" : "Disabled"}</p>
      <p class="bg-theme-dark-300 px-2 py-1">{data.av_device.tamper_info?.password || "Unknown"}</p>
      <p class="bg-theme-dark-300 px-2 py-1">{data.av_device.associatedPerson.name}</p>
      <p class="bg-theme-dark-300 px-2 py-1">{data.av_device.ipv4Addresses[0] || ""}</p>
      <p class="bg-theme-dark-300 px-2 py-1">{data.av_device.macAddresses[0] || ""}</p>
      <p class="bg-theme-dark-300 px-2 py-1">{data.av_device.health.overall.toUpperCase()}</p>
      <p class="bg-theme-dark-300 px-2 py-1 rounded-br">{data.av_device.isolation.adminIsolated || data.av_device.isolation.selfIsolated ? "Enabled" : "Disabled"}</p>
    </div>
  </div>
</div>