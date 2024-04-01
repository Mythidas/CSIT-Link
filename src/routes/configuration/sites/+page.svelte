<script lang="ts">
  import Modal from "$lib/components/modal.svelte";
    import type _ExtSite from "$lib/interfaces/ext_site";

  export let data: { sites: any[], psa_sites: _ExtSite[], rmm_sites: _ExtSite[], av_sites: _ExtSite[] };

  let show_modal = false;

  $: selected = { 
    site_id: -1,
    title: "",
    psa_id: "",
    rmm_id: "", 
    av_id: "",
    av_url: ""
  };

  function set_selected(id: number) {
    selected = data.sites.filter(site => site.site_id === id)[0];
  }

  async function create_new_site() {

  }
</script>

<div class="flex flex-col p-3 mb-3 w-full h-fit bg-cscol-400 rounded-sm">
  <div class="flex">
    <button on:click={() => {show_modal = true}} class="bg-cscol-100 py-2 px-3 rounded-sm">
      New Site
    </button>
  </div>
</div>

<div class="flex flex-col p-3 w-full h-full bg-cscol-400 rounded-sm">
  <div class="flex w-full h-full">
    <table class="table-auto w-2/3 h-fit text-left overflow-y-scroll">
      <thead class="border-b-2 border-cscol-200 text-lg">
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody class="text-base">
        {#each data.sites as site}
          <tr
            on:click={() => set_selected(site.site_id)}
            class={`${selected.site_id === site.site_id ? "bg-cscol-000" : "even:bg-cscol-400 odd:bg-cscol-500"} hover:bg-cscol-100 hover:cursor-pointer`}
          >
            <td>{site.site_id}</td>
            <td>{site.title}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="flex m-0.5 p-3 w-1/3 h-full border-l-2 border-cscol-200">
      {#if selected.site_id !== -1}
      <div class="flex flex-col">
        <p>Site: {selected.title}</p>
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
  <div class="flex flex-col w-full h-full justify-between">
    <div>
      
    </div>
    <div class="flex w-full justify-center">
      <button class="bg-cscol-100 py-2 px-3 rounded-sm" on:click={create_new_site}>Save</button>
      <button class="bg-errcol-100 mx-2 py-2 px-3 rounded-sm" on:click={() => {show_modal = false}}>Cancel</button>
    </div>
  </div>
</Modal>