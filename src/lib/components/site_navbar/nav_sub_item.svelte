<script lang="ts">
  import { page } from "$app/stores";

  export let label: string;
  export let href: string = "";
  export let icon: string = "";
</script>

<a href={href} class={`${$page.url.pathname === href && "bg-cscol-000"} flex relative w-full h-fit py-1 hover:bg-cscol-100`}>
  <div class="pl-1 w-7"><img src={icon} alt="" /></div>
  <div class="pl-1">
    {label}
  </div>
</a>