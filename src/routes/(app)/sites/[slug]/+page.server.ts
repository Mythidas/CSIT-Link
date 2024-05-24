import * as db from "$lib/server/database_v2";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, params }) {
  try {
    const db_site = await db.get_site(locals.db_conn, Number(params.slug || -1));
    if (!db_site) {
      redirect(301, "/sites");
    }

    const db_devices = await db.get_devices_by_site_id(locals.db_conn, db_site.site_id);

    return {
      site: db_site,
      devices: db_devices
    }
  } catch (err) {
    console.log(err);
  }
}