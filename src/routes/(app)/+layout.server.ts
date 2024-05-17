import { redirect } from "@sveltejs/kit";

export async function load({ locals, url, cookies }) {
  if (url.pathname === "/") {
    redirect(301, "/sites");
  }
}