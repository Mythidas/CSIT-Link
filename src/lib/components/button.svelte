<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let href = "";
  export let selected = false;
  export let width = "h-fit";
  export let color: "Base" | "Success" | "Error" = "Base";
  export let disabled = false;

  const dispatch = createEventDispatcher();
  
  $: _color = color === "Base" ? "bg-base-300" : color === "Success" ? "bg-success" : "bg-error";
  $: _class = `${selected ? "stroke-accent-100 border-accent-100" : "border-base-200"} 
  ${width} p-2 transition ${!disabled ? _color : "bg-base-200"} text-center shadow-md border-b-2 hover:stroke-accent-100 hover:border-accent-100`;
  
  function handle_on_click() {
    if (disabled) return;
    dispatch('click', null);
  }

</script>

{#if href}
<a href={href} class={_class} on:click={handle_on_click}>
  <slot />
</a>
{:else}
<button class={_class} on:click={handle_on_click}>
  <slot />
</button>
{/if}