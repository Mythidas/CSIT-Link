<script>
  import { createEventDispatcher } from 'svelte'
  
  export let open = false;
  export let title = "";
  export let loading = false;

  const dispatch = createEventDispatcher();
</script>

{#if open}
<div class="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
  <div class="modal-overlay fixed w-full h-full bg-base-100 bg-opacity-75"></div>
  <div class="flex flex-col z-50 w-1/2 h-2/3 p-2 mx-auto justify-between space-y-2 bg-base-200 shadow-xl">
    <div class="head bg-gray-100 p-2 space-y-2 text-2xl font-bold">
      <p>{title}</p>
      <hr />
    </div>
    <div class="content h-full space-y-2 px-2 overflow-hidden">
      <slot />
    </div>
    <div class="footer flex flex-col p-2 justify-center space-y-2">
      <hr />
      <div class="justify-center space-x-1">
        <!-- <Button bind:disabled={loading} width="w-20" color="Success" on:click={() => dispatch('accept')}>
          Accept
        </Button>
        <Button bind:disabled={loading} width="w-20" color="Error" on:click={() => { dispatch('close'); open = false; }}>
          Close
        </Button> -->
      </div>
    </div>
  </div>
</div>
{/if}