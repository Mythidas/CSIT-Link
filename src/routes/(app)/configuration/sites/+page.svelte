<script lang="ts">
  import { enhance } from "$app/forms";
  import DropdownSelect from "$lib/components/dropdown_select.svelte";
  import Modal from "$lib/components/modal.svelte";
  import type { Company, Site } from "$lib/interfaces/i_db";
  import type { _ExtSite } from "$lib/interfaces/i_ext_info";
    import { all_sites } from "$lib/stores";

  export let data: { companies: Company[], psa_sites: _ExtSite[], rmm_sites: _ExtSite[], av_sites: _ExtSite[] };

  let show_modal = false;
  let selected_name: string = "";
  let selected_company: any = { label: "(None)", key: "-1" };
  let selected_psa: any = null;
  let selected_rmm: any = null;
  let selected_av: any = null;

  $: selected = { 
    site_id: -1,
    title: "",
    psa_id: "",
    rmm_id: "", 
    av_id: "",
    av_url: "",
    company_id: -1
  };

  function set_selected(id: number) {
    selected = $all_sites.filter(site => site.site_id === id)[0];
  }

  function map_ext_site_to_options(sites: _ExtSite[]) {
    return sites.map((site) => {
      return { label: site.name, key: site.id + "|" + site.api_url };
    });
  }

  function map_companies_to_options() {
    let companies = [{ label: "(None)", key: "-1" }];
    companies.push(...data.companies.map((company) => {
      return { label: company.title, key: company.company_id.toString() };
    }));

    return companies;
  }

  function close_modal() {
    show_modal = false;
    selected_name = "";
    selected_company = { label: "(None)", key: "-1" };
    selected_psa = null;
    selected_rmm = null;
    selected_av = null;
  }
</script>

<div class="flex flex-col p-3 mb-3 w-full h-fit bg-cscol-400 rounded-sm">
  <div class="flex">
    <button on:click={() => {show_modal = true}} class="bg-cscol-000 py-2 px-3 rounded-sm hover:bg-cscol-100">
      New Site
    </button>
  </div>
</div>

<div class="flex flex-col p-3 w-full h-5/6 bg-cscol-400 rounded-sm">
  <div class="flex w-full h-full">
    <div class="flex w-2/3 h-full overflow-y-auto">
      <table class="table-auto w-full h-fit text-left">
        <thead class="border-b-2 border-cscol-200 text-lg">
          <tr>
            <th class="pl-1">ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody class="text-base">
          {#each $all_sites as site}
            <tr
              on:click={() => set_selected(site.site_id)}
              class={`${selected.site_id === site.site_id ? "bg-cscol-000" : "even:bg-cscol-400 odd:bg-cscol-500"} hover:bg-cscol-100 hover:cursor-pointer`}
            >
              <td class="pl-1">{site.site_id}</td>
              <td>{site.title}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex m-0.5 p-3 w-1/3 h-full border-l-2 border-cscol-200">
      {#if selected.site_id !== -1}
      <div class="flex flex-col">
        <p>Site: {selected.title}</p>
        <p>Company: {data.companies.filter(comp => { return comp.company_id === selected.company_id; })[0]?.title || "None"}</p>
        <p>PSA ID: {selected.psa_id}</p>
        <p>RMM ID: {selected.rmm_id}</p>
        <p>AV ID: {selected.av_id}</p>
        <p>AV Url: {selected.av_url}</p>
      </div>
      {:else}
        <div class="m-auto text-2xl">
          Select Site...
        </div>
      {/if}
    </div>
  </div>
</div>

<Modal bind:show_modal>
  <form class="flex flex-col w-full h-full justify-between" method="post" use:enhance>
    <div class="mx-auto w-2/4">
      <div class="w-full mb-3">
        <h3 class="text-xl mb-1">Name*</h3>
        <input required bind:value={selected_name} name="title" type="text" class="w-full p-1 outline-none border-cscol-100 focus:border-cscol-200 border-2 text-cscol-600" placeholder="Site Name..." />
      </div>
      <div class="w-full mb-3">
        <h3 class="text-xl mb-1">Company</h3>
        <DropdownSelect bind:selected={selected_company} name="company_id" options={map_companies_to_options()} default_value={{ label: "(None)", key: "-1" }} />
      </div>
      <div class="w-full mb-3">
        <h3 class="text-xl mb-1">PSA Site*</h3>
        <DropdownSelect required bind:selected={selected_psa} name="psa" options={map_ext_site_to_options(data.psa_sites)} default_label="Select Site..."/>
      </div>
      <div class="w-full mb-3">
        <h3 class="text-xl mb-1">RMM Site</h3>
        <DropdownSelect bind:selected={selected_rmm} name="rmm" options={map_ext_site_to_options(data.rmm_sites)} default_label="Select Site..."/>
      </div>
      <div class="w-full mb-3">
        <h3 class="text-xl mb-1">AV Site</h3>
        <DropdownSelect bind:selected={selected_av} name="av" options={map_ext_site_to_options(data.av_sites)} default_label="Select Site..."/>
      </div>
    </div>
    <div class="flex w-full justify-center">
      <button type="submit" class="bg-cscol-000 py-2 px-3 rounded-sm hover:bg-cscol-100">Save</button>
      <button type="button" class="bg-errcol-100 mx-2 py-2 px-3 rounded-sm" on:click={close_modal}>Close</button>
    </div>
  </form>
</Modal>