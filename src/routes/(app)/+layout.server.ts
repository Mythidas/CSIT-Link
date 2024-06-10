import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const session = await locals.auth();
  if (!session && !dev) {
    return redirect(302, "/auth/signin");
  }

  return session;
}