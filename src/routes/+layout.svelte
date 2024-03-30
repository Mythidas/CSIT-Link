<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import NavItem from "$lib/components/site_navbar/nav_item.svelte";
  import NavSubItem from "$lib/components/site_navbar/nav_sub_item.svelte";
</script>

<main class="flex flex-col w-screen h-screen bg-cscol-500 text-cscol-font">
  <!-- Top Nav -->
  <nav class="flex shadow-lg w-full h-20 z-0">
    <div class="flex w-52 h-full font-bold text-3xl text-cscol-100">
      <p class="ml-5 my-auto">CSIT Link</p>
    </div>
    <div>TopNav</div>
  </nav>
  <!-- Body -->
  <div class="flex w-full h-full">
    <!-- Side Nav -->
    <ul class="flex flex-col shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-52 bg-cscol-400">
      <NavItem label="Home" href="/"/>
      <NavItem label={"Sites"} href="/sites" parent>
        <NavSubItem label="Select Site" href="/sites"/>
        <NavSubItem label="Overview" href="/sites/overview"/>
      </NavItem>
    </ul>
    <!-- Contents -->
    <div class="flex flex-col relative p-3 w-full h-full">
      <slot />
    </div>
  </div>
</main>