<script lang="ts">
  import "../../app.css";
  import { navigating, page } from "$app/stores";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import Icon from "$lib/components/icon.svelte";
  import NavLink from "$lib/components/nav_link.svelte";

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
    <nav class="flex flex-col space-y-1 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-44 h-full p-1 bg-base-000">
      <NavLink href="/sites" label="Sites">
        <Icon size={32} icon="Home"/>
      </NavLink>
      <NavLink href="/devices" label="Devices">
        <Icon size={32} icon="Monitor"/>
      </NavLink>
    </nav>
    <!-- Contents -->
    <div class="flex flex-col p-2 space-y-2 w-full h-full overflow-hidden">
      {#if $navigating}
        <LoadingSpinner />
      {:else}
        <slot />
      {/if}
    </div>
  </div>
</main>