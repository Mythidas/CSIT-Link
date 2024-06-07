<script lang="ts">
  import { SignOut } from "@auth/sveltekit/components"
</script>
 
<header>
  <nav>
    <SignOut>
      <span slot="submitButton">Sign Out with Entra ID</span>
    </SignOut>
  </nav>
</header>