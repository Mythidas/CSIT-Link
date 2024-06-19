<script lang="ts">
  export let data;
</script>

<h3 class="flex space-x-2 text-2xl p-2 bg-base-200">
  <a href="/sites" class="hover:underline">Sites</a>
  <p>{">"}</p>
  <a href={`/sites/${data.site?.site_id}`} class="hover:underline">{data.site?.title}</a>
  <p>{">"}</p>
  <p>{data.device?.hostname}</p>
</h3>
<div class="flex flex-col w-full h-full p-2 bg-base-200 overflow-hidden">

</div>