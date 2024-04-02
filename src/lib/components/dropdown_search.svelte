<script lang="ts">
  interface _Option {
    key: string,
    value: string
  }

  export let options: _Option[];
  export let default_label = "Choose Option...";

  let filter = "";
  let opened = false;
  let select_value: _Option | null = null;
</script>

<div class="relative w-full">
  <button on:click={() => opened = !opened} class={`${opened ? "bg-cscol-100" : "bg-cscol-000"} flex p-1 w-full h-fit justify-between hover:bg-cscol-100`}>
    <p>{select_value ? select_value.value : default_label}</p>
    <img src={opened ? "/chevron-up.svg" : "/chevron-down.svg"} alt="" />
  </button>
  {#if opened}
  <div class="flex flex-col absolute w-full h-52 z-10 shadow-lg shadow-cscol-600 bg-cscol-000">
    <input class="w-full p-1 outline-none border-cscol-100 focus:border-cscol-200 border-2 text-cscol-600" placeholder={default_label} />
    <div class="flex flex-col">
      {#each options as option}
        {#if option.value.toLowerCase().localeCompare(filter.toLowerCase())}
          <button class="flex w-full p-1 hover:bg-cscol-100">{option.value}</button>
        {/if}
      {/each}
    </div>
  </div>
  {/if}
</div>