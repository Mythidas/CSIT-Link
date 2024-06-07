<script lang="ts">
  import { SignIn } from "@auth/sveltekit/components"
</script>
 
<header>
  <nav>
    <SignIn provider="microsoft-entra-id" options={{ redirectTo: "/sites" }}>
      <span slot="submitButton">Sign In with Entra ID</span>
    </SignIn>
  </nav>
</header>