<script lang="ts">
    import { goto } from "$app/navigation";
  import Input from "$lib/components/input.svelte";
    import SelectPanel from "$lib/components/select_panel.svelte";
import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";
  import type { _SophosDevice, _VSAxDevice } from "$lib/interfaces/i_ext_info";
  import Time from "$lib/tools/time";

  export let data: { site: Site, av_devices: _SophosDevice[], rmm_devices: _VSAxDevice[], accum_devices: _VSAxDevice[], server_count: Number, workstation_count: Number, offline_count: Number };

  let current_filter: "All" | "Workstations" | "Servers" | "Offline" = "All";
  let device_filter = "";

  $: filtered_av = filter_av(current_filter, device_filter);
  $: filtered_rmm = filter_rmm(current_filter, device_filter);

  function filter_av(_filter: string, _search: string) {
    if (_filter === "Workstations") {
      return data.av_devices.filter((_dev) => {
        return !_dev.os.isServer && _dev.hostname.toLowerCase().includes(_search.toLowerCase());
      })
    } else if (_filter === "Servers") {
      return data.av_devices.filter((_dev) => {
        return _dev.os.isServer && _dev.hostname.toLowerCase().includes(_search.toLowerCase());
      })
    } else if (_filter === "Offline") {
      return data.av_devices.filter((_dev) => {
        return new Time(_dev.lastSeenAt).is_older_than_30_days() && _dev.hostname.toLowerCase().includes(_search.toLowerCase());
      })
    }

    return data.av_devices.filter((_dev) => { return _dev.hostname.toLowerCase().includes(_search.toLowerCase()) });
  }

  function filter_rmm(_filter: string, _search: string) {
    if (_filter === "Workstations") {
      return data.rmm_devices.filter((_dev) => {
        return !_dev.Description.includes("Server") && _dev.Name.toLowerCase().includes(_search.toLowerCase());
      })
    } else if (_filter === "Servers") {
      return data.rmm_devices.filter((_dev) => {
        return _dev.Description.includes("Server") && _dev.Name.toLowerCase().includes(_search.toLowerCase());
      })
    } else if (_filter === "Offline") {
      return data.rmm_devices.filter((_dev) => {
        return new Time(_dev.LastSeenOnline).is_older_than_30_days() && _dev.Name.toLowerCase().includes(_search.toLowerCase());
      })
    }

    return data.rmm_devices.filter((_dev) => { return _dev.Name.toLowerCase().includes(_search.toLowerCase()) });
  }

  function on_select_av(_data: _SophosDevice) {
    goto(`/sites/${data.site.site_id}/av/${_data.id}`);
  }

  function on_select_rmm(_data: _VSAxDevice) {
    window.open(`https://centriserve-it.vsax.net/app/main/systems/${_data.Identifier}/details`, "_blank");
  }
</script>

<div class="flex justify-between bg-theme-dark-200/75 rounded-md shadow-md">
  <div class="flex space-x-2 text-2xl p-2 my-auto">
    <a href="/sites" class="hover:underline">Sites</a>
    <p>{">"}</p>
    <p>{data.site && data.site.title || "Failed to load"}</p>
  </div>
  <div class="w-1/3 my-auto p-3">
    <Input placeholder="Search Devices" bind:value={device_filter}/>
  </div>
</div>
<div class="flex w-full space-x-3">
  <SelectPanel label="All Devices" bind:filter={current_filter} tag="All">
    {Math.max(data.rmm_devices.length, data.av_devices.length)}
  </SelectPanel>
  <SelectPanel label="Servers" bind:filter={current_filter} tag="Servers">
    {data.server_count}
  </SelectPanel>
  <SelectPanel label="Workstations" bind:filter={current_filter} tag="Workstations">
    {data.workstation_count}
  </SelectPanel>
  <SelectPanel label="Dead Devices" bind:filter={current_filter} tag="Offline">
    {data.offline_count}
  </SelectPanel>
</div>
<div class="flex w-full h-full p-2 space-x-2 bg-theme-dark-200/75 rounded-md shadow-md overflow-auto">
  <Table
    columns={[
      { key: "Name", label: `VSA Devices (${filtered_rmm.length})`, type: "String" },
      { key: "Description", label: "OS", type: "String" },
      { key: "LastSeenOnline", label: "Last Online", type: "Date" },
    ]}
    rows={filtered_rmm}
    on:select={(_row) => on_select_rmm(_row.detail)}
  />
  <Table
    columns={[
      { key: "hostname", label: `Sophos Devices (${filtered_av.length})`, type: "String" },
      { key: "os.name", label: "OS", type: "String" },
      { key: "lastSeenAt", label: "Last Online", type: "Date" },
    ]}
    rows={filtered_av}
    on:select={(_row) => on_select_av(_row.detail)}
  />
</div>