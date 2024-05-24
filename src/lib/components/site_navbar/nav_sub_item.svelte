<script lang="ts">
  import { page } from "$app/stores";

  export let label: string;
  export let href: string;
  export let icon: string = "";
  export let custom_href: (label: string) => void = (label: string) => {};
  export let parent = false;

  let is_local_url = false;
  let has_slug = false;
  $: {
    has_slug = false;
    is_local_url = true;

    let href_split = href.split("/");
    let path_split = $page.url.pathname.split("/");

    if (href_split.length !== path_split.length) {
      is_local_url = false;
    }

    for (let i = 1; i < href_split.length; i++) {
      if (href_split[i] !== "[slug]") {
        if (href_split[i] !== path_split[i]) {
          is_local_url = false;
        }
      } else {
        has_slug = true;
      }
    }
  }
</script>

{#if parent}
<div class={`flex relative w-full h-fit py-1 shadow-md bg-base-150`}>
  <div class="pl-1 w-7"><img src={icon} alt="" /></div>
  <div class="pl-1">
    {label}
  </div>
</div>
<ul class={`flex flex-col pl-2 transition-all duration-300 overflow-hidden w-full bg-base-150`}>
  <slot />
</ul>
{:else if has_slug}
<button on:click={() => custom_href(label)} class={`${is_local_url ? "border-l-4 border-accent-100 bg-base-200" : "bg-base-100"} flex relative w-full h-fit py-1 hover:border-l-4 hover:border-accent-100 hover:bg-base-150`}>
  <div class="pl-1 w-7"><img src={icon} alt="" /></div>
  <div class="pl-1">
    {label}
  </div>
</button>
{:else}
<a href={href} class={`${is_local_url ? "border-l-4 border-accent-100 bg-base-200" : "bg-base-100"} flex relative w-full h-fit py-1 hover:border-l-4 hover:border-accent-100`}>
  <div class="pl-1 w-7"><img src={icon} alt="" /></div>
  <div class="pl-1">
    {label}
  </div>
</a>
{/if}