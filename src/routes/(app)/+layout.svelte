<script lang="ts">
  import "../../app.css"
  import Link from "$lib/components/gradient/link.svelte";
</script>

<main class="flex w-screen h-screen bg-base-100 text-font">
  <nav class="flex flex-col w-32 h-full p-1 bg-base-000 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]">
    <Link label="Devices" href="/">
      <svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    </Link>
  </nav>
  <div class="w-full h-full p-2">
    <slot />
  </div>
</main>