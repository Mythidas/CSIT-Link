<script lang="ts">
  import "../../app.css";
  import { navigating, page } from "$app/stores";
  import { goto } from "$app/navigation";
  import NavItem from "$lib/components/site_navbar/nav_item.svelte";
  import NavSubItem from "$lib/components/site_navbar/nav_sub_item.svelte";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import type { Site } from "$lib/interfaces/i_db";
    import Icon from "$lib/components/icon.svelte";

  export let data: { current_site: Site };

  function sites_custom_href(label: string) {
    if (label === "Overview") {
      let split_path = $page.url.pathname.split("/");
      goto(`/sites/overview/${data.current_site?.site_id || split_path[split_path.length - 1] || "-1"}`);
    }
    if (label === "Devices") {
      let split_path = $page.url.pathname.split("/");
      goto(`/sites/devices/${data.current_site?.site_id || split_path[split_path.length - 1] || "-1"}`);
    }
  }
</script>

<main class="relative flex flex-col w-screen h-screen overflow-hidden bg-base-100 text-font">
  <!-- Top Nav -->
  <nav class="fixed flex top-0 shadow-md w-full h-[75px] z-50 bg-base-000">
    <div class="flex w-64 h-full font-bold text-3xl text-accent-100">
      <p class="ml-5 my-auto">CSIT Tools</p>
    </div>
  </nav>
  <!-- Body -->
  <div class="flex w-full h-full pt-[75px]">
    <!-- Side Nav -->
    <nav class="flex flex-col shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-44 h-full p-1 bg-base-000">
      <button class="flex flex-col w-full p-2 bg-base-150 stroke-font border-l-2 border-base-150 hover:border-accent-100 hover:bg-base-200">
        <div class="mx-auto">
          <Icon size={12} icon="Home"/>
        </div>
        <div class="w-full p-1">
          Sites
        </div>
      </button>
    </nav>
    <!-- Contents -->
    <div class="flex flex-col p-3 w-full h-full overflow-hidden">
      {#if $navigating}
        <LoadingSpinner />
      {:else}
        <slot />
      {/if}
    </div>
  </div>
</main>