<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let checked: any;
  export let label: string;
  export let id: string;

  const dispatch = createEventDispatcher();

  function on_input() {
    dispatch('input', checked);
  }
</script>

<input id={id} type="checkbox" class="w-4 scale-125 accent-theme-dark-400" bind:checked={checked} on:input={on_input}/>
<label for={id}>{label}</label>