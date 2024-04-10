<script lang="ts">
  import type { Patch } from "$lib/interfaces/i_db";

  export let data: { patches: Patch[] };
</script>

<div class="mx-auto w-2/5 bg-cscol-400 text-center text-3xl font-bold py-8 rounded-sm">
  Welcome to CSIT Link
</div>

<div class="mx-auto my-2 w-2/5 h-2/4 bg-cscol-400 text-center text-3xl font-bold py-3 rounded-sm">
  Recent Patch Notes
  <div class="flex flex-col overflow-y-auto h-full">
    {#each data.patches as patch}
      <div class="m-3 p-3 bg-cscol-500">
        <div class="flex flex-col w-full justify-center space-x-2 mb-2">
          <p class="text-2xl">{patch.title}</p>
          <p class="my-auto text-xl">({patch.app_ver})</p>
        </div>
        {#each patch.description.split("\\n") as line}
          <p class="text-lg">{line}</p>
        {/each}
      </div>
    {/each}
  </div>
</div>