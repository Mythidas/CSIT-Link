<script lang="ts">
  import { current_site } from '$lib/stores.js';

  export let data;

  $: {
    $current_site = data.site || null;
  }
</script>

<div class="flex flex-col w-full h-full">
  <div class="flex flex-col w-full p-3 rounded-sm bg-cscol-400">
    <h3 class="text-2xl">{$current_site?.title}</h3>
    <div class="flex">
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</div>