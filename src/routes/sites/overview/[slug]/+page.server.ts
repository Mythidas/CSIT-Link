import * as db from "$lib/server/database";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const db_site = await db.get_site_from_url(locals.db_conn, url.pathname);
  if (!db_site) {
    redirect(302, "/sites");
  }

  try {
    return {
      site: db_site,
    }
  } catch (err) {
    console.log(err);
  }
}