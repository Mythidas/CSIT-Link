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

  return {
    session,
    is_admin,
    sites: db_sites
  };
}