import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  redirect(301, "/sites")
}