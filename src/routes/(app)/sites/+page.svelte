<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[] };

  let selected_site: Site | null;
  let select_site_visible = false;
</script>

<div class="flex flex-col w-full h-full">
  <div class="flex flex-col w-full space-y-2 p-2 bg-base-200 shadow-md text-xl">
    <div class="w-fit">
      <Button on:click={() => select_site_visible = !select_site_visible}>
        {selected_site?.title || "Select Site"}
      </Button>
    </div>
    {#if select_site_visible}
    <div class="flex flex-col h-72 space-y-2 text-base overflow-hidden">
      <Table
        columns={[
          { key: "title", title: "Name" },
          { key: "company", title: "Company" }
        ]}
        data={data.sites}
        filters={[
          {
            name: "Site",
            filters: [
              { name: "Name", key: "title", type: "Text" },
              { name: "Company", key: "company", type: "Text" },
            ]
          }
        ]}
        on_select_row={(data) => {selected_site = data; select_site_visible = false}}
      />
    </div>
    {/if}
  </div>
</div>