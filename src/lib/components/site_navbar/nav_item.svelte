<script lang="ts">
  import { page } from "$app/stores";

  export let label: string;
  export let icon: string = "";
  export let href: string = "";
  export let parent: boolean = false;

  $: opened = $page.url.pathname === href || $page.url.pathname.includes(href);
</script>

{#if parent}
<li>
  <button on:click={() => (opened = !opened)} class="flex relative w-full h-fit py-3 font-bold text-xl shadow-sm shadow-cscol-500">
    <div class="pl-1 w-7"><img src={icon} alt="" /></div>
    <div class="pl-1">
      {label}
    </div>
    <img class="absolute right-2 top-4" src={opened ? "/chevron-up.svg" : "/chevron-down.svg"} alt="" />
  </button>
  <ul class={`${opened ? "max-h-96" : "max-h-0"} flex flex-col mb-2 transition-all duration-300 overflow-hidden w-full shadow-[inset_0_-1px_4px_rgba(0,0,0,0.6)]`}>
    <slot />
  </ul>
</li>
{:else}
<li>
  <a href={href} class={`${$page.url.pathname === href && "bg-cscol-100"} flex relative w-full h-fit py-3 font-bold text-xl shadow-sm shadow-cscol-500 hover:bg-cscol-100`}>
    <div class="pl-1 w-7"><img src={icon} alt="" /></div>
    <div class="pl-1">
      {label}
    </div>
  </a>
</li>
{/if}