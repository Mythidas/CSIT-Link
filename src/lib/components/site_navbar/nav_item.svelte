<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "../icon.svelte";

  export let label: string;
  export let icon: "None" | "Home" | "Up" | "Down" | "Filter" | "Menu" | "Minus" | "Minimize" | "Maximize" = "None";
  export let href: string = "";
  export let parent: boolean = false;

  $: selected = $page.url.pathname === href || $page.url.pathname.split('/')[1].includes(href.slice(1));
  $: opened = selected;
</script>

{#if parent}
<li>
  <button on:click={() => (opened = !opened)} class={`${selected && "border-l-4 border-accent-100"} flex w-full h-fit justify-between py-3 text-xl shadow-sm z-10 bg-base-150 stroke-font hover:bg-base-200`}>
    <div class="pl-3">
      <div class="pl-1 w-7"><Icon icon={icon}/></div>
      <div class="pl-1">
        {label}
      </div>
    </div>
    <div class="pr-3">
      <Icon icon={opened ? "Up" : "Down"}/>
    </div>
  </button>
  <ul class={`${opened ? "max-h-96" : "max-h-0"} flex flex-col transition-all duration-300 overflow-hidden w-full shadow-[inset_0_-1px_4px_rgba(0,0,0,0.6)]`}>
    <slot />
  </ul>
</li>
{:else}
<li>
  <a href={href} class={`${$page.url.pathname === href && "bg-accent-100"} flex relative w-full h-fit py-3 text-xl shadow-sm hover:bg-accent-100`}>
    <div class="pl-1 w-7"><Icon icon={icon}/></div>
    <div class="pl-1">
      {label}
    </div>
  </a>
</li>
{/if}