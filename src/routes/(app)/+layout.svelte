<script lang="ts">
  import "../../app.css";
  import cslogo from "$lib/assets/csicon.png";
  import { navigating, page } from "$app/stores";
  import LoadingSpinner from "$lib/components/loading_spinner.svelte";
  import type { Site } from "$lib/interfaces/i_db";
  import DropdownSearch from "$lib/components/dropdown_search.svelte";
  import { goto } from "$app/navigation";
  import Icon from "$lib/components/icon.svelte";
  import NavLink from "$lib/components/nav_link.svelte";

  export let data: { user: any, sites: Site[] };

  let is_background_active = false;

  function on_search_site(_value: CustomEvent<any>) {
    goto(`/sites/${_value.detail.value}`);
  }
</script>

<main class="relative flex w-screen h-screen overflow-hidden bg-theme-dark-100 text-theme-dark-font-100">
  <div class={`flex w-full h-full ${is_background_active ? "bg-gradient-to-br from-theme-dark-400/35 to-theme-dark-600/20" : ""}`}>
  <!--Nav Panel-->
  <div class="flex flex-col w-48">
    <!--Logo Panel-->
    <div class="flex h-20 px-3 py-0">
      <img alt="Site logo" class="w-10 h-10 p-1 mr-2 my-auto" src={cslogo}/>
      <p class="my-auto text-2xl text-theme-dark-font-100">Tools</p>
    </div>
    <!--Link Panel-->
    <div class="flex flex-col w-full h-full justify-between">
      <div class="flex flex-col h-full px-1">
        <NavLink label="Sites" link="/sites">
          <Icon size={32} icon="Home"/>
        </NavLink>
        <NavLink label="Reports" link="/reports">
          <Icon size={32} icon="Monitor"/>
        </NavLink>
      </div>
      <div class="flex flex-col w-full h-fit p-3 justify-center">
        <label
          for="toggleFour"
          class="flex items-center cursor-pointer select-none mx-auto text-theme-dark-font-100"
          >
          <div class="relative">
            <input
                type="checkbox"
                id="toggleFour"
                class="peer sr-only"
                bind:checked={is_background_active}
                />
            <div
                class="block h-8 rounded-full box bg-theme-dark-200 w-14 peer-checked:bg-theme-dark-400"
                ></div>
            <div
                class="absolute flex items-center justify-center w-6 h-6 transition bg-theme-dark-500 rounded-full dot left-1 top-1 peer-checked:translate-x-full"
                ></div>
          </div>
        </label>
        <p class="mx-auto text-theme-dark-font-200">Toggle Background</p>
      </div>
    </div>
  </div>
  <!--Content Panel-->
  <div class="flex flex-col w-full h-full">
    <!--Primary Bar-->
    <div class="flex w-full h-20 justify-between">
      <div class="flex p-3 my-auto text-3xl text-theme-dark-font-100">
      </div>
      <div class="flex w-96 p-3 my-auto">
        <DropdownSearch options={data.sites.map((_site) => {
            return { label: _site.title, value: _site.site_id.toString() };
          })}
          on:select={on_search_site}
        />
      </div>
    </div>
    <!--Body-->
    <div class="flex flex-col w-full h-full p-3 pt-0 space-y-2 stroke-theme-dark-font-100 overflow-hidden">
      {#if $navigating}
      <div class={`w-fit h-fit m-auto rounded-md shadow-md bg-theme-dark-200`}>
        <LoadingSpinner />
      </div>
      {:else}
      <slot />
      {/if}
    </div>
  </div>
  </div>
</main>