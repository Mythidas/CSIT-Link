<script lang="ts">
  import Input from "$lib/components/input.svelte";

  let search_value: string;
</script>

<div class="flex w-full h-full p-2 bg-base-200">
  <div class="flex w-full h-fit text-2xl">
    <Input bind:value={search_value} placeholder="Search Reports..."/>
  </div>
</div>