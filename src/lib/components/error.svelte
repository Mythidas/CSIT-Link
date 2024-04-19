<script lang="ts">
  export let message: string;
  export let visible: boolean;
  export let duration: number = 2000;

  $: {
    if (visible) {
      setTimeout(() => {visible = false; console.log("testsa")}, duration);
    }
  }
</script>

<div class={`${!visible ? "-top-40" : "top-10"} fixed inset-x-0 mx-auto w-fit h-fit p-3 transition-all animate-ping-sm shadow-lg z-[1000] bg-errcol-100 text-2xl text-cscol-font text-center justify-center`}>
  {message}
</div>

<div class={`${!visible ? "-top-40" : "top-10"} fixed inset-x-0 mx-auto w-fit h-fit p-3 transition-all shadow-lg z-[1000] bg-errcol-100 text-2xl text-cscol-font text-center justify-center`}>
  {message}
</div>