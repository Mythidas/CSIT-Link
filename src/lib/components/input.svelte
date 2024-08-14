<script lang="ts">
  export let value: any;
  export let placeholder: string = "Placeholder..."
  export let required: boolean = false;
</script>

<div class="relative flex flex-col w-full">
  <input 
    class="p-[0.4rem] text-theme-dark-font-100 rounded-md shadow-md transition-all outline-none outline-1 caret-theme-dark-font-100 bg-theme-dark-300/75 placeholder:text-theme-dark-font-300 focus:outline-theme-dark-accent hover:outline-theme-dark-500" 
    placeholder={placeholder}
    required={required}
    bind:value
  />
</div>