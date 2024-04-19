<script lang="ts">
  import "../../../app.css";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  export let form;

  $: {
    if (form?.success) {
      goto("/");
    }
  }
</script>

<main class="relative flex w-screen h-screen bg-cscol-600 text-cscol-font">
  {#if form?.success}
  <div class="flex flex-col m-auto w-1/4 h-fit p-3 bg-cscol-400 text-center text-2xl shadow-md rounded-sm space-y-4">
    Successfully logged in!
  </div>
  {:else}
  <form class="flex flex-col m-auto w-1/4 h-fit p-3 bg-cscol-400 shadow-md rounded-sm space-y-4" method="post" use:enhance>
    <div>
      <label class="text-2xl" for="username">Username</label>
      <input name="username" class="w-full text-xl p-1 outline-none border-2 focus:border-cscol-200 border-cscol-000 text-cscol-600" placeholder="Username" />
    </div>
    <div>
      <label class="mt-4 text-2xl" for="username">Password</label>
      <input name="password" type="password" class="w-full text-xl p-1 outline-none border-2 focus:border-cscol-200 border-cscol-000 text-cscol-600" placeholder="Password" />
    </div>
    <button type="submit" class="bg-cscol-000 py-2 px-3 rounded-sm hover:bg-cscol-100">
      Login
    </button>
  </form>
  {/if}
</main>