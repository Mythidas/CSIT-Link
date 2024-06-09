import { AUTH_MICROSOFT_ENTRA_ID_ID, AUTH_MICROSOFT_ENTRA_ID_SECRET, AUTH_MICROSOFT_ENTRA_ID_TENANT_ID } from "$env/static/private"
import { SvelteKitAuth } from "@auth/sveltekit"
import Entra from "@auth/sveltekit/providers/microsoft-entra-id"
 
export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  providers: [
    Entra({
      clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
      tenantId: AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
    }),
  ],
})