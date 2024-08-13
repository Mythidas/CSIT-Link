<script lang="ts">
  import Icon from "$lib/components/icon.svelte";
  import Input from "$lib/components/input.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Select from "$lib/components/select.svelte";
  import type { Company, Site } from "$lib/interfaces/i_db";
  import type { _ExtSite } from "$lib/interfaces/i_ext_info";

  export let data: { sites: Site[], companies: Company[], rmm_sites: _ExtSite[], av_sites: _ExtSite[], psa_sites: _ExtSite[] };

  let filter_value: string = "";
  let selected_site: Site | null = null;
  let show_edit_modal: boolean = false;

  let selected_site_company: { label: string, value: string };
  let selected_site_psa: { label: string, value: string };
  let selected_site_rmm: { label: string, value: string };
  let selected_site_av: { label: string, value: string };

  $: filtered_sites = data.sites.filter((_site) => { return _site.title.toLowerCase().includes(filter_value.toLowerCase()) });

  function on_edit_site(_site: Site) {
    selected_site = _site; show_edit_modal = true;
  }
</script>

<div class="flex w-full space-x-3">
  <div class="flex flex-col w-52 p-3 justify-between bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">Add Site</p>
    <a href="/setup/sites" class="text-center rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100">
      Select
    </a>
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

<Modal bind:open={show_edit_modal} title={`Editing ${selected_site?.title}`} on:accept={() => {}} on:close={() => { selected_site = null; }}>
  <div class="w-full mb-3 space-y-3">
    <div>
      <label for="company_id" class="text-xl">Company</label>
      <Select bind:value={selected_site_company} name="company_id" placeholder="(None)" options={[{ key: "-1", label: "(None)" }, ...data.companies.map(comp => {return { key: comp.company_id.toString(), label: comp.company_title }})]}/>
    </div>
    <div>
      <label for="psa" class="text-xl">PSA Site*</label>
      <Select bind:value={selected_site_psa} name="psa" required placeholder="Select site..." options={data.psa_sites.map(site => {return { key: site.id, label: site.name }})}/>
    </div>
    <div>
      <label for="rmm" class="text-xl">RMM Site</label>
      <Select bind:value={selected_site_rmm} name="rmm" required placeholder="Select site..." options={data.rmm_sites.map(site => {return { key: site.id, label: site.name }})}/>
    </div>
    <div>
      <label for="av" class="text-xl">AV Site</label>
      <Select bind:value={selected_site_av} name="av" required placeholder="Select site..." options={data.av_sites.map(site => {return { key: `${site.id}|${site.api_url}`, label: site.name }})}/>
    </div>
  </div>
</Modal>