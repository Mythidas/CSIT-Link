import * as db from "$lib/server/database_v2.js";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url, cookies }) {
  const session = await locals.auth();
  if (!session) {
    return redirect(302, "/auth/signin");
  }

  const is_admin = session.user?.email === "blake@centriserveit.com" || false;

  if (!is_admin && url.pathname.includes("/reports")) {
    return redirect(302, "/sites");
  }

  const db_sites = await db.get_sites(locals.db_conn, [], [], [], { key: "title", group: "Site", type: "", asc: true });

  for await (const site of db_sites) {
    if (new Date().getTime() - new Date(site.last_update).getTime() >= 3600 * 1000) {
      await db.update_site_devices(locals.db_conn, site.site_id, cookies);
    }
  }

  return {
    session,
    is_admin,
    sites: db_sites
  };
}