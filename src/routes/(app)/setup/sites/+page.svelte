<script lang="ts">
  import Icon from "$lib/components/icon.svelte";
  import Input from "$lib/components/input.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Select from "$lib/components/select.svelte";
  import type { Company, Site } from "$lib/interfaces/i_db";
  import type { _ExtSite } from "$lib/interfaces/i_ext_info";
  import axios from "axios";

  export let data: { sites: Site[], companies: Company[], rmm_sites: _ExtSite[], av_sites: _ExtSite[], psa_sites: _ExtSite[] };

  let filter_value: string = "";
  let selected_site: Site | null = null;
  let show_edit_modal: boolean = false;
  let show_new_modal: boolean = false;
  let loading_new_modal: boolean = false;
  let loading_edit_modal: boolean = false;

  let selected_site_company: string;
  let selected_site_psa: string;
  let selected_site_rmm: string;
  let selected_site_av: string;
  let selected_site_form: HTMLFormElement;

  let new_site_title: string;
  let new_site_company: string;
  let new_site_psa: string;
  let new_site_rmm: string;
  let new_site_av: string;
  let new_site_form: HTMLFormElement;

  $: filtered_sites = data.sites.filter((_site) => { return _site.title.toLowerCase().includes(filter_value.toLowerCase()) });

  function on_edit_site(_site: Site) {
    selected_site = _site;
    selected_site_company = _site.company_id?.toString() || "";
    selected_site_psa = _site.psa_id;
    selected_site_rmm = _site.rmm_id.toString();
    selected_site_av = _site.av_id + "|" + _site.av_url;
    show_edit_modal = true;
  }

  async function on_accept_new_site() {
    loading_new_modal = true;
    const _av_data = new_site_av?.split("|") || [];

    const _site_data: Site = {
      site_id: -1,
      company_title: "",
      title: new_site_title,
      company_id: Number(new_site_company || -1),
      psa_id: new_site_psa,
      rmm_id: new_site_rmm,
      av_id: _av_data[0] || "",
      av_url: _av_data[1] || "",
      last_update: "",
      rmm_count: 0,
      av_count: 0
    }

    if (new_site_title.length <= 0 || new_site_psa.length <= 0) {
      // Display Error
      return;
    }

    const add_site_api = await axios.post(`/api/v2/sites`, _site_data);
    if (add_site_api.status !== 200) {
      // Display Error
      return;
    } else {
      data.sites = [...data.sites, add_site_api.data.data as Site];
      loading_new_modal = false;
      show_new_modal = false;
    }
  }

  async function on_accept_edit_site() {
    if (!selected_site) return;

    loading_edit_modal = true;
    const _av_data = selected_site_av?.split("|") || [];

    selected_site.company_id = Number(selected_site_company || -1);
    selected_site.psa_id = selected_site_psa;
    selected_site.rmm_id = selected_site_rmm;
    selected_site.av_id = _av_data[0] || "";
    selected_site.av_url = _av_data[1] || "";

    const add_site_api = await axios.post(`/api/v2/sites`, selected_site);
    if (add_site_api.status !== 200) {
      // Display Error
      return;
    } else {
      const index = data.sites.findIndex((_site) => { return _site.site_id === selected_site?.site_id; });
      data.sites[index] = {...selected_site};
      loading_edit_modal = false;
      show_edit_modal = false;
      selected_site = null;
    }
  }
</script>

<div class="flex w-full space-x-3">
  <div class="flex flex-col w-52 p-3 justify-between bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">Add Site</p>
    <button class="text-center rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={() => show_new_modal = true}>
      Select
    </button>
  </div>
  <div class="flex flex-col w-64 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">Search Sites</p>
    <Input bind:value={filter_value} placeholder="Site..."/>
  </div>
</div>

<div class="flex w-full h-full p-2 bg-theme-dark-200/75 rounded-md shadow-md overflow-hidden">
  <div class="w-full h-full overflow-auto">
    <table class="table-auto text-left w-full h-fit border-separate border-spacing-y-1">
      <thead>
        <tr>
          <th class="sticky top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
            Title
          </th>
          <th class="sticky top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {#each filtered_sites as _site}
        <tr class="even:bg-theme-dark-200 odd:bg-theme-dark-100">
          <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>{_site.title}</td>
          <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>
            <button class="stroke-theme-dark-font-100 hover:stroke-theme-dark-accent hover:cursor-pointer" on:click={() => on_edit_site(_site)}>
              <Icon size={22} icon="Edit"/>
            </button>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal bind:open={show_edit_modal} bind:loading={loading_edit_modal} title={`Editing ${selected_site?.title}`} on:accept={() => selected_site_form.requestSubmit()} on:close={() => { selected_site = null; }}>
  <form bind:this={selected_site_form} on:submit={on_accept_edit_site}>
    <div class="w-full mb-3 space-y-3">
      <div>
        <label for="company_id" class="text-xl">Company</label>
        <Select bind:value={selected_site_company} name="company_id" placeholder="(None)" options={[...data.companies.map(comp => {return { key: comp.company_id.toString(), label: comp.company_title }})]}/>
      </div>
      <div>
        <label for="psa" class="text-xl">PSA Site*</label>
        <Select bind:value={selected_site_psa} name="psa" required placeholder="Select site..." options={data.psa_sites.map(site => {return { key: site.id, label: site.name }})}/>
      </div>
      <div>
        <label for="rmm" class="text-xl">RMM Site</label>
        <Select bind:value={selected_site_rmm} name="rmm" placeholder="Select site..." options={data.rmm_sites.map(site => {return { key: site.id, label: site.name }})}/>
      </div>
      <div>
        <label for="av" class="text-xl">AV Site</label>
        <Select bind:value={selected_site_av} name="av" placeholder="Select site..." options={data.av_sites.map(site => {return { key: `${site.id}|${site.api_url}`, label: site.name }})}/>
      </div>
    </div>
  </form>
</Modal>

<Modal bind:open={show_new_modal} bind:loading={loading_new_modal} title={`New Site`} on:accept={() => new_site_form.requestSubmit()}>
  <form bind:this={new_site_form} on:submit={on_accept_new_site}>
    <div class="w-full mb-3 space-y-3">
      <div>
        <label for="company_id" class="text-xl">Site Name*</label>
        <Input bind:value={new_site_title} required placeholder="Site Name..."/>
      </div>
      <div>
        <label for="company_id" class="text-xl">Company</label>
        <Select bind:value={new_site_company} name="company_id" placeholder="(None)" options={[{ key: "-1", label: "(None)" }, ...data.companies.map(comp => {return { key: comp.company_id.toString(), label: comp.company_title }})]}/>
      </div>
      <div>
        <label for="psa" class="text-xl">PSA Site*</label>
        <Select bind:value={new_site_psa} name="psa" required placeholder="Select site..." options={data.psa_sites.map(site => {return { key: site.id, label: site.name }})}/>
      </div>
      <div>
        <label for="rmm" class="text-xl">RMM Site</label>
        <Select bind:value={new_site_rmm} name="rmm" placeholder="Select site..." options={data.rmm_sites.map(site => {return { key: site.id, label: site.name }})}/>
      </div>
      <div>
        <label for="av" class="text-xl">AV Site</label>
        <Select bind:value={new_site_av} name="av" placeholder="Select site..." options={data.av_sites.map(site => {return { key: `${site.id}|${site.api_url}`, label: site.name }})}/>
      </div>
    </div>
  </form>
</Modal>