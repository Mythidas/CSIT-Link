<script lang="ts">
	export let title = '';

	let isHovered = false;
	
	function mouseOver(event: any) {
		isHovered = true;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class={`flex flex-col w-full h-full`} on:mouseover={mouseOver} on:mouseleave={mouseLeave}>
  <slot />
</div>

{#if isHovered}
<div class={`flex text-center absolute top-8 w-fit z-[1000] bg-cscol-000 shadow-md p-2 font-normal text-base text-cscol-font`}>
  {title}
</div>
{/if}