import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const session = await locals.auth();
  if (!session) {
    return redirect(302, "/auth/signin");
  }

  return session;
}