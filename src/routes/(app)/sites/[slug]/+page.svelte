<script lang="ts">
  import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";
  import type { _SophosDevice, _VSAxDevice } from "$lib/interfaces/i_ext_info";
  import Time from "$lib/tools/time";

  export let data: { site: Site, av_devices: _SophosDevice[], rmm_devices: _VSAxDevice[], server_count: Number, workstation_count: Number, offline_count: Number };

  let current_filter: "All" | "Workstations" | "Servers" | "Offline" = "All";

  $: filtered_av = filter_av(current_filter);
  $: filtered_rmm = filter_rmm(current_filter);

  function filter_av(_filter: string) {
    if (_filter === "Workstations") {
      return data.av_devices.filter((_dev) => {
        return !_dev.os.isServer;
      })
    } else if (_filter === "Servers") {
      return data.av_devices.filter((_dev) => {
        return _dev.os.isServer;
      })
    } else if (_filter === "Offline") {
      return data.av_devices.filter((_dev) => {
        return new Time(_dev.lastSeenAt).is_older_than_30_days();
      })
    }

    return data.av_devices;
  }

  function filter_rmm(_filter: string) {
    if (_filter === "Workstations") {
      return data.rmm_devices.filter((_dev) => {
        return !_dev.Description.includes("Server");
      })
    } else if (_filter === "Servers") {
      return data.rmm_devices.filter((_dev) => {
        return _dev.Description.includes("Server");
      })
    } else if (_filter === "Offline") {
      return data.rmm_devices.filter((_dev) => {
        return new Time(_dev.LastSeenOnline).is_older_than_30_days();
      })
    }

    return data.rmm_devices;
  }
</script>

<div class="bg-theme-dark-200/75 rounded-md">
  <h3 class="flex space-x-2 text-2xl p-2">
    <a href="/sites" class="hover:underline">Sites</a>
    <p>{">"}</p>
    <p>{data.site && data.site.title || "Failed to load"}</p>
  </h3>
</div>
<div class="flex w-full space-x-3">
  <div class="flex flex-col w-52 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">All Devices</p>
    <p class="w-full text-center text-xl rounded-md bg-theme-dark-300">{Math.max(data.rmm_devices.length, data.av_devices.length)}</p>
    {#if current_filter === "All"}
    <div class="text-center rounded-md bg-theme-preset-active">
      Selected
    </div>
    {:else}
    <button class="rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={() => { current_filter = "All"}}>
      Select
    </button>
    {/if}
  </div>
  <div class="flex flex-col w-52 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">Servers</p>
    <p class="w-full text-center text-xl rounded-md bg-theme-dark-300">{data.server_count}</p>
    {#if current_filter === "Servers"}
    <div class="text-center rounded-md bg-theme-preset-active">
      Selected
    </div>
    {:else}
    <button class="rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={() => { current_filter = "Servers"}}>
      Select
    </button>
    {/if}
  </div>
  <div class="flex flex-col w-52 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">Workstations</p>
    <p class="w-full text-center text-xl rounded-md bg-theme-dark-300">{data.workstation_count}</p>
    {#if current_filter === "Workstations"}
    <div class="text-center rounded-md bg-theme-preset-active">
      Selected
    </div>
    {:else}
    <button class="rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={() => { current_filter = "Workstations"}}>
      Select
    </button>
    {/if}
  </div>
  <div class="flex flex-col w-52 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">Offline Devices</p>
    <p class="w-full text-center text-xl rounded-md bg-theme-dark-300">{data.offline_count}</p>
    {#if current_filter === "Offline"}
    <div class="text-center rounded-md bg-theme-preset-active">
      Selected
    </div>
    {:else}
    <button class="rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={() => { current_filter = "Offline"}}>
      Select
    </button>
    {/if}
  </div>
</div>
<div class="flex w-full h-full p-2 space-x-2 bg-theme-dark-200/75 rounded-md overflow-auto">
  <Table
    columns={[
      { key: "Name", label: `VSA Devices (${filtered_rmm.length})`, type: "String" },
      { key: "Description", label: "OS", type: "String" },
      { key: "LastSeenOnline", label: "Last Online", type: "Date" },
    ]}
    rows={filtered_rmm}
  />
  <Table
    columns={[
      { key: "hostname", label: `Sophos Devices (${filtered_av.length})`, type: "String" },
      { key: "os.name", label: "OS", type: "String" },
      { key: "lastSeenAt", label: "Last Online", type: "Date" },
    ]}
    rows={filtered_av}
  />
</div>