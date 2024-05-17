<script lang="ts">
  import DropdownSelect from "$lib/components/dropdown_select.svelte";
  import Modal from "$lib/components/modal.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[] };

  let selected_site: Site | null;
  let select_site_modal = false;

  function sites_to_options() {
    return data.sites.map(site => {
      return { label: site.title, value: site.site_id.toString() };
    });
  }
</script>

<div class="flex flex-col w-full h-full">
  <div class="w-full p-2 bg-base-200 shadow-md">
    <button class="p-2 transition bg-base-300 shadow-md border-b-2 border-base-300 hover:border-accent-100" on:click={() => select_site_modal = true}>
      {selected_site?.title || "Select site"}
    </button>
  </div>
</div>

<Modal bind:show_modal={select_site_modal}>
  
</Modal>