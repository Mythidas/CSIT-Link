<script lang="ts">
  export let on_click: () => void = () => {};
</script>

<button class="p-2 transition bg-base-300 shadow-md border-b-2 border-base-300 hover:border-accent-100" on:click={on_click}>
  <slot />
</button>