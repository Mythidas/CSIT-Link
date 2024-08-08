<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Modal from "$lib/components/modal.svelte";
  import type { _SophosDevice, _SophosDeviceEXT } from "$lib/interfaces/i_ext_info";
  import Time from "$lib/tools/time";
  import axios from "axios";

  export let data: { old_sophos_devices: _SophosDeviceEXT[] };

  let show_modal = false;
  let selected_device: _SophosDeviceEXT | null = null;

  async function on_delete_click(_device: _SophosDeviceEXT) {
    show_modal = true;
    selected_device = _device;
  }

  async function on_approve_delete() {
    if (!selected_device) return;

    const result = await axios.delete(`/api/v2/sophos/${selected_device.site_id}/${selected_device.id}`);
    if (result.status === 200) {
      data.old_sophos_devices = data.old_sophos_devices.filter((_dev: _SophosDeviceEXT) => {
        return _dev.id !== selected_device?.id;
      });
    }

    selected_device = null;
    show_modal = false;
  }
</script>

<div class="bg-base-200">
  <h3 class="flex space-x-2 text-2xl p-2 bg-base-200">
    <a href="/reports" class="hover:underline">Reports</a>
    <p>{">"}</p>
    <p>Sophos: Offline Report</p>
  </h3>
</div>
<div class="flex w-full h-full p-2 space-x-2 bg-base-200 overflow-auto">
  <div class="w-full h-full overflow-auto">
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
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Tamper
          </th>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {#each data.old_sophos_devices as _device}
        <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300 hover:cursor-pointer">
          <td class={`px-2 py-1 whitespace-nowrap`}>{_device.title}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>{_device.hostname}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>{new Time(_device.lastSeenAt).get_time_since()}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>{_device.tamperProtectionEnabled}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>
            <Button width="w-full" on:click={() => on_delete_click(_device)}>
              Delete
            </Button>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal title="Delete Device?" bind:open={show_modal} on:accept={() => on_approve_delete()}>
  <div class="text-xl">
    <p>Hostname: {selected_device?.hostname}</p>
    <p>Last Seen: {new Time(selected_device?.lastSeenAt || "").get_time_since()}</p>
    <p>Site: {selected_device?.title}</p>
  </div>
</Modal>