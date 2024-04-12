<script lang="ts">
	export let title = '';
	let isHovered = false;
	let x: number;
	let y: number;
	
	function mouseOver(event: any) {
		isHovered = true;
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseMove(event: any) {
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="w-full h-fit p-0 m-0"
	on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}>
	<slot />
</div>

{#if isHovered}
	<div style="top: {y}px; left: {x}px;" class={`absolute bg-cscol-000 shadow-md p-2 font-normal text-base text-cscol-font`}>{title}</div>
{/if}