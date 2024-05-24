<script lang="ts">
  import "../../app.css";
  import { navigating, page } from "$app/stores";
  import { goto } from "$app/navigation";
  import NavItem from "$lib/components/site_navbar/nav_item.svelte";
  import NavSubItem from "$lib/components/site_navbar/nav_sub_item.svelte";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import type { Site } from "$lib/interfaces/i_db";

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

<main class="relative flex flex-col w-screen h-screen overflow-hidden bg-base-000 text-font">
  <!-- Top Nav -->
  <nav class="fixed flex top-0 shadow-lg w-full h-[75px] z-50">
    <div class="flex w-64 h-full font-bold text-3xl text-accent-100">
      <p class="ml-5 my-auto">CSIT Tools</p>
    </div>
  </nav>
  <!-- Body -->
  <div class="flex w-full h-full pt-[75px]">
    <!-- Side Nav -->
    <ul class="flex flex-col shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-64 h-full p-1 bg-base-000">
      <NavItem label={"Sites"} href="/sites" parent>
        <NavSubItem label="Select Site" href="/sites" />
        <NavSubItem label={data.current_site?.title || "No Site Selected"} href="" parent>
          <NavSubItem label="Overview" href="/sites/overview/[slug]" custom_href={sites_custom_href} />
          <NavSubItem label="Devices" href="/sites/devices/[slug]" custom_href={sites_custom_href} />
        </NavSubItem>
      </NavItem>
      <!-- <NavItem label="Reports" href="/reports" parent>
        <NavSubItem label="Devices" href="" parent>
          <NavSubItem label="All" href="/reports/devices/all" />
          <NavSubItem label="Unhealthy" href="/reports/devices/unhealthy" />
        </NavSubItem>
      </NavItem> -->
      <!-- <NavItem label="Configuration" href="/configuration" parent>
        <NavSubItem label="Companies" href="/configuration/companies" />
        <NavSubItem label="Sites" href="/configuration/sites"/>
      </NavItem> -->
    </ul>
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