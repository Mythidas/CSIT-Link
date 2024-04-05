<script lang="ts">
  import { enhance } from "$app/forms";
  import Modal from "$lib/components/modal.svelte";
  import type { Company } from "$lib/interfaces/i_db";

  export let data: { companies: Company[] };

  let show_modal = false;
  let selected_name: string = "";
</script>

<div class="flex flex-col p-3 mb-3 w-full h-fit bg-cscol-400 rounded-sm">
  <div class="flex">
    <button on:click={() => {show_modal = true}} class="bg-cscol-000 py-2 px-3 rounded-sm hover:bg-cscol-100">
      New Company
    </button>
  </div>
</div>

<div class="flex flex-col p-3 w-full h-full bg-cscol-400 rounded-sm">
  <div class="flex w-full h-full">
    <table class="table-auto w-full h-fit text-left overflow-y-scroll">
      <thead class="border-b-2 border-cscol-200 text-lg">
        <tr>
          <th class="pl-1">ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody class="text-base">
        {#each data.companies as company}
          <tr
            class={`even:bg-cscol-400 odd:bg-cscol-500 hover:bg-cscol-100 hover:cursor-pointer`}
          >
            <td class="pl-1">{company.company_id}</td>
            <td>{company.title}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal bind:show_modal>
  <form class="flex flex-col w-full h-full justify-between" method="post" use:enhance>
    <div class="mx-auto w-2/4">
      <div class="w-full mb-3">
        <h3 class="text-xl mb-1">Name*</h3>
        <input required bind:value={selected_name} name="title" type="text" class="w-full p-1 outline-none border-cscol-100 focus:border-cscol-200 border-2 text-cscol-600" placeholder="Company Name..." />
      </div>
    </div>
    <div class="flex w-full justify-center">
      <button type="submit" class="bg-cscol-000 py-2 px-3 rounded-sm hover:bg-cscol-100">Save</button>
      <button type="button" class="bg-errcol-100 mx-2 py-2 px-3 rounded-sm" on:click={() => {show_modal = false}}>Close</button>
    </div>
  </form>
</Modal>