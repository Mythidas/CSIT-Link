<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/button.svelte";
  import Input from "$lib/components/input.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Table from "$lib/components/table.svelte";
  import axios from "axios";

  let modal_state: boolean[] = [];
  let loading: boolean = true;

  async function on_purge_av_devices() {
    loading = true;
    const res = await axios.delete("/api/v2/devices/purge/av/submit");
    modal_state[1] = false;
    if (res.status === 200) {
      goto("/devices");
    }
  }

  async function on_sync_devices() {
    loading = true;
    const res = await axios.get("/api/v2/devices/sync");
    modal_state[0] = false;
    if (res.status === 200) {
      goto("/devices");
    }
  }
</script>

<div class="flex flex-col p-3 w-full h-full space-y-2 bg-base-200 rounded-sm overflow-hidden">
  <div class="w-full h-fit text-2xl">
    <Input value="" placeholder="Search Actions..."/>
  </div>
  <div class="flex flex-col w-full h-fit space-y-2">
    <Button on:click={() => modal_state[0] = true}>Sync Devices</Button>
    <Button on:click={() => modal_state[1] = true}>Purge AV Devices</Button>
  </div>
</div>

<Modal bind:open={modal_state[0]} title="Sync Devices" on:accept={on_sync_devices} bind:loading>

</Modal>

<Modal bind:open={modal_state[1]} title="AV Devices to Purge" on:accept={on_purge_av_devices} bind:loading>
  <Table
    columns={[
      { key: "hostname", name: "Name", group: "Device", default: "-", type: "Text" },
      { key: "title", name: "Site", group: "Site", default: "-", type: "Text" },
      { key: "company_title", name: "Company", group: "Company", default: "-", type: "Text" },
      { key: "os", name: "OS", group: "Device", default: "-", type: "Text" },
      { key: "heartbeat_av", name: "Sophos Heartbeat", group: "DeviceAV", default: "-", type: "Date" },
    ]}
    data={`/api/v2/devices/purge/av`}
    page={1}
    count={25}
    total_items={1}
    sticky_first
  />
</Modal>