<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: any;
  export let placeholder = "";
  
  const dispatch = createEventDispatcher();

  function handle_on_change(e: any) {
    dispatch('change', e.target.value);
  }
</script>

<input 
  class="w-full bg-base-300 outline-none px-2 py-1 border-b-2 border-base-200 focus:border-accent-100" 
  bind:value={value} 
  placeholder={placeholder}
  on:change={handle_on_change} 
/>