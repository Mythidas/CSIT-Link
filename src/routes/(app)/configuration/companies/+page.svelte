<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/button.svelte";
    import Input from "$lib/components/input.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Table from "$lib/components/table.svelte";
  import type { Company } from "$lib/interfaces/i_db";

  export let data: { companies: Company[] };

  let show_modal = false;
  let selected_name: string = "";
  let form: HTMLFormElement;

  function close_modal() {
    show_modal = false;
    selected_name = "";
  }
</script>

<div class="flex flex-col p-3 w-full h-fit bg-base-200 rounded-sm">
  <div class="w-fit">
    <Button on:click={() => show_modal = true}>
      New Company
    </Button>
  </div>
</div>

<div class="flex flex-col p-3 w-full h-full bg-base-200 rounded-sm">
  <Table
    columns={[
      { key: "company_title", name: "Name", group: "Company", type: "Text" }
    ]}
    data="/api/v2/companies"
    page={1}
    total_items={data.companies.length}
  >
  </Table>
</div>

<Modal title="New Company" bind:open={show_modal} on:accept={() => form.requestSubmit()}>
  <form class="flex flex-col w-full h-fit justify-between" method="post" bind:this={form} use:enhance>
    <div class="w-full mb-3">
      <label for="title" class="text-xl">Name*</label>
      <Input bind:value={selected_name} required name="title" placeholder="Company name..."/>  
    </div>
  </form>
</Modal>