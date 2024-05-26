<script>
  import { createEventDispatcher } from 'svelte'
  import Button from './button.svelte';
  
  export let open = false;
  export let title = "";

  const dispatch = createEventDispatcher();
</script>

{#if open}
<div class="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
  <div class="modal-overlay fixed w-full h-full bg-base-100 bg-opacity-75"></div>
  <div class="z-50 w-1/2 p-2 mx-auto space-y-2 bg-base-200 shadow-xl overflow-y-auto">
    <div class="head bg-gray-100 p-2 text-2xl font-bold">
      {title}
    </div>
    <hr />
    <div class="content p-2">
      <slot />
    </div>
    <hr />
    <div class="footer flex p-2 justify-center space-x-1">
      <Button width="w-20" color="Success" on:click={() => dispatch('accept')}>
        Accept
      </Button>
      <Button width="w-20" color="Error" on:click={() => { dispatch('close'); open = false; }}>
        Close
      </Button>
    </div>
  </div>
</div>
{/if}