<script lang="ts">
  import axios from "axios";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import type { ABHistory, Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[] };

  let loading = false;
  let adjustments: ABHistory[] = [];

  async function on_sync_click() {
    loading = true;

    const updates_res = await axios.get("/api/v2/autobill/sync");
    const updates_data = updates_res.data.data;

    if (updates_res.status !== 200) {
      console.log("Sync failed!");
      return;  
    }

    adjustments = updates_data.adjustments;
    loading = false;
  }
</script>

<div class="flex flex-col w-full h-full">
  <div class="flex p-3 w-fit">
    <a href="/autobill" class="flex w-32 mx-auto p-3 rounded-md shadow-md justify-center bg-theme-dark-200/75 transition-all hover:bg-theme-dark-400">
      Back
    </a>
  </div>
  <div class="flex flex-col w-full h-full justify-center">
    <div class="flex flex-col mx-auto w-2/3 h-2/3 p-3 justify-center">
      {#if !loading && !adjustments.length}
      <button class="flex w-1/4 mx-auto p-3 rounded-md shadow-md justify-center text-2xl bg-theme-dark-200/75 transition-all hover:bg-theme-dark-400" on:click={on_sync_click}>
        Begin Sync
      </button>
      {:else if loading}
      <div class="flex flex-col w-fit h-fit mx-auto p-3 rounded-md shadow-md bg-theme-dark-200/75">
        <p class="whitespace-nowrap m-auto p-3 text-xl">Getting updates ready...</p>
        <div class="p-1">
          <LoadingSpinner />
        </div>
      </div>
      {:else if !loading && adjustments.length}
      <div class="flex flex-col w-full h-2/3 mx-auto p-3 justify-between space-y-2 rounded-md shadow-md bg-theme-dark-200/75 overflow-hidden">
        <table class="table-auto text-left w-full h-fit border-separate border-spacing-y-1">
          <thead class="bg-theme-dark-300">
            <tr>
              <th class="sticky top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
                Site
              </th>
              <th class="sticky top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
                Contract Units
              </th>
              <th class="sticky top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
                Expected Units
              </th>
              <th class="sticky top-0 p-2 first:rounded-l-md last:rounded-r-md bg-theme-dark-300 whitespace-nowrap">
                Service Type
              </th>
            </tr>
          </thead>
          <tbody>
            {#each adjustments as adjust}
            <tr class="even:bg-theme-dark-200 odd:bg-theme-dark-100 hover:bg-theme-dark-400 hover:cursor-pointer">
              <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>
                {data.sites.find(s => s.site_id === adjust.site_id)?.title || "Unknown"}
              </td>
              <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>
                {adjust.prev_count}
              </td>
              <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>
                {adjust.new_count}
              </td>
              <td class={`p-2 whitespace-nowrap first:rounded-l-md last:rounded-r-md`}>
                {adjust.psa_service_desc === "CSAB_DESK" ? "PC & Laptops" : "Server"}
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
        <button class="flex w-full mx-auto p-2 rounded-md shadow-md justify-center bg-theme-dark-300 transition-all hover:bg-theme-dark-success">
          Approve
        </button>
      </div>
      {/if}
    </div>
  </div>
</div>