<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Input from "$lib/components/input.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Select from "$lib/components/select.svelte";
  import Table from "$lib/components/table.svelte";
  import type { Company, Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[], companies: Company[], rmm_sites: any[], av_sites: any[], psa_sites: any[] };

  let show_modal = false;
  let form: HTMLFormElement;
  let site_name = "";

  function on_submit() {
    site_name = "";
    show_modal = false;
  }
</script>

<div class="flex flex-col p-3 w-full h-fit bg-base-200 rounded-sm">
  <div class="w-fit">
    <Button on:click={() => show_modal = true}>
      New Site
    </Button>
  </div>
</div>

<div class="flex flex-col p-3 w-full h-full bg-base-200 rounded-sm">
  <Table
    columns={[
      { key: "title", name: "Name", group: "Site", type: "Text" },
      { key: "company_title", name: "Company", group: "Company", type: "Text" }
    ]}
    data="/api/v2/sites"
    total_items={data.sites.length}
    page={1}
  />
</div>

<Modal bind:open={show_modal} title="New Site" on:accept={() => form.requestSubmit()}>
  <form class="flex flex-col w-2/4 h-full mx-auto" method="post" use:enhance bind:this={form} on:submit={on_submit}>
    <div class="w-full mb-3 space-y-3">
      <div>
        <label for="title" class="text-xl">Name*</label>
        <Input bind:value={site_name} required name="title" placeholder="Site name..."/>
      </div>
      <div>
        <label for="company_id" class="text-xl">Company</label>
        <Select value="" name="company_id" placeholder="(None)" options={[{ key: "-1", label: "(None)" }, ...data.companies.map(comp => {return { key: comp.company_id.toString(), label: comp.company_title }})]}/>
      </div>
      <div>
        <label for="psa" class="text-xl">PSA Site*</label>
        <Select value="" name="psa" required placeholder="Select site..." options={data.psa_sites.map(site => {return { key: site.id, label: site.name }})}/>
      </div>
      <div>
        <label for="rmm" class="text-xl">RMM Site</label>
        <Select value="" name="rmm" required placeholder="Select site..." options={data.rmm_sites.map(site => {return { key: site.id, label: site.name }})}/>
      </div>
      <div>
        <label for="av" class="text-xl">AV Site</label>
        <Select value="" name="av" required placeholder="Select site..." options={data.av_sites.map(site => {return { key: `${site.id}|${site.api_url}`, label: site.name }})}/>
      </div>
    </div>
  </form>
</Modal>