<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Modal from "$lib/components/modal.svelte";
    import Table from "$lib/components/table.svelte";
  import type { Company } from "$lib/interfaces/i_db";

  export let data: { companies: Company[] };

  let show_modal = false;
  let selected_name: string = "";

  function close_modal() {
    show_modal = false;
    selected_name = "";
  }
</script>

<div class="flex flex-col p-3 mb-3 w-full h-fit bg-base-200 rounded-sm">
  <div class="w-fit">
    <Button on:click={() => show_modal = true}>
      New Company
    </Button>
  </div>
</div>

<div class="flex flex-col p-3 w-full h-full bg-base-200 rounded-sm">
  <Table
    columns={[
      { key: "company_id", label: "ID" },
      { key: "title", label: "Name" }
    ]}
    data={data.companies}
    filters={[
      {
        name: "Company",
        filters: [
          { key: "company_id", name: "ID", type: "Text" },
          { key: "title", name: "Name", type: "Text" }
        ]
      }
    ]}
    page={1}
    total_items={data.companies.length}
  >
  </Table>
</div>

<Modal bind:show_modal>
  <form class="flex flex-col w-full h-full justify-between" method="post" use:enhance>
    <div class="mx-auto w-2/4">
      <div class="w-full mb-3">
        <h3 class="text-xl mb-1">Name*</h3>
        <input required bind:value={selected_name} name="title" type="text" class="w-full p-1 outline-none border-base-200 focus:border-accent-100 border-b-2 text-base-000" placeholder="Company Name..." />
      </div>
    </div>
    <div class="flex w-full justify-center">
      <button type="submit" class="bg-success py-2 px-3 rounded-sm hover:bg-cscol-100">Save</button>
      <button type="button" class="bg-error mx-2 py-2 px-3 rounded-sm" on:click={close_modal}>Close</button>
    </div>
  </form>
</Modal>