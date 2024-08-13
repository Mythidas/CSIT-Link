<script lang="ts">
  import { page } from "$app/stores";

  export let label: string;
  export let link: string;

  let is_hovered = false;
  
  $: is_active = $page.url.pathname.split("/")[1].includes(link.slice(1));
</script>

<a 
  href={link} 
  class={`flex w-full p-2 ${is_hovered ||  is_active ? "stroke-theme-dark-font-100 text-theme-dark-font-100" : "stroke-theme-dark-font-300 text-theme-dark-font-300"}`}
  on:mouseenter={() => { is_hovered = true; }} 
  on:mouseleave={() => { is_hovered = false; }}
>
  <div class={`${is_active ? "bg-theme-preset-active" : is_hovered ? "bg-theme-dark-500" : "bg-theme-dark-200"} shadow-md p-1 rounded-md`}>
    <slot />
  </div>
  <div class="flex text-2xl pl-3 w-full h-fit my-auto">
    {label}
  </div>
</a>