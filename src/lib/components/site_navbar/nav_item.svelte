<script lang="ts">
  export let label: string;
  export let icon: string = "";
  export let href: string = "";

  $: opened = false;
  $: has_child = href !== "";
</script>

{#if has_child}
<li>
  <button on:click={() => (opened = !opened)} class="flex relative w-full h-fit px-3 py-3 justify-center text-center font-bold text-xl shadow-md">
    <div><img src={icon} alt="" /></div>
    <div>
      {label}
    </div>
    <img class="absolute right-2 top-4" src={opened ? "/chevron-up.svg" : "/chevron-down.svg"} alt="" />
  </button>
  <ul class={`${opened ? "max-h-96" : "max-h-0"} flex flex-col mb-2 transition-all duration-300 ease-in-out overflow-hidden w-full`}>
    <slot />
  </ul>
</li>
{:else}
<li>
  <a href={href} class="flex relative w-full h-fit px-3 py-3 justify-center text-center font-bold text-xl shadow-md shadow-cscol-500 hover:bg-cscol-100">
    <div><img src={icon} alt="" /></div>
    <div>
      {label}
    </div>
  </a>
</li>
{/if}