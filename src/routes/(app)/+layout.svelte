<script lang="ts">
  import "../../app.css"
  import Link from "$lib/components/link.svelte";
    import Icon from "$lib/components/icon.svelte";
</script>

<main class="flex w-screen h-screen bg-base-100 text-font">
  <nav class="flex flex-col w-32 h-full p-1 bg-base-000 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]">
    <Link label="Sites" href="/sites">
      <Icon icon="Home" />
    </Link>
  </nav>
  <div class="w-full h-full p-2">
    <slot />
  </div>
</main>