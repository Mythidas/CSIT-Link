<script lang="ts">
  import AccordionBox from "$lib/components/accordion_box.svelte";
  import AccordionTab from "$lib/components/accordion_tab.svelte";
  import Button from "$lib/components/button.svelte";
  import Table from "$lib/components/table.svelte";
  import type { Device, Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[], devices: Device[] };

  let selected_site: Site | null;
  let sites_state: "Min" | "Mid" | "Max";
</script>

<AccordionBox>
  <AccordionTab title={selected_site?.title || "Select Site"} bind:state={sites_state}>
    <Table
      columns={[
        { key: "title", label: "Name" },
        { key: "company", label: "Company" }
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
      on:select_row={(data) => { selected_site = data.detail; sites_state = "Min"; }}
    />
  </AccordionTab>
  <AccordionTab title={`Devices (${data.devices.length})`} state="Max">
    <Table
      columns={[
        { key: "title", label: "Name" },
        { key: "site_id", label: "Site" }
      ]}
      data={data.devices}
      filters={[
        {
          name: "Device",
          filters: [
            { name: "Name", key: "title", type: "Text" },
            { name: "Site", key: "site_id", type: "Bool" },
          ]
        }
      ]}
    />
  </AccordionTab>
</AccordionBox>