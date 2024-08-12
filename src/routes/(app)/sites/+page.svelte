<script lang="ts">
  import { goto } from "$app/navigation";
  import Table from "$lib/components/table.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[], sites_mismatched: Site[] };

  let current_filter: "All" | "Mismatched" = "All";

  $: filtered_data = current_filter === "All" ? data.sites : data.sites_mismatched;

  function on_select_row(_value: CustomEvent<any>) {
    goto(`/sites/${_value.detail.site_id}`);
  }
</script>

<div class="flex w-full space-x-3">
  <div class="flex flex-col w-52 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">All Sites</p>
    <p class="w-full text-center text-xl rounded-md bg-theme-dark-300">{data.sites.length}</p>
    {#if current_filter === "All"}
    <div class="text-center rounded-md bg-theme-preset-active">
      Selected
    </div>
    {:else}
    <button class="rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={() => { current_filter = "All"}}>
      Select
    </button>
    {/if}
  </div>
  <div class="flex flex-col w-52 p-3 space-y-2 bg-theme-dark-200/75 rounded-md shadow-md">
    <p class="w-full text-center text-xl font-bold">Mismatched Sites</p>
    <p class="w-full text-center text-xl rounded-md bg-theme-dark-300">{data.sites_mismatched.length}</p>
    {#if current_filter === "Mismatched"}
    <div class="text-center rounded-md bg-theme-preset-active">
      Selected
    </div>
    {:else}
    <button class="rounded-md bg-theme-dark-300 text-theme-dark-font-200 hover:bg-theme-dark-400 hover:text-theme-dark-font-100" on:click={() => { current_filter = "Mismatched"}}>
      Select
    </button>
    {/if}
  </div>
</div>
<div class="flex w-full h-full bg-theme-dark-200/75 rounded-md shadow-md overflow-hidden">
  <Table
    columns={[
      { key: "title", label: "Site", type: "String" },
      { key: "company_title", label: "Company", type: "String" },
      { key: "rmm_count", label: "VSA Devices", type: "Number" },
      { key: "av_count", label: "Sophos Devices", type: "Number" },
    ]}
    rows={filtered_data}
    on:select={on_select_row}
  />
</div>