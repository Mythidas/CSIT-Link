<script lang="ts">
  import "../../app.css";
  import { navigating, page } from "$app/stores";
  import { goto } from "$app/navigation";
  import NavItem from "$lib/components/site_navbar/nav_item.svelte";
  import NavSubItem from "$lib/components/site_navbar/nav_sub_item.svelte";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import { all_sites, current_site } from "$lib/stores";
  import type { Site } from "$lib/interfaces/i_db";
  import DropdownSearch from "$lib/components/dropdown_search.svelte";
  import DropdownSelect from "$lib/components/dropdown_select.svelte";

  export let data: { sites: Site[], current_site: Site };

  $: {
    $current_site = data.current_site || $current_site;
    $all_sites = data.sites;
  }

  function sites_custom_href(label: string) {
    if (label === "Overview") {
      let split_path = $page.url.pathname.split("/");
      goto(`/sites/overview/${$current_site?.site_id || split_path[split_path.length - 1] || "-1"}`);
    }
    if (label === "Devices") {
      let split_path = $page.url.pathname.split("/");
      goto(`/sites/devices/${$current_site?.site_id || split_path[split_path.length - 1] || "-1"}`);
    }
  }

  function get_site_options() {
    return data.sites.map((site) => {
      return { label: site.title, key: site.site_id.toString() };
    })
  }

  function on_site_dropdown_select(option: any) {
    goto(`/sites/overview/${option.key}`);
  }
</script>

<main class="relative flex flex-col w-screen h-screen overflow-hidden bg-cscol-600 text-cscol-font">
  <!-- Top Nav -->
  <nav class="fixed flex top-0 shadow-lg w-full h-[75px] z-50">
    <div class="flex w-64 h-full font-bold text-3xl text-cscol-200">
      <p class="ml-5 my-auto">CSIT Link</p>
    </div>
    <div class="flex w-full">
      <div class="flex w-1/3 my-auto text-xl space-x-0">
        <div class="w-20 h-full my-auto">
          <DropdownSelect options={[{ label: "Site", key: "Site" }]} default_label={"Site"} no_search size="Shrink" rounded="Left" />
        </div>
        <DropdownSearch options={get_site_options()} default_label="Select Site" on_select={on_site_dropdown_select} />
      </div>
    </div>
  </nav>
  <!-- Body -->
  <div class="flex w-full h-full pt-[75px]">
    <!-- Side Nav -->
    <ul class="flex flex-col shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-64 h-full bg-cscol-400">
      <NavItem label="Home" href="/"/>
      <NavItem label={"Sites"} href="/sites" parent>
        <NavSubItem label="Select Site" href="/sites" />
        <NavSubItem label={$current_site?.title || "No Site Selected"} href="" parent>
          <NavSubItem label="Overview" href="/sites/overview/[slug]" custom_href={sites_custom_href} />
          <NavSubItem label="Devices" href="/sites/devices/[slug]" custom_href={sites_custom_href} />
        </NavSubItem>
      </NavItem>
      <NavItem label="Reports" href="/reports" parent>
        <NavSubItem label="Devices" href="" parent>
          <NavSubItem label="All" href="/reports/devices/all" />
          <NavSubItem label="Unhealthy" href="/reports/devices/unhealthy" />
        </NavSubItem>
      </NavItem>
      <NavItem label="Configuration" href="/configuration" parent>
        <NavSubItem label="Companies" href="/configuration/companies" />
        <NavSubItem label="Sites" href="/configuration/sites"/>
      </NavItem>
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