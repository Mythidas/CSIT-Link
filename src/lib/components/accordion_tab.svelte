<script lang="ts">
  import Button from "./button.svelte";
  import Icon from "./icon.svelte";

  export let title;
  export let state: "Min" | "Mid" | "Max" = "Min";

  $: height = state === "Min" ? "h-0" : state === "Mid" ? "h-72" : "h-full";

  function on_title() {
    if (state === "Min") state = "Max";
    else state = "Min";
  }
</script>

<div class={`flex flex-col w-full ${state === "Max" ? "h-full" : "h-fit"} transition-all p-2 bg-base-200 shadow-md overflow-hidden`}>
  <div class="flex justify-between text-font text-xl">
    <div class="w-fit">
      <Button on:click={on_title}>
        {title}
      </Button>
    </div>
    <div class="flex stroke-font space-x-0.5">
      <Button on:click={() => state = "Min"} selected={state === "Min"}>
        <Icon icon="Minus"/>
      </Button>
      <Button on:click={() => state = "Mid"} selected={state === "Mid"}>
        <Icon icon="Minimize"/>
      </Button>
      <Button on:click={() => state = "Max"} selected={state === "Max"}>
        <Icon icon="Maximize"/>
      </Button>
    </div>
  </div>
  <div class={`${height} w-full transition-all ${state !== "Min" && "pt-2"} overflow-hidden`}>
    <slot />
  </div>
</div>