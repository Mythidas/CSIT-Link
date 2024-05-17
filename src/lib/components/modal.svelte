<script lang="ts">
  export let show_modal: boolean;

  let dialog: HTMLDialogElement;

  $: if (dialog && show_modal) {
    dialog.showModal();
  } else if (dialog && !show_modal) {
    dialog.close();
  };
</script>

{#if show_modal}
<dialog
  bind:this={dialog}
  on:close={() => (show_modal = false)}
  class="flex flex-col w-2/3 h-2/3 text-font p-3 bg-base-200 backdrop:backdrop-blur-[1px]"
>
  <div class="flex w-full h-full">
    <slot />
  </div>
</dialog>
{/if}