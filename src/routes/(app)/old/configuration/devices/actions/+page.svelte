<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/button.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Table from "$lib/components/table.svelte";
  import Select from "$lib/components/select.svelte";
  import type { Site } from "$lib/interfaces/i_db";
  import type { _GroupRMM } from "$lib/interfaces/i_ext_info";
  import axios from "axios";

  export let data: { sites: Site[], groups: _GroupRMM[] };

  let modal_state: boolean[] = [];
  let loading: boolean = false;

  // Modal 2 [Migration]
  let m2_from_site: string;
  let m2_to_site: string;
  let m2_to_group: string;
  let m2_filtered_data: any[];
  let m2_groups: { key: string, label: string }[];

  $: if (!modal_state[2]) {
    m2_to_site = "";
    m2_from_site = "";
  }

  $: if (modal_state[2] && m2_from_site && m2_to_site && m2_from_site !== m2_to_site) {
    m2_get_groups();
  }
  

  async function on_purge_av_devices() {
    loading = true;
    try {
      const res = await axios.delete("/api/v2/devices/purge/av/submit");
      modal_state[1] = false;
      loading = false;

      if (res.status === 200) {
        goto("/devices");
      }

    } catch (err) {
      modal_state[1] = false;
      loading = false;
      console.log(err);
    }
  }

  async function on_sync_devices() {
    loading = true;
    try {
      await axios.get("/api/v2/devices/sync");
      modal_state[0] = false;
      loading = false;
    } catch (err) {
      modal_state[0] = false;
      loading = false;
      console.log(err);
    }
  }

  async function on_migrate_devices() {
    loading = true;
    try {
      await axios.post("/api/v2/devices/migrate", m2_filtered_data.filter(row => { return row.checked }).map(row => { return { id: row.rmm_id, group: m2_to_group }}));
      modal_state[2] = false;
      loading = false;
      goto("/configuration/devices");
    } catch (err) {
      modal_state[2] = false;
      loading = false;
      console.log(err);
      goto("/configuration/devices");
    }
  }

  async function m2_get_groups() {
    loading = true;
    try {
      const groups = await axios.get(`/api/rmm/${m2_to_site}/groups`);
      
      console.log(groups);
      loading = false;
      m2_groups = groups.data.data.filter((grp: _GroupRMM) => { return data.sites.find(site => site.site_id === grp.ParentSiteId) !== undefined}).map((grp: _GroupRMM) => {
        return { key: grp.Id.toString(), label: grp.Name };
      })
    } catch (err) {
      loading = false;
      modal_state[2] = false;
      m2_groups = [];
      console.log(`[m2_get_groups] ${err}`);
    }
  }
</script>

<div class="flex p-2 w-full h-fit text-2xl space-x-2 bg-base-200 rounded-sm overflow-hidden">
  <a href="/configuration/devices" class="hover:underline">Devices</a><p>{">"}</p><p>Actions</p>
</div>
<div class="flex flex-col p-2 w-full h-full space-y-2 bg-base-200 rounded-sm overflow-hidden">
  <!-- <div class="w-full h-fit text-2xl">
    <Input value="" placeholder="Search Actions..."/>
  </div> -->
  <div class="flex flex-col w-full h-fit space-y-1">
    <Button on:click={() => modal_state[0] = true}>Sync Devices</Button>
    <Button on:click={() => modal_state[1] = true}>Purge AV Devices</Button>
    <Button on:click={() => modal_state[2] = true}>Migrate Devices</Button>
  </div>
</div>

<Modal bind:open={modal_state[0]} title="Sync Devices" on:accept={on_sync_devices} bind:loading>
  Accept to sync
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

<Modal bind:open={modal_state[2]} title="Migrate Devices" on:accept={on_migrate_devices} bind:loading>
  <div class="flex justify-evenly space-x-2">
    <div class="w-full">
      <label for="from_site" class="text-xl">From</label>
      <Select bind:value={m2_from_site} name="from_site" required placeholder="Select site..." options={data.sites.map(site => {return { key: site.site_id.toString(), label: site.title }})}/>
    </div>
    <div class="w-full">
      <label for="to_site" class="text-xl">To</label>
      <Select bind:value={m2_to_site} name="to_site" required placeholder="Select site..." options={data.sites.map(site => { return { key: site.site_id.toString(), label: site.title } })}/>
    </div>
  </div>
  {#if m2_to_site && m2_from_site && m2_from_site !== m2_to_site}
  <div class="flex justify-evenly space-x-2">
    <div class="w-full">
    </div>
    <div class="w-full">
      <label for="to_group" class="text-xl">Group (RMM)</label>
      <Select bind:value={m2_to_group} name="to_group" required placeholder="Select group..." options={m2_groups}/>
    </div>
  </div>
  {/if}
  {#if m2_to_site && m2_from_site && m2_from_site !== m2_to_site && m2_to_group}
  <div class="flex w-full h-[70%] overflow-hidden">
    <Table
    columns={[
      { key: "hostname", name: "Name", group: "Device", type: "Text" },
      { key: "title", name: "Site", group: "Site", type: "Text" }
    ]}
    data={`/api/v2/devices/${m2_from_site}`}
    total_items={data.sites.length}
    page={1} 
    bind:filtered_data={m2_filtered_data}
    options={['']}
    />
  </div>
  {/if}
</Modal>