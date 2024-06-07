import { redirect } from "@sveltejs/kit";

export async function load({ locals, params }) {
  const session = await locals.auth();
  console.log(session);
  if (!session) {
    return redirect(302, "/auth/signin");
  }

  return session;
}