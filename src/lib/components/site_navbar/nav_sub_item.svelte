<script lang="ts">
  import { page } from "$app/stores";

  export let label: string;
  export let href: string = "";
</script>

<a href={href} class={`${$page.url.pathname === href && "bg-cscol-100"} text-center justify-center py-1 hover:bg-cscol-100`}>
  {label}
</a>