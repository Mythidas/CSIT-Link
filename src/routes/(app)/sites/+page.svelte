<script lang="ts">
  import DropdownSelect from "$lib/components/dropdown_select.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { sites: Site[] };

  function sites_to_options() {
    return data.sites.map(site => {
      return { label: site.title, value: site.site_id.toString() };
    });
  }
</script>

<div class="flex flex-col w-full h-full">
  <div class="w-full p-3 bg-base-200 shadow-md">
    Sites
  </div>
</div>