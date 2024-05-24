<script>
  import { page } from "$app/stores";

  export let href = "";
  export let label = "";

  $: selected = $page.url.pathname.includes(href);

  console.log(href)
</script>

<a href={href} class={`${selected ? "bg-base-200 border-accent-100" : "bg-base-150 border-base-150"} flex flex-col w-full p-2 bg-base-150 stroke-font border-l-2 hover:border-accent-100 hover:bg-base-200`}>
  <div class="mx-auto">
    <slot />
  </div>
  <div class="w-full p-1 text-center">
    {label}
  </div>
</a>