<script lang="ts">
  export let label: string;
  export let href: string;

  let is_hover = false;
</script>

<a href={href} class="flex w-full h-fit relative stroke-font hover:cursor-pointer" on:mouseover={() => is_hover = true} on:focus on:mouseleave={() => is_hover = false}>
  <div class="flex flex-col w-full items-center py-2 px-3 hover:shadow-md border-l-2 border-l-accent-100 bg-gradient-to-r from-base-200 to-accent-100">
    <slot />
    <p>{label}</p>
  </div>
  <div class="absolute flex flex-col w-full items-center py-2 px-3 transition bg-base-200 hover:opacity-0">
    <slot />
    <p>{label}</p>
  </div>
</a>