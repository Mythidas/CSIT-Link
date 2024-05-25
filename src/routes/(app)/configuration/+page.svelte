<script>
  import Button from "$lib/components/button.svelte";
  import Icon from "$lib/components/icon.svelte";

</script>

<div class="flex w-full space-x-2 text-2xl justify-center text-center">
  <Button href="/configuration/companies">
    <div class="w-48 py-2 stroke-font">
      <div class="mx-auto w-fit">
        <Icon icon="Home" size={48}/>
      </div>
      <p>Companies</p>
    </div>
  </Button>
  <Button href="/configuration/sites">
    <div class="w-48 py-2 stroke-font">
      <div class="mx-auto w-fit">
        <Icon icon="Home" size={48}/>
      </div>
      <p>Sites</p>
    </div>
  </Button>
</div>