<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[] };

  let selected_site: Site | null;
  let select_site_modal = false;
</script>

<div class="flex flex-col w-full h-full">
  <div class="w-full p-2 bg-base-200 shadow-md text-xl">
    <Button on_click={() => select_site_modal = true}>
      {selected_site?.title || "Select Site"}
    </Button>
  </div>
</div>

<Modal bind:show_modal={select_site_modal}>
  <div class="flex flex-col space-y-2 overflow-hidden">
    <Table
      columns={[
        { key: "title", title: "Name" },
        { key: "company", title: "Company" }
      ]}
      data={data.sites.concat(data.sites).concat(data.sites)}
      on_select_row={(data) => {selected_site = data; select_site_modal = false}}
    />
    <Button on_click={() => select_site_modal = false}>
      Close
    </Button>
  </div>
</Modal>