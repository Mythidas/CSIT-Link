<script lang="ts">
  import axios from "axios";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import type { ABHistory, Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[] };

  let loading = false;
  let adjustments: ABHistory[] = [{
    id: -1,
    new_count: 2,
    prev_count: 1,
    psa_contract_id: 29684082,
    psa_service_desc: "CSAB_SERV",
    psa_service_id: 18,
    psa_service_type: "BUNDLE",
    site_id: 8
  }];

  async function on_sync_click() {
    const _start = Date.now();
    loading = true;

    const updates_res = await axios.get("/api/v2/autobill/sync");
    const updates_data = updates_res.data.data;

    if (updates_res.status !== 200) {
      console.log("Sync failed!");
      return;  
    }

    adjustments = updates_data.adjustments;
    console.log(updates_data.adjustments);
    // console.log(updates_data.failures);
    loading = false;
    console.log(`${(Date.now() - _start) / 1000} seconds elapsed`);
  }
</script>

<div class="flex flex-col w-full h-full">
  <div class="flex p-3 w-fit">
    <a href="/autobill" class="flex w-32 mx-auto p-3 rounded-md shadow-md justify-center bg-base-150 transition-all hover:bg-base-200 hover:scale-110">
      Back
    </a>
  </div>
  <div class="flex flex-col w-full h-full justify-center">
    <div class="flex flex-col mx-auto w-2/3 h-2/3 p-3 justify-center">
      {#if !loading && !adjustments.length}
      <button class="flex w-1/4 mx-auto p-3 rounded-md shadow-md justify-center text-2xl bg-base-150 transition-all hover:bg-base-200 hover:scale-110" on:click={on_sync_click}>
        Begin Sync
      </button>
      {:else if loading}
      <div class="flex flex-col w-fit h-32 mx-auto p-3 rounded-md shadow-md bg-base-150">
        <p class="whitespace-nowrap m-auto p-3 text-xl">Getting updates ready...</p>
        <LoadingSpinner />
      </div>
      {:else if !loading && adjustments.length}
      <div class="flex flex-col w-2/3 h-2/3 mx-auto p-3 justify-between space-y-2 rounded-md shadow-md bg-base-150 overflow-hidden">
        <table class="table-auto overflow-auto text-center shadow-md">
          <thead class="bg-base-000">
            <tr>
              <th>Site</th>
              <th>Current Count</th>
              <th>New Count</th>
              <th>Service</th>
            </tr>
          </thead>
          <tbody>
            {#each adjustments as adjust}
            <tr class="odd:bg-base-150 hover:bg-base-300 hover:cursor-pointer">
              <td class="py-1">{data.sites.find(s => s.site_id === adjust.site_id)?.title || "Unknown"}</td>
              <td>{adjust.prev_count}</td>
              <td>{adjust.new_count}</td>
              <td>{adjust.psa_service_desc === "CSAB_DESK" ? "PC & Laptops" : "Server"}</td>
            </tr>
            {/each}
          </tbody>
        </table>
        <button class="flex w-full mx-auto p-2 shadow-md justify-center bg-base-200 transition-all hover:bg-base-300">
          Approve
        </button>
      </div>
      {/if}
    </div>
  </div>
</div>