<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[] };
</script>

<h3 class="flex text-2xl p-2 bg-base-200">
  All Sites <p class="px-2 ml-2 bg-accent-100 rounded-md">{data.sites.length}</p>
</h3>
<div class="flex w-full h-[99%] p-2 space-x-2 bg-base-200 overflow-auto">
  <div class="w-full h-full overflow-auto">
    <table class="table-auto text-left w-full h-fit bg-base-100 shadow-md">
      <thead>
        <tr>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Site
          </th>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Company
          </th>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            VSA Count
          </th>
          <th class="sticky top-0 first:left-0 p-2 first:z-50 whitespace-nowrap shadow-[inset_0_-2px_0_rgba(127,133,245,1)] bg-base-100 stroke-accent-100 hover:bg-base-150 hover:cursor-pointer">
            Sophos Count
          </th>
        </tr>
      </thead>
      <tbody>
        {#each data.sites as _site}
        <tr class="even:bg-base-100 odd:bg-base-150 hover:bg-base-300 hover:cursor-pointer" on:click={() => { goto(`/sites/${_site.site_id}`)}}>
          <td class={`px-2 py-1 whitespace-nowrap`}>{_site.title}</td>
          <td class={`px-2 py-1 whitespace-nowrap`}>{_site.company_title || "-"}</td>
          <td class={`px-2 py-1 whitespace-nowrap ${_site.rmm_count !== _site.av_count && "bg-error"}`}>{_site.rmm_count || "-"}</td>
          <td class={`px-2 py-1 whitespace-nowrap ${_site.rmm_count !== _site.av_count && "bg-error"}`}>{_site.av_count || "-"}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>