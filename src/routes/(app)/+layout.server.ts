import * as db from "$lib/server/database";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url, cookies }) {
  const auth_token = cookies.get("auth_token") || "";
  const auth_data = await db.get_auth(locals.db_conn, auth_token);
  if (new Date(auth_data.expiration).getTime() <= Date.now()) {
    redirect(301, "/login");
  }

  try {
    const db_sites = await db.get_sites(locals.db_conn);
    const db_site = await db.get_site_from_url(locals.db_conn, url.pathname);

    return {
      sites: db_sites,
      current_site: db_site,
    }
  } catch (err) {
    console.log(err);
  }
}