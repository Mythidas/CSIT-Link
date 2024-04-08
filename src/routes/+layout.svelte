<script lang="ts">
  import "../app.css";
  import { navigating, page } from "$app/stores";
  import { goto } from "$app/navigation";
  import NavItem from "$lib/components/site_navbar/nav_item.svelte";
  import NavSubItem from "$lib/components/site_navbar/nav_sub_item.svelte";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import type { Site } from "$lib/interfaces/i_db";

  export let data: { site: Site | null };

  function sites_custom_href(label: string) {
    if (label === "Overview") {
      let split_path = $page.url.pathname.split("/");
      if (split_path[1] === "sites" && split_path.length > 2) {
        goto(`/sites/overview/${split_path[split_path.length - 1]}`);
      } else {
        goto(`/sites`);
      }
    } 
  }
</script>

<main class="flex flex-col w-screen h-screen bg-cscol-600 text-cscol-font">
  <!-- Top Nav -->
  <nav class="flex shadow-lg w-full h-20 z-0">
    <div class="flex w-56 h-full font-bold text-3xl text-cscol-200">
      <p class="ml-5 my-auto">CSIT Link</p>
    </div>
    <div>TopNav</div>
  </nav>
  <!-- Body -->
  <div class="flex w-full h-full">
    <!-- Side Nav -->
    <ul class="flex flex-col shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-64 bg-cscol-400">
      <NavItem label="Home" href="/"/>
      <NavItem label={"Sites"} href="/sites" parent>
        <NavSubItem label="Select Site" href="/sites" />
        <NavSubItem label={data.site?.title || "No Site Selected"} href="" parent>
          <NavSubItem label="Overview" href="/sites/overview/[slug]" custom_href={sites_custom_href} />
        </NavSubItem>
      </NavItem>
      <NavItem label="Configuration" href="/configuration" parent>
        <NavSubItem label="Companies" href="/configuration/companies" />
        <NavSubItem label="Sites" href="/configuration/sites"/>
      </NavItem>
    </ul>
    <!-- Contents -->
    <div class="flex flex-col relative p-3 w-full h-full">
      {#if $navigating}
        <LoadingSpinner />
      {:else}
        <slot />
      {/if}
    </div>
  </div>
</main>