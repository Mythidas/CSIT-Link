<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Input from "$lib/components/input.svelte";
  import Modal from "$lib/components/modal.svelte";
    import Table from "$lib/components/table.svelte";

  let modal_state: boolean[] = [];
</script>

<div class="flex flex-col p-3 w-full h-full space-y-2 bg-base-200 rounded-sm overflow-hidden">
  <div class="w-full h-fit text-2xl">
    <Input value="" placeholder="Search Actions..."/>
  </div>
  <div class="flex flex-col w-full h-fit">
    <Button on:click={() => modal_state[0] = true}>Purge AV Devices</Button>
  </div>
</div>

<Modal bind:open={modal_state[0]} title="AV Devices to Purge">
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