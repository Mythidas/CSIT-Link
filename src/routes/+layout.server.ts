import * as db from "$lib/server/database";

export async function load({ locals, url, cookies }) {
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