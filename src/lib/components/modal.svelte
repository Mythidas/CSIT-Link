<script>
  import { createEventDispatcher } from 'svelte'
  
  export let open = false;
  export let title = "";
  export let loading = false;

  const dispatch = createEventDispatcher();
</script>

{#if open}
<div class="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center lg:p-0">
  <div class="modal-overlay fixed w-full h-full bg-theme-dark-100/45 backdrop-blur-sm"></div>
  <div class="flex flex-col z-50 w-1/2 h-2/3 p-2 mx-auto justify-between space-y-2 bg-theme-preset-active rounded-md shadow-md">
    <div class="head p-2 space-y-2 text-2xl font-bold">
      <p>{title}</p>
      <hr />
    </div>
    <div class="content h-full space-y-2 px-2 overflow-hidden">
      <slot />
    </div>
    <div class="footer flex flex-col p-2 justify-center space-y-2">
      <hr />
      <div class="justify-center space-x-1 text-xl">
        <button disabled={loading} class="w-20 rounded-md p-1 bg-theme-dark-success disabled:bg-theme-dark-300 disabled:text-theme-dark-font-300" on:click={() => dispatch("accept")}>
          Accept
        </button>
        <button disabled={loading} class="w-20 rounded-md p-1 bg-theme-dark-error disabled:bg-theme-dark-500 disabled:text-theme-dark-font-300" on:click={() => { dispatch("close"); open = false; }}>
          Close
        </button>
      </div>
    </div>
  </div>
</div>
{/if}