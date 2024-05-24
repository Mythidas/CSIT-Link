<script lang="ts">
  export let icon: "None" | "Home" | "Up" | "Down" | "Filter" | "Menu" | "Minus" | "Minimize" | "Maximize";
  export let size = 10;

  const _class = `w-${size} h-${size}`;
</script>

{#if icon === "Home"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
  </path><polyline points="9 22 9 12 15 12 15 22"></polyline>
</svg>
{:else if icon === "Up"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="18 15 12 9 6 15"></polyline>
</svg>
{:else if icon === "Down"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="6 9 12 15 18 9"></polyline>
</svg>
{:else if icon === "Filter"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
</svg>
{:else if icon === "Menu"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line>
  <line x1="3" y1="18" x2="21" y2="18"></line>
</svg>
{:else if icon === "Minus"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
{:else if icon === "Minimize"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
</svg>
{:else if icon === "Maximize"}
<svg class={_class} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
</svg>
{/if}